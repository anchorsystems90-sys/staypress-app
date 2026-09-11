export type JsonFormatMode = 'pretty' | 'minify'

export type JsonFormatResult =
  | { ok: true; text: string }
  | { ok: false; error: string }

export function formatJson(
  input: string,
  mode: JsonFormatMode,
): JsonFormatResult {
  const trimmed = input.trim()
  if (!trimmed) return { ok: false, error: 'Paste JSON to format it.' }

  try {
    const parsed: unknown = JSON.parse(trimmed)
    const text =
      mode === 'pretty' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed)
    return { ok: true, text }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid JSON.'
    return { ok: false, error: message }
  }
}

export function inspectJson(input: string): JsonFormatResult {
  const trimmed = input.trim()
  if (!trimmed) return { ok: false, error: 'Paste JSON to check it.' }
  try {
    JSON.parse(trimmed)
    return { ok: true, text: trimmed }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid JSON.'
    return { ok: false, error: message }
  }
}
