/** Read one or more crypto bytes via the inject or getRandomValues. */
function nextBytes(
  length: number,
  randomByte?: () => number,
): Uint8Array {
  if (randomByte) {
    const buf = new Uint8Array(length)
    for (let i = 0; i < length; i++) buf[i] = randomByte() & 0xff
    return buf
  }
  const buf = new Uint8Array(length)
  crypto.getRandomValues(buf)
  return buf
}

/**
 * Unbiased index in [0, max) using rejection sampling.
 * Uses 1–4 bytes depending on the range so pools larger than 256 work.
 */
export function randomIndex(
  max: number,
  randomByte?: () => number,
): number {
  if (!Number.isFinite(max) || max <= 0) throw new Error('max must be positive')
  if (max === 1) return 0
  const limitMax = Math.ceil(max)
  // Smallest power-of-two byte width that can represent [0, max).
  const bytes =
    limitMax <= 0x100 ? 1 : limitMax <= 0x10000 ? 2 : limitMax <= 0x1000000 ? 3 : 4
  const range = 256 ** bytes
  const limit = Math.floor(range / limitMax) * limitMax
  let value = 0
  do {
    const buf = nextBytes(bytes, randomByte)
    value = 0
    for (const byte of buf) value = value * 256 + byte
  } while (value >= limit)
  return value % limitMax
}

/** Fill a Uint8Array with crypto.getRandomValues (or a test inject). */
export function randomBytes(
  length: number,
  fill: (buf: Uint8Array) => void = (buf) => {
    crypto.getRandomValues(buf)
  },
): Uint8Array {
  const buf = new Uint8Array(length)
  fill(buf)
  return buf
}

export function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const BASE62 =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/** Encode bytes as base62 (unpadded). */
export function bytesToBase62(bytes: Uint8Array): string {
  if (bytes.length === 0) return ''
  let digits = [...bytes]
  const out: string[] = []
  while (digits.some((d) => d !== 0)) {
    let remainder = 0
    const next: number[] = []
    for (const digit of digits) {
      const value = remainder * 256 + digit
      const q = Math.floor(value / 62)
      remainder = value % 62
      if (next.length > 0 || q > 0) next.push(q)
    }
    out.push(BASE62[remainder]!)
    digits = next
  }
  return out.reverse().join('') || '0'
}

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/** RFC 4648 base32 (no padding). */
export function bytesToBase32(bytes: Uint8Array): string {
  let bits = 0
  let value = 0
  let output = ''
  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]!
      bits -= 5
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31]!
  }
  return output
}
