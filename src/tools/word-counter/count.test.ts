import { describe, expect, it } from 'vitest'
import {
  countLines,
  countParagraphs,
  countSentences,
  countTextStats,
  countWords,
  formatCountSummary,
} from './count'

describe('countWords', () => {
  it('counts whitespace-separated words', () => {
    expect(countWords('hello world')).toBe(2)
    expect(countWords('  one   two  three ')).toBe(3)
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
  })
})

describe('countSentences', () => {
  it('splits on common terminators', () => {
    expect(countSentences('Hi. There! Really?')).toBe(3)
    expect(countSentences('No terminator')).toBe(1)
    expect(countSentences('')).toBe(0)
  })
})

describe('countParagraphs / countLines', () => {
  it('counts non-empty paragraph blocks', () => {
    expect(countParagraphs('a\n\nb\n\n\nc')).toBe(3)
    expect(countParagraphs('only one')).toBe(1)
    expect(countParagraphs('')).toBe(0)
  })

  it('counts lines including blanks', () => {
    expect(countLines('a\nb\n')).toBe(3)
    expect(countLines('')).toBe(0)
    expect(countLines('single')).toBe(1)
  })
})

describe('countTextStats', () => {
  it('aggregates the common counts', () => {
    const stats = countTextStats('Hello world.\n\nNext line!')
    expect(stats.words).toBe(4)
    expect(stats.characters).toBe(24)
    expect(stats.charactersNoSpaces).toBe(20)
    expect(stats.sentences).toBe(2)
    expect(stats.paragraphs).toBe(2)
    expect(stats.lines).toBe(3)
    expect(stats.readingMinutes).toBe(1)
  })

  it('reports zero reading time for empty input', () => {
    expect(countTextStats('').readingMinutes).toBe(0)
  })
})

describe('formatCountSummary', () => {
  it('renders a clipboard-friendly block', () => {
    const summary = formatCountSummary(countTextStats('Hi there.'))
    expect(summary).toContain('Words: 2')
    expect(summary).toContain('Characters:')
    expect(summary).toContain('Reading time:')
  })
})
