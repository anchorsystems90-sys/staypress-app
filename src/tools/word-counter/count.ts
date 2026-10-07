export type TextCountStats = {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
  /** Estimated reading time at ~200 words/minute, rounded up. */
  readingMinutes: number
}

export const SAMPLE_COUNT_INPUT = `Bento Tools keeps useful utilities in your browser.

Paste a draft, email, or essay here. Count words, characters, sentences, and paragraphs instantly — nothing leaves this device.`

const WORDS_PER_MINUTE = 200

/** Count words as whitespace-separated tokens (after trim). */
export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

/**
 * Rough sentence count: splits on . ! ? (and common unicode endings),
 * ignoring empty chunks. Abbreviations may inflate the count slightly.
 */
export function countSentences(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  const parts = trimmed.split(/[.!?…]+(?:\s|$)/).filter((part) => part.trim())
  // If there is text but no terminator, count as one sentence.
  if (parts.length === 0) return 1
  // Trailing terminator can leave an empty last piece already filtered.
  // Text with no sentence punctuation still yields one part.
  const hasTerminator = /[.!?…]/.test(trimmed)
  return hasTerminator ? parts.length : 1
}

/** Paragraphs = non-empty blocks separated by blank lines. */
export function countParagraphs(text: string): number {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const blocks = normalized.split(/\n\s*\n/).filter((block) => block.trim())
  return blocks.length
}

export function countLines(text: string): number {
  if (text.length === 0) return 0
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  return normalized.split('\n').length
}

export function countTextStats(text: string): TextCountStats {
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = countWords(text)
  const sentences = countSentences(text)
  const paragraphs = countParagraphs(text)
  const lines = countLines(text)
  const readingMinutes =
    words === 0 ? 0 : Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingMinutes,
  }
}

/** Plain-text summary suitable for clipboard. */
export function formatCountSummary(stats: TextCountStats): string {
  const reading =
    stats.words === 0
      ? 'Reading time: —'
      : `Reading time: ~${stats.readingMinutes} min`
  return [
    `Words: ${stats.words}`,
    `Characters: ${stats.characters}`,
    `Characters (no spaces): ${stats.charactersNoSpaces}`,
    `Sentences: ${stats.sentences}`,
    `Paragraphs: ${stats.paragraphs}`,
    `Lines: ${stats.lines}`,
    reading,
  ].join('\n')
}
