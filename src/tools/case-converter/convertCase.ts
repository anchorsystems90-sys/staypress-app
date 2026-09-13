export type CaseMode =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'

export const CASE_MODES: { id: CaseMode; label: string }[] = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'sentence', label: 'Sentence case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'pascal', label: 'PascalCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' },
  { id: 'constant', label: 'CONSTANT_CASE' },
]

export const IDENTIFIER_MODES = [
  'camel',
  'pascal',
  'snake',
  'kebab',
  'constant',
] as const satisfies readonly CaseMode[]

export type IdentifierMode = (typeof IDENTIFIER_MODES)[number]

export type IdentifierOutputs = Record<IdentifierMode, string>

/** Split into word tokens for identifier-style rebuilds (single token stream). */
export function wordsFrom(text: string): string[] {
  const spaced = text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  return spaced.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
}

function titleWord(word: string): string {
  return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
}

/**
 * True when a whitespace token is a clear all-caps acronym (2+ letters).
 * Limitation: does not detect mixed tokens like "NASA's" or speculative names
 * such as mcdonald → McDonald.
 */
export function isAcronymToken(token: string): boolean {
  const letters = token.replace(/[^\p{L}]/gu, '')
  return (
    letters.length >= 2 &&
    letters === letters.toLocaleUpperCase() &&
    /\p{L}/u.test(letters)
  )
}

function titleToken(token: string): string {
  if (isAcronymToken(token)) return token
  const match = token.match(/^([^\p{L}]*)(\p{L})(.*)$/u)
  if (!match) return token
  return match[1] + match[2].toLocaleUpperCase() + match[3].toLocaleLowerCase()
}

function sentenceCase(text: string): string {
  // Lowercase non-acronym tokens; preserve intentional ALL-CAPS acronyms.
  const preserved = text.replace(/[^\s]+/g, (token) =>
    isAcronymToken(token) ? token : token.toLocaleLowerCase(),
  )
  return preserved.replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gu, (chunk) =>
    chunk.toLocaleUpperCase(),
  )
}

export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'upper':
      return text.toLocaleUpperCase()
    case 'lower':
      return text.toLocaleLowerCase()
    case 'title':
      return text.replace(/[^\s]+/g, titleToken)
    case 'sentence':
      return sentenceCase(text)
    case 'camel': {
      const words = wordsFrom(text)
      if (!words.length) return ''
      return (
        words[0].toLocaleLowerCase() + words.slice(1).map(titleWord).join('')
      )
    }
    case 'pascal':
      return wordsFrom(text).map(titleWord).join('')
    case 'snake':
      return wordsFrom(text)
        .map((word) => word.toLocaleLowerCase())
        .join('_')
    case 'kebab':
      return wordsFrom(text)
        .map((word) => word.toLocaleLowerCase())
        .join('-')
    case 'constant':
      return wordsFrom(text)
        .map((word) => word.toLocaleUpperCase())
        .join('_')
  }
}

export function identifierOutputs(text: string): IdentifierOutputs {
  return {
    camel: convertCase(text, 'camel'),
    pascal: convertCase(text, 'pascal'),
    snake: convertCase(text, 'snake'),
    kebab: convertCase(text, 'kebab'),
    constant: convertCase(text, 'constant'),
  }
}

export type TextCounts = {
  characters: number
  words: number
}

export function countText(text: string): TextCounts {
  if (text.length === 0) return { characters: 0, words: 0 }
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
  }
}

export const SAMPLE_CASE_INPUT = `AI and NASA launch update

customer_account_number
xmlHTTPRequest`
