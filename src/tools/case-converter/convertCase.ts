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

function wordsFrom(text: string): string[] {
  const spaced = text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  return spaced.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
}

function titleWord(word: string): string {
  return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
}

export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'upper':
      return text.toLocaleUpperCase()
    case 'lower':
      return text.toLocaleLowerCase()
    case 'title':
      return text.replace(/[^\s]+/g, (word) => {
        const match = word.match(/^(\p{L})(.*)$/u)
        if (!match) return word
        return match[1].toLocaleUpperCase() + match[2].toLocaleLowerCase()
      })
    case 'sentence': {
      const lower = text.toLocaleLowerCase()
      return lower.replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gu, (chunk) =>
        chunk.toLocaleUpperCase(),
      )
    }
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
