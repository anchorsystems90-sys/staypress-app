export type CleanOptions = {
  normalizeNewlines: boolean
  stripHtml: boolean
  tabsToSpaces: boolean
  trimLines: boolean
  collapseSpaces: boolean
  removeBlankLines: boolean
  /** Join remaining lines into one flow with spaces (not the same as removeBlankLines). */
  joinLines: boolean
  removeDuplicateLines: boolean
  removeSpecialChars: boolean
}

export const DEFAULT_CLEAN_OPTIONS: CleanOptions = {
  normalizeNewlines: true,
  stripHtml: false,
  tabsToSpaces: true,
  trimLines: true,
  collapseSpaces: true,
  removeBlankLines: false,
  joinLines: false,
  removeDuplicateLines: false,
  removeSpecialChars: false,
}

/** Common named entities — keep this list small; numeric entities cover the rest. */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
  copy: '\u00A9',
  reg: '\u00AE',
  trade: '\u2122',
  hellip: '\u2026',
  mdash: '\u2014',
  ndash: '\u2013',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201C',
  rdquo: '\u201D',
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => {
      const code = Number.parseInt(hex, 16)
      return Number.isFinite(code) ? String.fromCodePoint(code) : _
    })
    .replace(/&#(\d+);/g, (_, dec: string) => {
      const code = Number.parseInt(dec, 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : _
    })
    .replace(/&([a-zA-Z][a-zA-Z0-9]+);/g, (match, name: string) => {
      return NAMED_ENTITIES[name.toLowerCase()] ?? match
    })
}

/** Strip tags first, then decode entities (avoids turning &lt;script&gt; back into tags). */
export function stripHtml(input: string): string {
  return decodeHtmlEntities(
    input
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
}

/**
 * Pipeline order (deterministic):
 * normalize → stripHtml → tabs → trim → collapse → removeBlank →
 * removeDuplicates → joinLines → (re-collapse/trim if joined) → removeSpecial
 */
export function cleanText(input: string, options: CleanOptions): string {
  let text = input
  if (options.normalizeNewlines) text = text.replace(/\r\n?/g, '\n')
  if (options.stripHtml) text = stripHtml(text)
  if (options.tabsToSpaces) text = text.replace(/\t/g, '  ')
  if (options.trimLines) {
    text = text
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .trim()
  }
  if (options.collapseSpaces) {
    text = text
      .split('\n')
      .map((line) => line.replace(/ {2,}/g, ' '))
      .join('\n')
  }
  if (options.removeBlankLines) {
    text = text
      .split('\n')
      .filter((line) => line.trim() !== '')
      .join('\n')
  }
  if (options.removeDuplicateLines) {
    const seen = new Set<string>()
    text = text
      .split('\n')
      .filter((line) => {
        if (seen.has(line)) return false
        seen.add(line)
        return true
      })
      .join('\n')
  }
  if (options.joinLines) {
    text = text.split('\n').join(' ')
    if (options.collapseSpaces) text = text.replace(/ {2,}/g, ' ')
    if (options.trimLines) text = text.trim()
  }
  if (options.removeSpecialChars) {
    text = text.replace(/[^\p{L}\p{N}\s.,;:!?()'"-]/gu, '')
  }
  return text
}

export type TextStats = {
  characters: number
  words: number
  lines: number
}

export function textStats(text: string): TextStats {
  if (text.length === 0) return { characters: 0, words: 0, lines: 0 }
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  return {
    characters: text.length,
    words,
    lines: text.split('\n').length,
  }
}

export type TextDelta = {
  characters: number
  words: number
  lines: number
}

/** after − before (negative means the cleaner removed content). */
export function textDelta(before: string, after: string): TextDelta {
  const a = textStats(before)
  const b = textStats(after)
  return {
    characters: b.characters - a.characters,
    words: b.words - a.words,
    lines: b.lines - a.lines,
  }
}

export function formatDelta(delta: TextDelta): string | null {
  if (delta.characters === 0 && delta.words === 0 && delta.lines === 0) return null
  const parts: string[] = []
  const fmt = (n: number, unit: string) =>
    `${n > 0 ? '+' : ''}${n.toLocaleString()} ${unit}`
  if (delta.characters !== 0) parts.push(fmt(delta.characters, 'characters'))
  if (delta.words !== 0) parts.push(fmt(delta.words, 'words'))
  if (delta.lines !== 0) parts.push(fmt(delta.lines, 'lines'))
  return parts.join(' · ')
}

export const SAMPLE_CLEAN_INPUT = `  Paste  messy   copy here.

<p>HTML &amp; entities like &copy; and &#8212; decode when Strip HTML is on.</p>

Duplicate line
Duplicate line

Line one
Line two
`
