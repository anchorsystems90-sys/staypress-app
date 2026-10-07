import {
  bytesToBase32,
  bytesToHex,
  randomBytes,
  randomIndex,
} from '../../lib/cryptoRandom'

export type ApiKeyAlphabet = 'hex' | 'base62' | 'base32' | 'base64url'

export type ApiKeyOptions = {
  length: number
  count: number
  alphabet: ApiKeyAlphabet
  prefix: string
}

export type ApiKeyResult =
  | { ok: true; keys: string[]; alphabetSize: number; bits: number }
  | { ok: false; error: string }

export const MIN_LENGTH = 8
export const MAX_LENGTH = 128
export const MIN_COUNT = 1
export const MAX_COUNT = 20

export const DEFAULT_API_KEY_OPTIONS: ApiKeyOptions = {
  length: 32,
  count: 1,
  alphabet: 'base62',
  prefix: '',
}

const BASE62 =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const BASE64URL =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

function alphabetSize(kind: ApiKeyAlphabet): number {
  switch (kind) {
    case 'hex':
      return 16
    case 'base32':
      return 32
    case 'base62':
      return 62
    case 'base64url':
      return 64
  }
}

function randomFromAlphabet(
  alphabet: string,
  length: number,
  randomByte?: () => number,
): string {
  let out = ''
  for (let i = 0; i < length; i++) {
    out += alphabet[randomIndex(alphabet.length, randomByte)]!
  }
  return out
}

export function generateApiKey(
  options: ApiKeyOptions,
  fill?: (buf: Uint8Array) => void,
  randomByte?: () => number,
): string {
  const length = Math.min(
    MAX_LENGTH,
    Math.max(MIN_LENGTH, Math.floor(options.length) || MIN_LENGTH),
  )
  const prefix = options.prefix.trim().slice(0, 32)
  let body: string
  switch (options.alphabet) {
    case 'hex': {
      const bytes = randomBytes(Math.ceil(length / 2), fill)
      body = bytesToHex(bytes).slice(0, length)
      break
    }
    case 'base32': {
      const bytes = randomBytes(Math.ceil((length * 5) / 8) + 1, fill)
      body = bytesToBase32(bytes).toLowerCase().slice(0, length)
      break
    }
    case 'base62':
      body = randomFromAlphabet(BASE62, length, randomByte)
      break
    case 'base64url':
      body = randomFromAlphabet(BASE64URL, length, randomByte)
      break
  }
  return prefix ? `${prefix}${body}` : body
}

export function generateApiKeys(
  options: ApiKeyOptions,
  fill?: (buf: Uint8Array) => void,
  randomByte?: () => number,
): ApiKeyResult {
  const length = Math.min(
    MAX_LENGTH,
    Math.max(MIN_LENGTH, Math.floor(options.length) || MIN_LENGTH),
  )
  const count = Math.min(
    MAX_COUNT,
    Math.max(MIN_COUNT, Math.floor(options.count) || MIN_COUNT),
  )
  const normalized = {
    ...options,
    length,
    count,
    prefix: options.prefix.trim().slice(0, 32),
  }

  try {
    const keys = Array.from({ length: count }, () =>
      generateApiKey(normalized, fill, randomByte),
    )
    const size = alphabetSize(normalized.alphabet)
    return {
      ok: true,
      keys,
      alphabetSize: size,
      bits: Math.log2(size) * length,
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Could not generate an API key.',
    }
  }
}
