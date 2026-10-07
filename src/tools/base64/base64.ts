export type Base64Mode = 'encode' | 'decode'

export type Base64Options = {
  /** Use URL-safe alphabet (-_) instead of +/. */
  urlSafe: boolean
}

export type Base64Result =
  | {
      ok: true
      text: string
      inputBytes: number
      outputBytes: number
    }
  | {
      ok: false
      error: string
      empty?: boolean
    }

export const DEFAULT_BASE64_OPTIONS: Base64Options = {
  urlSafe: false,
}

export const SAMPLE_PLAIN = 'Bento Tools — useful tools. No signup.'
export const SAMPLE_BASE64 =
  'QmVudG8gVG9vbHMg4oCUdXNlZnVsIHRvb2xzLiBObyBzaWdudXAu'

function bytesToBinary(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return binary
}

function binaryToBytes(binary: string): Uint8Array {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function toUrlSafe(value: string): string {
  return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

/** Normalize pasted Base64: strip whitespace, accept URL-safe, restore padding. */
export function normalizeBase64Input(input: string): string {
  let value = input.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')
  const pad = value.length % 4
  if (pad === 1) {
    throw new Error('Base64 length is invalid.')
  }
  if (pad > 0) value += '='.repeat(4 - pad)
  return value
}

export function encodeBase64(
  input: string,
  options: Base64Options = DEFAULT_BASE64_OPTIONS,
): Base64Result {
  if (!input) {
    return { ok: false, empty: true, error: 'Paste text to encode as Base64.' }
  }

  try {
    const bytes = new TextEncoder().encode(input)
    let encoded = btoa(bytesToBinary(bytes))
    if (options.urlSafe) encoded = toUrlSafe(encoded)
    return {
      ok: true,
      text: encoded,
      inputBytes: bytes.length,
      outputBytes: new TextEncoder().encode(encoded).length,
    }
  } catch {
    return { ok: false, error: 'Could not encode that text as Base64.' }
  }
}

export function decodeBase64(input: string): Base64Result {
  if (!input.trim()) {
    return { ok: false, empty: true, error: 'Paste Base64 to decode.' }
  }

  try {
    const normalized = normalizeBase64Input(input)
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
      return {
        ok: false,
        error: 'That does not look like valid Base64.',
      }
    }
    const binary = atob(normalized)
    const bytes = binaryToBytes(binary)
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    return {
      ok: true,
      text,
      inputBytes: new TextEncoder().encode(input.replace(/\s+/g, '')).length,
      outputBytes: bytes.length,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not decode that Base64.'
    return { ok: false, error: message }
  }
}

export function convertBase64(
  mode: Base64Mode,
  input: string,
  options: Base64Options = DEFAULT_BASE64_OPTIONS,
): Base64Result {
  return mode === 'encode'
    ? encodeBase64(input, options)
    : decodeBase64(input)
}

export function sampleForMode(mode: Base64Mode): string {
  return mode === 'encode' ? SAMPLE_PLAIN : SAMPLE_BASE64
}
