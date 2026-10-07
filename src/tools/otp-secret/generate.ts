import { bytesToBase32, randomBytes } from '../../lib/cryptoRandom'

export type OtpOptions = {
  issuer: string
  account: string
  digits: 6 | 8
  period: 30 | 60
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512'
}

export type OtpSecretResult = {
  secret: string
  secretBytes: Uint8Array
  otpauthUrl: string
}

export type TotpCodeResult =
  | { ok: true; code: string; remaining: number; period: number }
  | { ok: false; error: string }

export const DEFAULT_OTP_OPTIONS: OtpOptions = {
  issuer: 'Bento Tools',
  account: 'user@example.com',
  digits: 6,
  period: 30,
  algorithm: 'SHA-1',
}

export function generateOtpSecret(
  options: OtpOptions = DEFAULT_OTP_OPTIONS,
  fill?: (buf: Uint8Array) => void,
): OtpSecretResult {
  const secretBytes = randomBytes(20, fill)
  const secret = bytesToBase32(secretBytes)
  const issuer = options.issuer.trim() || 'Bento Tools'
  const account = options.account.trim() || 'user'
  const label = encodeURIComponent(`${issuer}:${account}`)
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: options.algorithm.replace('-', ''),
    digits: String(options.digits),
    period: String(options.period),
  })
  return {
    secret,
    secretBytes,
    otpauthUrl: `otpauth://totp/${label}?${params.toString()}`,
  }
}

function base32ToBytes(secret: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const cleaned = secret.toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '')
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const ch of cleaned) {
    const idx = alphabet.indexOf(ch)
    if (idx < 0) throw new Error('Invalid base32 secret.')
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return new Uint8Array(out)
}

function counterBytes(counter: number): Uint8Array {
  const buf = new Uint8Array(8)
  let value = BigInt(counter)
  for (let i = 7; i >= 0; i--) {
    buf[i] = Number(value & 0xffn)
    value >>= 8n
  }
  return buf
}

async function hmac(
  algorithm: OtpOptions['algorithm'],
  keyBytes: Uint8Array,
  data: Uint8Array,
): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign'],
  )
  return crypto.subtle.sign('HMAC', key, data)
}

/** Compute the current TOTP code for a base32 secret. */
export async function computeTotp(
  secretBase32: string,
  options: Pick<OtpOptions, 'digits' | 'period' | 'algorithm'> = DEFAULT_OTP_OPTIONS,
  nowMs: number = Date.now(),
): Promise<TotpCodeResult> {
  try {
    const keyBytes = base32ToBytes(secretBase32)
    const period = options.period
    const counter = Math.floor(nowMs / 1000 / period)
    const remaining = period - Math.floor((nowMs / 1000) % period)
    const mac = new Uint8Array(
      await hmac(options.algorithm, keyBytes, counterBytes(counter)),
    )
    const offset = mac[mac.length - 1]! & 0x0f
    const binary =
      ((mac[offset]! & 0x7f) << 24) |
      ((mac[offset + 1]! & 0xff) << 16) |
      ((mac[offset + 2]! & 0xff) << 8) |
      (mac[offset + 3]! & 0xff)
    const mod = 10 ** options.digits
    const code = String(binary % mod).padStart(options.digits, '0')
    return { ok: true, code, remaining, period }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Could not compute a TOTP code.',
    }
  }
}
