import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  groupByLength,
  MAX_TILES,
  MAX_WILDCARDS,
  parseTiles,
  sanitizeLetterInput,
  unscrambleWords,
  wordFits,
} from './unscramble'

const root = dirname(fileURLToPath(import.meta.url))
const dictionary = readFileSync(join(root, 'words.txt'), 'utf8')
  .split('\n')
  .filter((word) => word.length > 0)

describe('parseTiles / sanitizeLetterInput', () => {
  it('parses concrete letters and wildcards', () => {
    expect(parseTiles('c?t')).toEqual({ concrete: 'ct', wildcards: 1, tiles: 3 })
    expect(parseTiles('a??')).toEqual({ concrete: 'a', wildcards: 2, tiles: 3 })
  })

  it('caps wildcards at MAX_WILDCARDS and tiles at MAX_TILES', () => {
    expect(parseTiles('a???').wildcards).toBe(MAX_WILDCARDS)
    expect(sanitizeLetterInput('a???')).toBe('a??')
    expect(sanitizeLetterInput('abcdefghijklm')).toHaveLength(MAX_TILES)
    expect(sanitizeLetterInput('abc!@#?def')).toBe('abc?def')
  })

  it('strips invalid characters and keeps letter case in sanitize', () => {
    expect(sanitizeLetterInput('LiS ten!?')).toBe('LiSten?')
  })
})

describe('wordFits letter accounting', () => {
  const A = 'a'.charCodeAt(0)
  function bankOf(letters: string) {
    const bank = new Uint8Array(26)
    for (const ch of letters) bank[ch.charCodeAt(0) - A]++
    return bank
  }

  it('respects repeated letters without wildcards', () => {
    const bank = bankOf('letter')
    expect(wordFits('letter', bank, 0)).toBe(true)
    expect(wordFits('letters', bank, 0)).toBe(false)
    expect(wordFits('letters', bank, 1)).toBe(true)
  })

  it('uses wildcards only for deficits', () => {
    const bank = bankOf('ct')
    expect(wordFits('cat', bank, 1)).toBe(true)
    expect(wordFits('cart', bank, 1)).toBe(false)
  })
})

describe('unscrambleWords', () => {
  it('handles listen / retins / letter baselines', () => {
    const listen = unscrambleWords(dictionary, 'listen')
    expect(listen).toContain('listen')
    expect(listen).toContain('silent')
    expect(listen).toContain('tin')
    expect(listen).not.toContain('listens')

    const retins = unscrambleWords(dictionary, 'retins')
    expect(retins).toContain('insert')

    const letter = unscrambleWords(dictionary, 'letter')
    expect(letter).toContain('letter')
    expect(letter).toContain('let')
    expect(letter).not.toContain('letters')
  })

  it('supports uppercase, whitespace, and junk via parsing', () => {
    const lower = unscrambleWords(dictionary, 'listen')
    expect(unscrambleWords(dictionary, 'LISTEN')).toEqual(lower)
    expect(unscrambleWords(dictionary, 'lis ten')).toEqual(lower)
    expect(unscrambleWords(dictionary, 'l!i@s#ten')).toEqual(lower)
  })

  it('returns empty for short or empty input', () => {
    expect(unscrambleWords(dictionary, '')).toEqual([])
    expect(unscrambleWords(dictionary, 'ab')).toEqual([])
    expect(unscrambleWords(dictionary, '??')).toEqual([])
  })

  it('matches single-wildcard patterns like c?t', () => {
    const words = unscrambleWords(dictionary, 'c?t')
    expect(words).toEqual(expect.arrayContaining(['cat', 'cot', 'cut']))
    expect(words.every((w) => w.length <= 3)).toBe(true)
  })

  it('allows a?? with two wildcards', () => {
    const words = unscrambleWords(dictionary, 'a??')
    expect(words.length).toBeGreaterThan(0)
    expect(words).toContain('cat')
    expect(words.every((w) => w.length <= 3)).toBe(true)
    expect(words.every((w) => w.includes('a') || w.length <= 2)).toBe(true)
  })

  it('handles two-wildcard repeated-letter cases', () => {
    // bank: l,e,t,t,e,r + 2 blanks — "letters" needs one extra s
    const withOneBlank = unscrambleWords(dictionary, 'letter?')
    expect(withOneBlank).toContain('letters')

    // l?? should not invent unlimited length
    const lBlank = unscrambleWords(dictionary, 'l??')
    expect(lBlank.every((w) => w.length <= 3)).toBe(true)
    expect(
      lBlank.every((w) => (w.match(/l/g) || []).length <= 1 + 2),
    ).toBe(true)
  })

  it('filters starts with / contains / ends with', () => {
    const base = unscrambleWords(dictionary, 'retains')
    const starts = unscrambleWords(dictionary, 'retains', { startsWith: 'st' })
    expect(starts.length).toBeGreaterThan(0)
    expect(starts.every((w) => w.startsWith('st'))).toBe(true)
    expect(starts.every((w) => base.includes(w))).toBe(true)

    const contains = unscrambleWords(dictionary, 'retains', { contains: 'ai' })
    expect(contains.every((w) => w.includes('ai'))).toBe(true)

    const ends = unscrambleWords(dictionary, 'retains', { endsWith: 'er' })
    expect(ends.every((w) => w.endsWith('er'))).toBe(true)

    const combined = unscrambleWords(dictionary, 'retains', {
      startsWith: 'st',
      contains: 'ai',
      endsWith: 'n',
    })
    expect(combined.every((w) => w.startsWith('st') && w.includes('ai') && w.endsWith('n'))).toBe(
      true,
    )
  })

  it('combines wildcards with starts/contains/ends', () => {
    const starts = unscrambleWords(dictionary, 'r?tains', { startsWith: 'st' })
    expect(starts.every((w) => w.startsWith('st'))).toBe(true)

    const contains = unscrambleWords(dictionary, 'ret?ns', { contains: 'in' })
    expect(contains.every((w) => w.includes('in'))).toBe(true)

    const ends = unscrambleWords(dictionary, 'reta?n', { endsWith: 'in' })
    expect(ends.every((w) => w.endsWith('in'))).toBe(true)
  })

  it('supports exact length with wildcards', () => {
    const words = unscrambleWords(dictionary, 'c?t', { length: 3 })
    expect(words.length).toBeGreaterThan(0)
    expect(words.every((w) => w.length === 3)).toBe(true)
  })

  it('returns empty for impossible filters', () => {
    expect(unscrambleWords(dictionary, 'listen', { startsWith: 'zz' })).toEqual([])
    expect(
      unscrambleWords(dictionary, 'listen', {
        startsWith: 'abcdef',
        endsWith: 'xyz',
      }),
    ).toEqual([])
  })

  it('respects max tile budget', () => {
    const words = unscrambleWords(dictionary, 'abcdefghijkl')
    expect(words.every((w) => w.length <= 12)).toBe(true)
  })

  it('sorts longest first then alphabetically and groups cleanly', () => {
    const words = unscrambleWords(dictionary, 'listen')
    for (let i = 1; i < words.length; i++) {
      const prev = words[i - 1]
      const cur = words[i]
      expect(
        prev.length > cur.length ||
          (prev.length === cur.length && prev <= cur),
      ).toBe(true)
    }
    const groups = groupByLength(words)
    expect(groups[0].length).toBeGreaterThanOrEqual(groups[groups.length - 1].length)
  })

  it('ignores a third wildcard beyond the cap', () => {
    const capped = unscrambleWords(dictionary, 'a??')
    const extra = unscrambleWords(dictionary, 'a???')
    expect(extra).toEqual(capped)
  })
})
