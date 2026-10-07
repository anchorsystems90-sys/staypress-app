import { describe, expect, it } from 'vitest'
import { hmacText } from './generate'

describe('hmacText', () => {
  it('matches a known HMAC-SHA-256 vector', async () => {
    const result = await hmacText(
      'The quick brown fox jumps over the lazy dog',
      'key',
      { algorithm: 'SHA-256', output: 'hex' },
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.digest).toBe(
      'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8',
    )
    expect(result.bytes).toBe(32)
  })

  it('can emit base64', async () => {
    const result = await hmacText('message', 'secret', {
      algorithm: 'SHA-256',
      output: 'base64',
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.digest.length).toBeGreaterThan(20)
  })

  it('errors when message or secret is missing', async () => {
    expect((await hmacText('', 'secret')).ok).toBe(false)
    expect((await hmacText('message', '')).ok).toBe(false)
  })
})
