export type JsonFormatMode = 'pretty' | 'minify'

export type JsonIndent = 2 | 4 | '\t'

export type JsonFormatOptions = {
  indent: JsonIndent
  sortKeys: boolean
}

export const DEFAULT_JSON_OPTIONS: JsonFormatOptions = {
  indent: 2,
  sortKeys: false,
}

export const INDENT_CHOICES: { id: JsonIndent; label: string }[] = [
  { id: 2, label: '2 spaces' },
  { id: 4, label: '4 spaces' },
  { id: '\t', label: 'Tabs' },
]

/**
 * Deterministic key order: Array.prototype.sort() on Object.keys — UTF-16
 * code-unit order, not locale-sensitive. Integer-looking keys are still sorted
 * lexicographically here (e.g. "10" before "2"), unlike Object.keys enumeration.
 */
export function sortedObjectKeys(value: object): string[] {
  return Object.keys(value).sort()
}

/**
 * Serialize JSON. When sortKeys is true, emit object keys in sortedObjectKeys
 * order via a custom walk so engines cannot reorder integer-index keys.
 * When sortKeys is false, use native JSON.stringify (preserves parse order).
 */
export function stringifyJson(
  value: unknown,
  mode: JsonFormatMode,
  indent: JsonIndent,
  sortKeys: boolean,
): string {
  if (!sortKeys) {
    return mode === 'pretty'
      ? JSON.stringify(value, null, indent)
      : JSON.stringify(value)
  }

  const gap = mode === 'pretty' ? (indent === '\t' ? '\t' : ' '.repeat(indent)) : ''

  const walk = (node: unknown, depth: number): string => {
    if (node === null || typeof node !== 'object') {
      return JSON.stringify(node)
    }

    if (Array.isArray(node)) {
      if (node.length === 0) return '[]'
      if (!gap) {
        return `[${node.map((item) => walk(item, depth)).join(',')}]`
      }
      const inner = node
        .map((item) => `${gap.repeat(depth + 1)}${walk(item, depth + 1)}`)
        .join(',\n')
      return `[\n${inner}\n${gap.repeat(depth)}]`
    }

    const keys = sortedObjectKeys(node)
    if (keys.length === 0) return '{}'
    const record = node as Record<string, unknown>
    if (!gap) {
      return `{${keys
        .map((key) => `${JSON.stringify(key)}:${walk(record[key], depth)}`)
        .join(',')}}`
    }
    const inner = keys
      .map(
        (key) =>
          `${gap.repeat(depth + 1)}${JSON.stringify(key)}: ${walk(
            record[key],
            depth + 1,
          )}`,
      )
      .join(',\n')
    return `{\n${inner}\n${gap.repeat(depth)}}`
  }

  return walk(value, 0)
}

export type JsonParseIssue = {
  /** Always "Invalid JSON" when a parse failure is shown. */
  title: 'Invalid JSON'
  /** Native / fallback parser message (engine wording may vary). */
  message: string
  /** 0-based offset into the trimmed parse source, when known. */
  position: number | null
  /** 1-based line, derived from position when position is known. */
  line: number | null
  /** 1-based column, derived from position when position is known. */
  column: number | null
  /** Nearby source lines around the issue, when position is known. */
  context: string | null
}

export type JsonInspectResult =
  | { ok: true; text: string }
  | { ok: false; empty: true; error: null }
  | { ok: false; empty: false; error: JsonParseIssue }

export type JsonFormatResult =
  | { ok: true; text: string }
  | { ok: false; empty: true; error: null }
  | { ok: false; empty: false; error: JsonParseIssue }

/** Extract a character offset from common SyntaxError.message shapes. */
export function extractJsonErrorPosition(message: string): number | null {
  const match = /position\s+(\d+)/i.exec(message)
  if (!match) return null
  const pos = Number.parseInt(match[1], 10)
  return Number.isFinite(pos) ? pos : null
}

export function offsetToLineColumn(
  source: string,
  offset: number,
): { line: number; column: number } {
  const clamped = Math.max(0, Math.min(offset, source.length))
  const before = source.slice(0, clamped)
  const lines = before.split('\n')
  return {
    line: lines.length,
    column: (lines[lines.length - 1]?.length ?? 0) + 1,
  }
}

/** Build a small multi-line snippet with a caret under the column when possible. */
export function buildErrorContext(
  source: string,
  line: number,
  column: number,
): string {
  const lines = source.split('\n')
  const index = Math.max(0, Math.min(line - 1, lines.length - 1))
  const start = Math.max(0, index - 1)
  const end = Math.min(lines.length - 1, index + 1)
  const width = String(end + 1).length
  const parts: string[] = []

  for (let i = start; i <= end; i++) {
    const num = String(i + 1).padStart(width, ' ')
    parts.push(`${num} | ${lines[i] ?? ''}`)
    if (i === index) {
      const caretPad = ' '.repeat(width + 3 + Math.max(0, column - 1))
      parts.push(`${caretPad}^`)
    }
  }

  return parts.join('\n')
}

export function parseJsonIssue(
  err: unknown,
  parseSource: string,
  editorSource: string = parseSource,
): JsonParseIssue {
  const message =
    err instanceof Error && err.message.trim()
      ? err.message
      : 'Invalid JSON.'
  const parsePosition = extractJsonErrorPosition(message)
  if (parsePosition == null) {
    return {
      title: 'Invalid JSON',
      message,
      position: null,
      line: null,
      column: null,
      context: null,
    }
  }

  // Only trust derived location when the offset falls within the parse source.
  if (parsePosition < 0 || parsePosition > parseSource.length) {
    return {
      title: 'Invalid JSON',
      message,
      position: null,
      line: null,
      column: null,
      context: null,
    }
  }

  // Map parse-source offsets onto the editor text so Line/column/gutter match
  // what the user sees (trim() removes leading whitespace before JSON.parse).
  const leadingOffset = editorSource.length - editorSource.trimStart().length
  const position = parsePosition + leadingOffset
  if (position < 0 || position > editorSource.length) {
    return {
      title: 'Invalid JSON',
      message,
      position: null,
      line: null,
      column: null,
      context: null,
    }
  }

  const { line, column } = offsetToLineColumn(editorSource, position)
  return {
    title: 'Invalid JSON',
    message,
    position,
    line,
    column,
    context: buildErrorContext(editorSource, line, column),
  }
}

function prepareSource(input: string): string {
  return input.trim()
}

export function inspectJson(input: string): JsonInspectResult {
  const trimmed = prepareSource(input)
  if (!trimmed) return { ok: false, empty: true, error: null }

  try {
    JSON.parse(trimmed)
    return { ok: true, text: trimmed }
  } catch (err) {
    return { ok: false, empty: false, error: parseJsonIssue(err, trimmed, input) }
  }
}

export function formatJson(
  input: string,
  mode: JsonFormatMode,
  options: JsonFormatOptions = DEFAULT_JSON_OPTIONS,
): JsonFormatResult {
  const trimmed = prepareSource(input)
  if (!trimmed) return { ok: false, empty: true, error: null }

  try {
    const parsed: unknown = JSON.parse(trimmed)
    const text = stringifyJson(
      parsed,
      mode,
      options.indent,
      options.sortKeys,
    )
    return { ok: true, text }
  } catch (err) {
    return { ok: false, empty: false, error: parseJsonIssue(err, trimmed, input) }
  }
}

export type JsonDocStats = {
  characters: number
  lines: number
  bytes: number
}

/** UTF-8 byte length via TextEncoder (browser + Node). */
export function utf8ByteLength(text: string): number {
  return new TextEncoder().encode(text).length
}

export function jsonDocStats(text: string): JsonDocStats {
  if (text.length === 0) return { characters: 0, lines: 0, bytes: 0 }
  return {
    characters: text.length,
    lines: countSourceLines(text),
    bytes: utf8ByteLength(text),
  }
}

/**
 * Logical newline-delimited line count for the editor gutter.
 * Empty input is treated as one blank line.
 * A trailing newline counts as an extra line (`"a\\n"` → 2), matching
 * `String.prototype.split('\\n')`.
 */
export function countSourceLines(text: string): number {
  if (text.length === 0) return 1
  return text.split('\n').length
}

/** Count leading whitespace characters removed by trimStart before parse. */
export function leadingTrimOffset(input: string): number {
  return input.length - input.trimStart().length
}

/**
 * Map a 1-based line from trimmed parse source onto the raw editor text.
 * Prefer `inspectJson(...).error.line`, which is already editor-relative.
 */
export function mapTrimmedErrorLineToSource(
  input: string,
  trimmedLine: number | null | undefined,
): number | null {
  if (trimmedLine == null || trimmedLine < 1) return null
  const leading = input.slice(0, leadingTrimOffset(input))
  const newlineOffset =
    leading.length === 0 ? 0 : leading.split('\n').length - 1
  return trimmedLine + newlineOffset
}

export const SAMPLE_JSON = `{
  "tool": "Bento JSON Formatter",
  "version": 1,
  "active": true,
  "notes": null,
  "tags": ["format", "minify", "validate"],
  "settings": {
    "indent": 2,
    "sortKeys": false
  }
}
`
