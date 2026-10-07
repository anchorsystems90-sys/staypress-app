import { describe, expect, it } from 'vitest'
import { hashText } from './generate'

describe('hashText', () => {
  it('hashes known SHA-256 of empty-ish input', async () => {
    const result = await hashText('abc', {
      algorithm: 'SHA-256',
      output: 'hex',
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.digest).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
    expect(result.bytes).toBe(32)
  })

  it('can emit base64', async () => {
    const result = await hashText('abc', {
      algorithm: 'SHA-256',
      output: 'base64',
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.digest).toBeTruthy()
    expect(result.digest.includes('=') || result.digest.length > 20).toBe(true)
  })

  it('errors on empty input', async () => {
    const result = await hashText('')
    expect(result.ok).toBe(false)
  })
})
