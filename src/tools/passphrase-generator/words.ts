import raw from './words.txt?raw'

/** EFF Short Wordlist #1 (diceware) — for local passphrase generation. */
export const PASSPHRASE_WORDS = raw
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)

export const PASSPHRASE_WORD_COUNT = PASSPHRASE_WORDS.length
