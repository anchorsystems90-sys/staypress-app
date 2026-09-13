import { describe, expect, it } from 'vitest'
import {
  DEFAULT_JSON_OPTIONS,
  SAMPLE_JSON,
  buildErrorContext,
  countSourceLines,
  extractJsonErrorPosition,
  formatJson,
  inspectJson,
  jsonDocStats,
  mapTrimmedErrorLineToSource,
  offsetToLineColumn,
  parseJsonIssue,
  sortedObjectKeys,
  stringifyJson,
  utf8ByteLength,
  type JsonFormatOptions,
} from './formatJson'

function opts(partial: Partial<JsonFormatOptions> = {}): JsonFormatOptions {
  return { ...DEFAULT_JSON_OPTIONS, ...partial }
}

describe('formatJson pretty / minify', () => {
  it('formats objects and arrays with 2-space indent by default', () => {
    expect(formatJson('{"a":1,"b":[2,3]}', 'pretty', opts())).toEqual({
      ok: true,
      text: '{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}',
    })
  })

  it('formats nested data', () => {
    const result = formatJson(
      '{"u":{"n":"A","items":[1,{"x":true}]}}',
      'pretty',
      opts(),
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.text).toContain('"n": "A"')
    expect(result.text).toContain('"x": true')
  })

  it('supports 4-space indent', () => {
    expect(formatJson('{"a":1}', 'pretty', opts({ indent: 4 }))).toEqual({
      ok: true,
      text: '{\n    "a": 1\n}',
    })
  })

  it('supports tab indent', () => {
    expect(formatJson('{"a":1}', 'pretty', opts({ indent: '\t' }))).toEqual({
      ok: true,
      text: '{\n\t"a": 1\n}',
    })
  })

  it('minifies without using indent choice', () => {
    expect(
      formatJson('{\n  "a": 1,\n  "b": 2\n}', 'minify', opts({ indent: 4 })),
    ).toEqual({
      ok: true,
      text: '{"a":1,"b":2}',
    })
  })

  it('handles empty object and array', () => {
    expect(formatJson('{}', 'pretty', opts())).toEqual({ ok: true, text: '{}' })
    expect(formatJson('[]', 'pretty', opts())).toEqual({ ok: true, text: '[]' })
  })

  it('trims surrounding whitespace and accepts BOM', () => {
    expect(formatJson('  {"a":1}  ', 'minify', opts())).toEqual({
      ok: true,
      text: '{"a":1}',
    })
    expect(formatJson('\uFEFF{"a":1}', 'minify', opts())).toEqual({
      ok: true,
      text: '{"a":1}',
    })
  })

  it('preserves Unicode and emoji', () => {
    const result = formatJson('{"note":"café ☕","ok":true}', 'pretty', opts())
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.text).toContain('café ☕')
  })

  it('returns empty for whitespace-only input', () => {
    expect(formatJson('   \n\t  ', 'pretty', opts())).toEqual({
      ok: false,
      empty: true,
      error: null,
    })
  })
})

describe('sort keys option', () => {
  it('defaults sortKeys OFF and preserves parsed key order', () => {
    expect(DEFAULT_JSON_OPTIONS.sortKeys).toBe(false)
    expect(
      formatJson('{"z":1,"a":2,"m":3}', 'minify', opts({ sortKeys: false })),
    ).toEqual({ ok: true, text: '{"z":1,"a":2,"m":3}' })
  })

  it('sorts top-level and nested object keys', () => {
    expect(stringifyJson({ z: { b: 1, a: 2 }, a: 0 }, 'minify', 2, true)).toBe(
      '{"a":0,"z":{"a":2,"b":1}}',
    )
  })

  it('preserves array order while sorting objects inside arrays', () => {
    expect(
      stringifyJson(
        { items: [{ z: 1, a: 2 }, { m: 3, b: 4 }] },
        'minify',
        2,
        true,
      ),
    ).toBe('{"items":[{"a":2,"z":1},{"b":4,"m":3}]}')
  })

  it('sorts numeric-looking and mixed-case keys lexicographically (UTF-16)', () => {
    expect(sortedObjectKeys({ '2': 2, '10': 10, b: 1, A: 0, a: 2 })).toEqual([
      '10',
      '2',
      'A',
      'a',
      'b',
    ])
    expect(
      stringifyJson({ '2': 2, '10': 10, b: 1, A: 0, a: 2 }, 'minify', 2, true),
    ).toBe('{"10":10,"2":2,"A":0,"a":2,"b":1}')
  })

  it('sorts Unicode keys deterministically', () => {
    // UTF-16 code units: A (65) < Ω (937) < α (945)
    expect(sortedObjectKeys({ Ω: 1, α: 2, A: 0 })).toEqual(['A', 'Ω', 'α'])
    expect(stringifyJson({ Ω: 1, α: 2, A: 0 }, 'minify', 2, true)).toBe(
      '{"A":0,"Ω":1,"α":2}',
    )
  })

  it('applies sorting during format when enabled', () => {
    expect(
      formatJson('{"z":1,"a":2}', 'minify', opts({ sortKeys: true })),
    ).toEqual({ ok: true, text: '{"a":2,"z":1}' })
  })
})

describe('error helpers', () => {
  it('extracts position from common message shapes', () => {
    expect(extractJsonErrorPosition('Unexpected token at position 12')).toBe(12)
    expect(
      extractJsonErrorPosition(
        "Expected ',' or '}' after property value in JSON at position 22 (line 3 column 3)",
      ),
    ).toBe(22)
    expect(extractJsonErrorPosition('no position here')).toBeNull()
  })

  it('maps offsets to line/column and builds context with caret', () => {
    const source = '{\n  "a": 1,\n}'
    expect(offsetToLineColumn(source, 12)).toEqual({ line: 3, column: 1 })
    const ctx = buildErrorContext(source, 3, 1)
    expect(ctx).toContain('3 | }')
    expect(ctx).toContain('^')
  })

  it('falls back without fabricating location when position is missing', () => {
    const issue = parseJsonIssue(new Error('broken json'), '{"a":1}')
    expect(issue.title).toBe('Invalid JSON')
    expect(issue.message).toBe('broken json')
    expect(issue.position).toBeNull()
    expect(issue.line).toBeNull()
    expect(issue.column).toBeNull()
    expect(issue.context).toBeNull()
  })

  it('ignores out-of-range positions instead of inventing a location', () => {
    const issue = parseJsonIssue(new Error('bad at position 9999'), '{"a":1}')
    expect(issue.position).toBeNull()
    expect(issue.line).toBeNull()
  })
})

describe('inspectJson malformed cases', () => {
  const cases: { name: string; input: string }[] = [
    {
      name: 'trailing comma',
      input: '{\n  "name": "Bento",\n  "active": true,\n}',
    },
    {
      name: 'missing comma',
      input: '{\n  "name": "Bento"\n  "active": true\n}',
    },
    { name: 'missing brace', input: '{"a":1' },
    { name: 'missing bracket', input: '[1,2' },
    { name: 'single quotes', input: "{'a':1}" },
    { name: 'unquoted keys', input: '{a:1}' },
    { name: 'comments', input: '{"a":1 // hi\n}' },
    { name: 'invalid escape', input: '{"a":"\\q"}' },
    { name: 'malformed Unicode', input: '{"a":"\\uZZZZ"}' },
    { name: 'unexpected character', input: '{"a":1}@' },
    { name: 'multiple roots', input: '{"a":1}{"b":2}' },
  ]

  for (const item of cases) {
    it(`reports Invalid JSON for ${item.name}`, () => {
      const result = inspectJson(item.input)
      expect(result.ok).toBe(false)
      if (result.ok || result.empty) return
      expect(result.error.title).toBe('Invalid JSON')
      expect(result.error.message.length).toBeGreaterThan(0)
      if (result.error.position != null) {
        expect(result.error.line).toBeGreaterThan(0)
        expect(result.error.column).toBeGreaterThan(0)
        expect(result.error.context).toContain('^')
      }
    })
  }
})

describe('stats, sample, download validity', () => {
  it('counts characters, lines, and UTF-8 bytes', () => {
    expect(jsonDocStats('')).toEqual({ characters: 0, lines: 0, bytes: 0 })
    expect(jsonDocStats('a\nb')).toEqual({ characters: 3, lines: 2, bytes: 3 })
    expect(utf8ByteLength('é')).toBe(2)
    expect(utf8ByteLength('😀')).toBe(4)
    expect(jsonDocStats('é').bytes).toBe(2)
  })

  it('sample JSON is valid and formats', () => {
    const check = inspectJson(SAMPLE_JSON)
    expect(check.ok).toBe(true)
    const pretty = formatJson(SAMPLE_JSON, 'pretty', opts())
    expect(pretty.ok).toBe(true)
    if (!pretty.ok) return
    expect(pretty.text).toContain('"tool"')
    expect(pretty.text).toContain('null')
  })

  it('valid vs invalid download state helpers', () => {
    expect(inspectJson('{"ok":true}').ok).toBe(true)
    expect(inspectJson('{"ok":').ok).toBe(false)
  })
})

describe('source line counts and error-line mapping', () => {
  it('treats empty input as one gutter line', () => {
    expect(countSourceLines('')).toBe(1)
    expect(jsonDocStats('').lines).toBe(0)
  })

  it('counts one line without a newline', () => {
    expect(countSourceLines('{"a":1}')).toBe(1)
  })

  it('counts multiple lines and trailing newlines', () => {
    expect(countSourceLines('a\nb\nc')).toBe(3)
    expect(countSourceLines('a\n')).toBe(2)
    expect(countSourceLines('a\r\nb')).toBe(2)
    expect(countSourceLines('{\n  "a": 1\n}\n')).toBe(4)
  })

  it('scales to 100+ lines', () => {
    const text = Array.from({ length: 120 }, (_, i) => `"k${i}": ${i}`).join(',\n')
    expect(countSourceLines(`{\n${text}\n}`)).toBe(122)
  })

  it('reports editor-relative lines when leading blank lines are trimmed for parse', () => {
    const input = '\n\n{\n  "a": 1,\n}'
    const check = inspectJson(input)
    expect(check.ok).toBe(false)
    if (check.ok || check.empty) return
    // Physical closing-brace line is 5; structured error must match gutter.
    expect(check.error.line).toBe(5)
    expect(check.error.column).toBe(1)
    expect(check.error.context).toContain('5 | }')
  })

  it('keeps lines aligned when there is no leading whitespace', () => {
    const input = '{\n  "a": 1,\n}'
    const check = inspectJson(input)
    expect(check.ok).toBe(false)
    if (check.ok || check.empty) return
    expect(check.error.line).toBe(3)
    expect(mapTrimmedErrorLineToSource(input, 3)).toBe(3)
  })

  it('adjusts columns for leading spaces on the first content line', () => {
    const input = '   {a:1}'
    const check = inspectJson(input)
    expect(check.ok).toBe(false)
    if (check.ok || check.empty) return
    expect(check.error.line).toBe(1)
    // Trimmed error is near `{a`; editor column includes the 3 spaces.
    expect(check.error.column).toBeGreaterThanOrEqual(4)
  })

  it('returns null when no error line is available', () => {
    expect(mapTrimmedErrorLineToSource('{"a":1}', null)).toBeNull()
  })

  it('updates line counts after pretty-print and minify', () => {
    const pretty = formatJson('{"a":1,"b":2}', 'pretty', opts())
    const mini = formatJson('{"a":1,"b":2}', 'minify', opts())
    expect(pretty.ok && mini.ok).toBe(true)
    if (!pretty.ok || !mini.ok) return
    expect(countSourceLines(pretty.text)).toBeGreaterThan(1)
    expect(countSourceLines(mini.text)).toBe(1)
    expect(countSourceLines(SAMPLE_JSON)).toBeGreaterThan(5)
  })
})
