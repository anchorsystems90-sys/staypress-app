import { describe, expect, it } from 'vitest'
import {
  buildCharset,
  estimateStrength,
  generatePassword,
  generatePasswords,
  randomIndex,
  requiredPools,
} from './generate'

function sequentialBytes(values: number[]) {
  let i = 0
  return () => values[i++ % values.length]!
}

describe('buildCharset / requiredPools', () => {
  it('includes selected sets and can strip ambiguous characters', () => {
    const charset = buildCharset({
      length: 16,
      lowercase: true,
      uppercase: true,
      digits: true,
      symbols: false,
      excludeAmbiguous: true,
      count: 1,
    })
    expect(charset.includes('a')).toBe(true)
    expect(charset.includes('A')).toBe(true)
    expect(charset.includes('2')).toBe(true)
    expect(charset.includes('0')).toBe(false)
    expect(charset.includes('O')).toBe(false)
    expect(charset.includes('1')).toBe(false)
    expect(charset.includes('l')).toBe(false)
    expect(charset.includes('I')).toBe(false)
  })

  it('returns empty charset when nothing is selected', () => {
    expect(
      buildCharset({
        length: 16,
        lowercase: false,
        uppercase: false,
        digits: false,
        symbols: false,
        excludeAmbiguous: false,
        count: 1,
      }),
    ).toBe('')
  })

  it('builds one pool per enabled set', () => {
    expect(
      requiredPools({
        length: 16,
        lowercase: true,
        uppercase: false,
        digits: true,
        symbols: false,
        excludeAmbiguous: false,
        count: 1,
      }),
    ).toHaveLength(2)
  })
})

describe('randomIndex', () => {
  it('stays within range', () => {
    const byte = sequentialBytes([0, 1, 2, 255, 10])
    for (let i = 0; i < 20; i++) {
      const value = randomIndex(10, byte)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(10)
    }
  })
})

describe('generatePassword', () => {
  it('respects length and includes required character classes', () => {
    const password = generatePassword({
      length: 12,
      lowercase: true,
      uppercase: true,
      digits: true,
      symbols: true,
      excludeAmbiguous: false,
      count: 1,
    })
    expect(password).toHaveLength(12)
    expect(/[a-z]/.test(password)).toBe(true)
    expect(/[A-Z]/.test(password)).toBe(true)
    expect(/\d/.test(password)).toBe(true)
    expect(/[^A-Za-z0-9]/.test(password)).toBe(true)
  })
})

describe('generatePasswords', () => {
  it('returns the requested count', () => {
    const result = generatePasswords({
      length: 10,
      lowercase: true,
      uppercase: true,
      digits: true,
      symbols: false,
      excludeAmbiguous: true,
      count: 3,
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.passwords).toHaveLength(3)
    expect(result.strength.bits).toBeGreaterThan(0)
  })

  it('errors when no character sets are selected', () => {
    const result = generatePasswords({
      length: 10,
      lowercase: false,
      uppercase: false,
      digits: false,
      symbols: false,
      excludeAmbiguous: false,
      count: 1,
    })
    expect(result.ok).toBe(false)
  })
})

describe('estimateStrength', () => {
  it('scales with length and charset size', () => {
    expect(estimateStrength(4, 10).label).toBe('Too weak')
    expect(estimateStrength(16, 70).score).toBeGreaterThanOrEqual(3)
  })
})
