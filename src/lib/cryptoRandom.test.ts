import { describe, expect, it } from 'vitest'
import { bytesToBase32, randomIndex } from './cryptoRandom'

function sequentialBytes(values: number[]) {
  let i = 0
  return () => values[i++ % values.length]!
}

describe('randomIndex', () => {
  it('stays in range for small pools', () => {
    const byte = sequentialBytes([0, 1, 2, 255, 10])
    for (let i = 0; i < 40; i++) {
      const value = randomIndex(10, byte)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(10)
    }
  })

  it('supports pools larger than 256 without hanging', () => {
    const byte = sequentialBytes([0, 1, 2, 3, 4, 5, 200, 10])
    for (let i = 0; i < 40; i++) {
      const value = randomIndex(1295, byte)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1295)
    }
  })
})

describe('bytesToBase32', () => {
  it('encodes known bytes', () => {
    // "Hello" → JBSWY3DP
    const bytes = new TextEncoder().encode('Hello')
    expect(bytesToBase32(bytes)).toBe('JBSWY3DP')
  })
})
