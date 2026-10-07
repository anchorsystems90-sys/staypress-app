import { describe, expect, it } from 'vitest'
import {
  estimatePassphraseStrength,
  generatePassphrase,
  generatePassphrases,
} from './generate'
import { PASSPHRASE_WORD_COUNT } from './words'

function sequentialBytes(values: number[]) {
  let i = 0
  return () => values[i++ % values.length]!
}

describe('generatePassphrase', () => {
  it('joins the requested number of words', () => {
    const phrase = generatePassphrase(
      {
        words: 4,
        separator: '-',
        capitalize: false,
        includeNumber: false,
        count: 1,
      },
      sequentialBytes([0, 1, 2, 3, 4, 5]),
    )
    expect(phrase.split('-')).toHaveLength(4)
  })

  it('can capitalize and append a digit', () => {
    const phrase = generatePassphrase(
      {
        words: 3,
        separator: ' ',
        capitalize: true,
        includeNumber: true,
        count: 1,
      },
      sequentialBytes([10, 20, 30, 7]),
    )
    const parts = phrase.split(' ')
    expect(parts).toHaveLength(4)
    expect(parts[0]![0]).toMatch(/[A-Z]/)
    expect(parts[3]).toMatch(/^\d$/)
  })
})

describe('generatePassphrases', () => {
  it('returns the requested count and strength', () => {
    const result = generatePassphrases({
      words: 6,
      separator: '-',
      capitalize: false,
      includeNumber: false,
      count: 2,
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.passphrases).toHaveLength(2)
    expect(result.wordCount).toBe(PASSPHRASE_WORD_COUNT)
    expect(result.strength.bits).toBeGreaterThan(50)
  })
})

describe('estimatePassphraseStrength', () => {
  it('scales with word count', () => {
    expect(estimatePassphraseStrength(3).score).toBeLessThan(
      estimatePassphraseStrength(8).score,
    )
  })
})
