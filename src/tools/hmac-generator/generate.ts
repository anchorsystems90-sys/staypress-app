export type HmacAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export type HmacOptions = {
  algorithm: HmacAlgorithm
  output: 'hex' | 'base64'
}

export type HmacResult =
  | { ok: true; digest: string; algorithm: HmacAlgorithm; bytes: number }
  | { ok: false; error: string }

export const HMAC_ALGORITHMS: readonly HmacAlgorithm[] = [
  'SHA-1',
  'SHA-256',
  'SHA-384',
  'SHA-512',
]

export const DEFAULT_HMAC_OPTIONS: HmacOptions = {
  algorithm: 'SHA-256',
  output: 'hex',
}

function bytesToHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function bytesToBase64(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes)
  let binary = ''
  for (const byte of view) binary += String.fromCharCode(byte)
  return btoa(binary)
}

export async function hmacText(
  message: string,
  secret: string,
  options: HmacOptions = DEFAULT_HMAC_OPTIONS,
): Promise<HmacResult> {
  if (!message) {
    return { ok: false, error: 'Paste a message to sign.' }
  }
  if (!secret) {
    return { ok: false, error: 'Enter a secret key.' }
  }
  try {
    const encoder = new TextEncoder()
    const keyBytes = encoder.encode(secret)
    const data = encoder.encode(message)
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: options.algorithm },
      false,
      ['sign'],
    )
    const digest = await crypto.subtle.sign('HMAC', key, data)
    const encoded =
      options.output === 'base64' ? bytesToBase64(digest) : bytesToHex(digest)
    return {
      ok: true,
      digest: encoded,
      algorithm: options.algorithm,
      bytes: digest.byteLength,
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Could not compute HMAC in this browser.',
    }
  }
}
