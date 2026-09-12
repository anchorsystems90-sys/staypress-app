/** Letter-bank matching: a word fits if every letter is available in the input
 *  (including up to MAX_WILDCARDS blank tiles marked `?`). */

const A = 'a'.charCodeAt(0)

export const MIN_TILES = 3
export const MAX_TILES = 12
export const MAX_WILDCARDS = 2

export type LengthFilter = 'any' | 3 | 4 | 5 | 6 | 7 | 8

export type UnscrambleOptions = {
  length?: LengthFilter
  startsWith?: string
  contains?: string
  endsWith?: string
}

export type ParsedTiles = {
  /** Concrete a–z letters only (no blanks). */
  concrete: string
  /** Number of `?` blanks (0–MAX_WILDCARDS). */
  wildcards: number
  /** concrete.length + wildcards */
  tiles: number
}

/** Strip to a–z for filter fields (no wildcards in filters). */
export function normalizeFilter(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z]/g, '')
}

/**
 * Parse letter input: a–z tiles plus `?` blanks.
 * Extra wildcards beyond MAX_WILDCARDS and tiles beyond MAX_TILES are ignored.
 */
export function parseTiles(raw: string): ParsedTiles {
  let concrete = ''
  let wildcards = 0
  for (const ch of raw.toLowerCase()) {
    if (concrete.length + wildcards >= MAX_TILES) break
    if (ch === '?') {
      if (wildcards < MAX_WILDCARDS) wildcards++
      continue
    }
    if (ch >= 'a' && ch <= 'z') concrete += ch
  }
  return {
    concrete,
    wildcards,
    tiles: concrete.length + wildcards,
  }
}

/** Sanitize UI input: keep a–zA–Z and `?`, cap tiles and wildcards. */
export function sanitizeLetterInput(raw: string): string {
  let result = ''
  let wildcards = 0
  for (const ch of raw) {
    if (result.length >= MAX_TILES) break
    if (ch === '?') {
      if (wildcards >= MAX_WILDCARDS) continue
      wildcards++
      result += '?'
      continue
    }
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
      result += ch
    }
  }
  return result
}

/** @deprecated Prefer parseTiles — kept for callers that only need concrete letters. */
export function normalizeLetters(raw: string): string {
  return parseTiles(raw).concrete
}

function countsOf(letters: string): Uint8Array {
  const counts = new Uint8Array(26)
  for (let i = 0; i < letters.length; i++) {
    counts[letters.charCodeAt(i) - A]++
  }
  return counts
}

/** Word fits the bank using at most `wildcards` blank tiles. */
export function wordFits(word: string, bank: Uint8Array, wildcards = 0): boolean {
  const used = new Uint8Array(26)
  let need = 0
  for (let i = 0; i < word.length; i++) {
    const idx = word.charCodeAt(i) - A
    if (idx < 0 || idx > 25) return false
    used[idx]++
    if (used[idx] > bank[idx]) {
      need++
      if (need > wildcards) return false
    }
  }
  return true
}

function lengthBounds(
  length: LengthFilter,
  tileCount: number,
): { min: number; max: number } {
  if (length === 'any') return { min: MIN_TILES, max: tileCount }
  if (length === 8) return { min: 8, max: Math.min(12, tileCount) }
  return { min: length, max: length }
}

/**
 * Find dictionary words buildable from the letter tiles (and optional blanks),
 * refined by length / starts / contains / ends filters.
 */
export function unscrambleWords(
  dictionary: string[],
  letters: string,
  lengthOrOptions: LengthFilter | UnscrambleOptions = 'any',
): string[] {
  const options: UnscrambleOptions =
    typeof lengthOrOptions === 'object'
      ? lengthOrOptions
      : { length: lengthOrOptions }

  const length = options.length ?? 'any'
  const startsWith = normalizeFilter(options.startsWith ?? '')
  const contains = normalizeFilter(options.contains ?? '')
  const endsWith = normalizeFilter(options.endsWith ?? '')

  const { concrete, wildcards, tiles } = parseTiles(letters)
  if (tiles < MIN_TILES) return []

  const bank = countsOf(concrete)
  const { min, max } = lengthBounds(length, tiles)

  // Impossible: filter strings longer than allowed word length / tile budget.
  if (startsWith.length > max || contains.length > max || endsWith.length > max) {
    return []
  }

  const found: string[] = []
  for (const word of dictionary) {
    if (word.length < min || word.length > max) continue
    if (word.length > tiles) continue
    if (startsWith && !word.startsWith(startsWith)) continue
    if (contains && !word.includes(contains)) continue
    if (endsWith && !word.endsWith(endsWith)) continue
    if (wordFits(word, bank, wildcards)) found.push(word)
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
