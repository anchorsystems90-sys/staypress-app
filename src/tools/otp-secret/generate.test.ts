import { describe, expect, it } from 'vitest'
import { computeTotp, generateOtpSecret } from './generate'

describe('generateOtpSecret', () => {
  it('builds a base32 secret and otpauth URI', () => {
    const result = generateOtpSecret(
      {
        issuer: 'Acme',
        account: 'a@b.com',
        digits: 6,
        period: 30,
        algorithm: 'SHA-1',
      },
      (buf) => {
        for (let i = 0; i < buf.length; i++) buf[i] = i + 1
      },
    )
    expect(result.secret).toMatch(/^[A-Z2-7]+$/)
    expect(result.otpauthUrl.startsWith('otpauth://totp/')).toBe(true)
    expect(result.otpauthUrl).toContain('issuer=Acme')
    expect(result.otpauthUrl).toContain('digits=6')
  })
})

describe('computeTotp', () => {
  it('matches the RFC 6238 SHA-1 test vector for seed', async () => {
    // Seed: "12345678901234567890" → base32 JBSWY3DPEHPK3PXP
    // Using the well-known secret "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
    // which is ASCII 12345678901234567890 in base32.
    const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'
    const result = await computeTotp(
      secret,
      { digits: 8, period: 30, algorithm: 'SHA-1' },
      59 * 1000,
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.code).toBe('94287082')
  })
})
