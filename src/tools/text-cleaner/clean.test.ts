import { describe, expect, it } from 'vitest'
import {
  DEFAULT_CLEAN_OPTIONS,
  cleanText,
  formatDelta,
  stripHtml,
  textDelta,
  textStats,
  type CleanOptions,
} from './clean'

const base = DEFAULT_CLEAN_OPTIONS

function opts(partial: Partial<CleanOptions>): CleanOptions {
  return { ...base, ...partial }
}

describe('cleanText defaults', () => {
  it('runs the default pipeline', () => {
    expect(cleanText('  hello   world  \n\tfoo  ', base)).toBe('hello world\nfoo')
  })

  it('normalizes CRLF and CR', () => {
    expect(
      cleanText('a\r\nb\rc', opts({ trimLines: false, collapseSpaces: false, tabsToSpaces: false })),
    ).toBe('a\nb\nc')
  })
})

describe('join lines', () => {
  it('joins lines with spaces and defaults off', () => {
    expect(base.joinLines).toBe(false)
    expect(
      cleanText('Line one\nLine two', opts({ joinLines: true, removeBlankLines: false })),
    ).toBe('Line one Line two')
  })

  it('is distinct from remove blank lines', () => {
    const input = 'a\n\nb\nc'
    expect(cleanText(input, opts({ joinLines: false, removeBlankLines: true }))).toBe('a\nb\nc')
    expect(cleanText(input, opts({ joinLines: true, removeBlankLines: true }))).toBe('a b c')
  })

  it('works with trim and collapse', () => {
    expect(
      cleanText('  hello  \n  world  ', opts({ joinLines: true, trimLines: true, collapseSpaces: true })),
    ).toBe('hello world')
  })

  it('collapses blank-line gaps when joining without removeBlankLines', () => {
    expect(
      cleanText('a\n\nb', opts({ joinLines: true, removeBlankLines: false, collapseSpaces: true })),
    ).toBe('a b')
  })
})

describe('duplicate lines and ordering', () => {
  it('dedupes exact lines after trim', () => {
    expect(
      cleanText('a\n a\na', opts({ removeDuplicateLines: true, trimLines: true })),
    ).toBe('a')
  })

  it('keeps whitespace-different duplicates when trim is off', () => {
    expect(
      cleanText('a\n a', opts({
        removeDuplicateLines: true,
        trimLines: false,
        collapseSpaces: false,
        tabsToSpaces: false,
      })),
    ).toBe('a\n a')
  })
})

describe('HTML stripping and entities', () => {
  it('strips tags and decodes named entities', () => {
    expect(stripHtml('<p>Hi &amp; there</p><script>x()</script>')).toContain('Hi & there')
    expect(stripHtml('&lt;b&gt;')).toBe('<b>')
    expect(stripHtml('&quot;x&quot; &apos;y&apos;')).toBe('"x" \'y\'')
    expect(stripHtml('&copy;')).toBe('©')
  })

  it('decodes numeric decimal and hex entities', () => {
    expect(stripHtml('&#169;')).toBe('©')
    expect(stripHtml('&#8212;')).toBe('—')
    expect(stripHtml('&#x1F600;')).toBe('😀')
  })

  it('preserves Unicode letters through stripHtml option', () => {
    expect(cleanText('<b>naïve</b>', opts({ stripHtml: true }))).toBe('naïve')
  })
})

describe('unicode / emoji / large input', () => {
  it('keeps emoji unless special-char removal is on', () => {
    expect(cleanText('hi 😀 there', base)).toContain('😀')
    expect(cleanText('hi 😀 there', opts({ removeSpecialChars: true }))).not.toContain('😀')
  })

  it('handles a large-ish input quickly', () => {
    const input = (`word `.repeat(200) + '\n').repeat(40)
    const t0 = performance.now()
    const out = cleanText(input, opts({ joinLines: true, removeBlankLines: true }))
    expect(performance.now() - t0).toBeLessThan(50)
    expect(out.length).toBeGreaterThan(0)
  })
})

describe('stats and delta', () => {
  it('counts words and formats deltas', () => {
    expect(textStats('one two three')).toEqual({ characters: 13, words: 3, lines: 1 })
    expect(textDelta('a b c', 'a b')).toEqual({ characters: -2, words: -1, lines: 0 })
    expect(formatDelta({ characters: -4, words: 0, lines: -2 })).toContain('-4 characters')
  })
})
