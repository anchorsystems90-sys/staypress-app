/** Letter-bank matching: a word fits if every letter is available in the input. */

const A = 'a'.charCodeAt(0)

export function normalizeLetters(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z]/g, '')
}

function countsOf(letters: string): Uint8Array {
  const counts = new Uint8Array(26)
  for (let i = 0; i < letters.length; i++) {
    counts[letters.charCodeAt(i) - A]++
  }
  return counts
}

function wordFits(word: string, bank: Uint8Array): boolean {
  const used = new Uint8Array(26)
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - A
    used[idx]++
    if (used[idx] > bank[idx]) return false
  }
  return true
}

export type LengthFilter = 'any' | 3 | 4 | 5 | 6 | 7 | 8

export function unscrambleWords(
  dictionary: string[],
  letters: string,
  length: LengthFilter,
): string[] {
  const normalized = normalizeLetters(letters)
  if (normalized.length < 3) return []

  const bank = countsOf(normalized)
  const min = length === 'any' ? 3 : length
  const max = length === 'any' ? normalized.length : length === 8 ? 12 : length

  const found: string[] = []
  for (const word of dictionary) {
    if (word.length < min || word.length > max) continue
    if (word.length > normalized.length) continue
    if (wordFits(word, bank)) found.push(word)
  }

  found.sort((a, b) => b.length - a.length || (a < b ? -1 : a > b ? 1 : 0))
  return found
}

export function groupByLength(words: string[]): { length: number; words: string[] }[] {
  const groups = new Map<number, string[]>()
  for (const word of words) {
    const list = groups.get(word.length)
    if (list) list.push(word)
    else groups.set(word.length, [word])
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([length, groupWords]) => ({ length, words: groupWords }))
}
