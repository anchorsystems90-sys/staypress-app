import { randomIndex } from '../../lib/cryptoRandom'

export type PasswordOptions = {
  length: number
  lowercase: boolean
  uppercase: boolean
  digits: boolean
  symbols: boolean
  excludeAmbiguous: boolean
  count: number
}

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4
  label: 'Too weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong'
  /** Approximate bits of entropy from length × charset size. */
  bits: number
}

export type GenerateResult =
  | { ok: true; passwords: string[]; charsetSize: number; strength: PasswordStrength }
  | { ok: false; error: string }

export const MIN_LENGTH = 4
export const MAX_LENGTH = 128
export const MIN_COUNT = 1
export const MAX_COUNT = 20

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  lowercase: true,
  uppercase: true,
  digits: true,
  symbols: true,
  excludeAmbiguous: true,
  count: 1,
}

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/'
const AMBIGUOUS = new Set(['0', 'O', '1', 'l', 'I', '|'])

function stripAmbiguous(chars: string): string {
  return [...chars].filter((ch) => !AMBIGUOUS.has(ch)).join('')
}

/** Build the character pool from options. */
export function buildCharset(options: PasswordOptions): string {
  const pools: string[] = []
  if (options.lowercase) pools.push(LOWER)
  if (options.uppercase) pools.push(UPPER)
  if (options.digits) pools.push(DIGITS)
  if (options.symbols) pools.push(SYMBOLS)

  let charset = pools.join('')
  if (options.excludeAmbiguous) charset = stripAmbiguous(charset)

  // Deduplicate while preserving order.
  return [...new Set(charset)].join('')
}

/** Required sets (after ambiguous filtering) so passwords can include each chosen type. */
export function requiredPools(options: PasswordOptions): string[] {
  const pools: string[] = []
  if (options.lowercase) {
    const pool = options.excludeAmbiguous ? stripAmbiguous(LOWER) : LOWER
    if (pool) pools.push(pool)
  }
  if (options.uppercase) {
    const pool = options.excludeAmbiguous ? stripAmbiguous(UPPER) : UPPER
    if (pool) pools.push(pool)
  }
  if (options.digits) {
    const pool = options.excludeAmbiguous ? stripAmbiguous(DIGITS) : DIGITS
    if (pool) pools.push(pool)
  }
  if (options.symbols) {
    const pool = options.excludeAmbiguous ? stripAmbiguous(SYMBOLS) : SYMBOLS
    if (pool) pools.push(pool)
  }
  return pools
}

export { randomIndex }

function pickChar(pool: string, randomByte?: () => number): string {
  return pool[randomIndex(pool.length, randomByte)]!
}

/** Fisher–Yates shuffle with crypto randomness. */
export function shuffle<T>(items: T[], randomByte?: () => number): T[] {
  const next = items.slice()
  for (let i = next.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1, randomByte)
    ;[next[i], next[j]] = [next[j]!, next[i]!]
  }
  return next
}

export function estimateStrength(
  length: number,
  charsetSize: number,
): PasswordStrength {
  if (length <= 0 || charsetSize <= 1) {
    return { score: 0, label: 'Too weak', bits: 0 }
  }
  const bits = Math.log2(charsetSize) * length
  if (bits < 28) return { score: 0, label: 'Too weak', bits }
  if (bits < 36) return { score: 1, label: 'Weak', bits }
  if (bits < 60) return { score: 2, label: 'Fair', bits }
  if (bits < 80) return { score: 3, label: 'Strong', bits }
  return { score: 4, label: 'Very strong', bits }
}

export function generatePassword(
  options: PasswordOptions,
  randomByte?: () => number,
): string {
  const charset = buildCharset(options)
  const pools = requiredPools(options)
  if (!charset || pools.length === 0) {
    throw new Error('Select at least one character set.')
  }
  const length = Math.min(
    MAX_LENGTH,
    Math.max(MIN_LENGTH, Math.floor(options.length)),
  )

  const chars: string[] = []
  // Guarantee one from each selected pool when length allows.
  const guarantee = Math.min(length, pools.length)
  for (let i = 0; i < guarantee; i++) {
    chars.push(pickChar(pools[i]!, randomByte))
  }
  while (chars.length < length) {
    chars.push(pickChar(charset, randomByte))
  }
  return shuffle(chars, randomByte).join('')
}

export function generatePasswords(
  options: PasswordOptions,
  randomByte?: () => number,
): GenerateResult {
  const charset = buildCharset(options)
  if (!charset) {
    return {
      ok: false,
      error: 'Select at least one character set to generate a password.',
    }
  }

  const length = Math.min(
    MAX_LENGTH,
    Math.max(MIN_LENGTH, Math.floor(options.length) || MIN_LENGTH),
  )
  const count = Math.min(
    MAX_COUNT,
    Math.max(MIN_COUNT, Math.floor(options.count) || MIN_COUNT),
  )
  const normalized = { ...options, length, count }

  try {
    const passwords = Array.from({ length: count }, () =>
      generatePassword(normalized, randomByte),
    )
    return {
      ok: true,
      passwords,
      charsetSize: charset.length,
      strength: estimateStrength(length, charset.length),
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Could not generate a password.',
    }
  }
}
