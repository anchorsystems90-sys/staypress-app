export type CleanOptions = {
  normalizeNewlines: boolean
  stripHtml: boolean
  tabsToSpaces: boolean
  trimLines: boolean
  collapseSpaces: boolean
  removeBlankLines: boolean
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
  removeDuplicateLines: false,
  removeSpecialChars: false,
}

function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

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
  if (options.removeSpecialChars) {
    text = text.replace(/[^\p{L}\p{N}\s.,;:!?()'"-]/gu, '')
  }
  return text
}

export function textStats(text: string): { characters: number; lines: number } {
  if (text.length === 0) return { characters: 0, lines: 0 }
  return {
    characters: text.length,
    lines: text.split('\n').length,
  }
}
