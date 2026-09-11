import wordList from './words.txt?raw'

let cached: string[] | null = null

/** ENABLE-based English list, 3–12 letters. Loaded with this tool chunk only. */
export function loadDictionary(): string[] {
  if (cached) return cached
  cached = wordList.split('\n').filter((word) => word.length > 0)
  return cached
}
