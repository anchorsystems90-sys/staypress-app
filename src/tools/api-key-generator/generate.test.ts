import { describe, expect, it } from 'vitest'
import { generateApiKey, generateApiKeys } from './generate'

function sequentialBytes(values: number[]) {
  let i = 0
  return () => values[i++ % values.length]!
}

describe('generateApiKey', () => {
  it('respects length, alphabet, and prefix', () => {
    const key = generateApiKey(
      {
        length: 16,
        count: 1,
        alphabet: 'hex',
        prefix: 'sk_',
      },
      (buf) => buf.fill(0xab),
    )
    expect(key.startsWith('sk_')).toBe(true)
    expect(key.slice(3)).toHaveLength(16)
    expect(key.slice(3)).toMatch(/^[0-9a-f]+$/)
  })

  it('samples base62 of the requested length', () => {
    const key = generateApiKey(
      {
        length: 12,
        count: 1,
        alphabet: 'base62',
        prefix: '',
      },
      undefined,
      sequentialBytes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    )
    expect(key).toHaveLength(12)
  })
})

describe('generateApiKeys', () => {
  it('returns count and entropy estimate', () => {
    const result = generateApiKeys({
      length: 32,
      count: 3,
      alphabet: 'base62',
      prefix: '',
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.keys).toHaveLength(3)
    expect(result.bits).toBeGreaterThan(100)
  })
})
