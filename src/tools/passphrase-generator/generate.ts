import { randomIndex } from '../../lib/cryptoRandom'
import { PASSPHRASE_WORDS, PASSPHRASE_WORD_COUNT } from './words'

export type PassphraseOptions = {
  words: number
  separator: string
  capitalize: boolean
  includeNumber: boolean
  count: number
}

export type PassphraseStrength = {
  score: 0 | 1 | 2 | 3 | 4
  label: 'Too weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong'
  bits: number
}

export type PassphraseResult =
  | {
      ok: true
      passphrases: string[]
      wordCount: number
      strength: PassphraseStrength
    }
  | { ok: false; error: string }

export const MIN_WORDS = 3
export const MAX_WORDS = 12
export const MIN_COUNT = 1
export const MAX_COUNT = 20

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  words: 6,
  separator: '-',
  capitalize: false,
  includeNumber: false,
  count: 1,
}

export function estimatePassphraseStrength(
  words: number,
  wordPoolSize: number = PASSPHRASE_WORD_COUNT,
): PassphraseStrength {
  if (words <= 0 || wordPoolSize <= 1) {
    return { score: 0, label: 'Too weak', bits: 0 }
  }
  const bits = Math.log2(wordPoolSize) * words
  if (bits < 28) return { score: 0, label: 'Too weak', bits }
  if (bits < 40) return { score: 1, label: 'Weak', bits }
  if (bits < 60) return { score: 2, label: 'Fair', bits }
  if (bits < 80) return { score: 3, label: 'Strong', bits }
  return { score: 4, label: 'Very strong', bits }
}

function pickWord(randomByte?: () => number): string {
  return PASSPHRASE_WORDS[randomIndex(PASSPHRASE_WORD_COUNT, randomByte)]!
}

export function generatePassphrase(
  options: PassphraseOptions,
  randomByte?: () => number,
): string {
  const wordCount = Math.min(
    MAX_WORDS,
    Math.max(MIN_WORDS, Math.floor(options.words) || MIN_WORDS),
  )
  const sep = options.separator.slice(0, 8)
  const parts = Array.from({ length: wordCount }, () => {
    const word = pickWord(randomByte)
    if (!options.capitalize) return word
    return word.charAt(0).toUpperCase() + word.slice(1)
  })
  let phrase = parts.join(sep)
  if (options.includeNumber) {
    phrase += sep + String(randomIndex(10, randomByte))
  }
  return phrase
}

export function generatePassphrases(
  options: PassphraseOptions,
  randomByte?: () => number,
): PassphraseResult {
  const words = Math.min(
    MAX_WORDS,
    Math.max(MIN_WORDS, Math.floor(options.words) || MIN_WORDS),
  )
  const count = Math.min(
    MAX_COUNT,
    Math.max(MIN_COUNT, Math.floor(options.count) || MIN_COUNT),
  )
  const normalized = { ...options, words, count }

  try {
    const passphrases = Array.from({ length: count }, () =>
      generatePassphrase(normalized, randomByte),
    )
    return {
      ok: true,
      passphrases,
      wordCount: PASSPHRASE_WORD_COUNT,
      strength: estimatePassphraseStrength(words),
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Could not generate a passphrase.',
    }
  }
}
