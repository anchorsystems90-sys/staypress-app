export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export type HashOptions = {
  algorithm: HashAlgorithm
  output: 'hex' | 'base64'
}

export type HashResult =
  | { ok: true; digest: string; algorithm: HashAlgorithm; bytes: number }
  | { ok: false; error: string }

export const HASH_ALGORITHMS: readonly HashAlgorithm[] = [
  'SHA-1',
  'SHA-256',
  'SHA-384',
  'SHA-512',
]

export const DEFAULT_HASH_OPTIONS: HashOptions = {
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

export async function hashText(
  input: string,
  options: HashOptions = DEFAULT_HASH_OPTIONS,
): Promise<HashResult> {
  if (!input) {
    return { ok: false, error: 'Paste some text to hash.' }
  }
  try {
    const data = new TextEncoder().encode(input)
    const digest = await crypto.subtle.digest(options.algorithm, data)
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
          : 'Could not hash that text in this browser.',
    }
  }
}
