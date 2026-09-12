import { useDeferredValue, useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { loadDictionary } from './dictionary'
import {
  groupByLength,
  MAX_TILES,
  MAX_WILDCARDS,
  MIN_TILES,
  parseTiles,
  sanitizeLetterInput,
  unscrambleWords,
  type LengthFilter,
} from './unscramble'

const LENGTH_OPTIONS: { value: LengthFilter; label: string }[] = [
  { value: 'any', label: 'Any length' },
  { value: 3, label: '3 letters' },
  { value: 4, label: '4 letters' },
  { value: 5, label: '5 letters' },
  { value: 6, label: '6 letters' },
  { value: 7, label: '7 letters' },
  { value: 8, label: '8 or more' },
]

function sanitizeFilterInput(raw: string): string {
  return raw.replace(/[^a-zA-Z]/g, '').slice(0, MAX_TILES)
}

export default function WordUnscrambler() {
  const [letters, setLetters] = useState('')
  const [length, setLength] = useState<LengthFilter>('any')
  const [startsWith, setStartsWith] = useState('')
  const [contains, setContains] = useState('')
  const [endsWith, setEndsWith] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedWord, setCopiedWord] = useState<string | null>(null)

  const deferredLetters = useDeferredValue(letters)
  const deferredLength = useDeferredValue(length)
  const deferredStarts = useDeferredValue(startsWith)
  const deferredContains = useDeferredValue(contains)
  const deferredEnds = useDeferredValue(endsWith)

  const dictionary = useMemo(() => loadDictionary(), [])

  const words = useMemo(
    () =>
      unscrambleWords(dictionary, deferredLetters, {
        length: deferredLength,
        startsWith: deferredStarts,
        contains: deferredContains,
        endsWith: deferredEnds,
      }),
    [
      dictionary,
      deferredLetters,
      deferredLength,
      deferredStarts,
      deferredContains,
      deferredEnds,
    ],
  )

  const groups = useMemo(() => groupByLength(words), [words])
  const parsed = parseTiles(letters)
  const canSearch = parsed.tiles >= MIN_TILES
  const hasAdvancedFilters = Boolean(
    startsWith.trim() || contains.trim() || endsWith.trim(),
  )
  const filtersActive =
    hasAdvancedFilters || (length !== 'any' && canSearch)

  const copyResults = async () => {
    if (!words.length) return
    try {
      await navigator.clipboard.writeText(words.join('\n'))
      setCopiedAll(true)
      setCopiedWord(null)
      trackToolUsed('word-unscrambler', { detail: 'copy', pages: words.length })
      window.setTimeout(() => setCopiedAll(false), 1600)
    } catch {
      setCopiedAll(false)
    }
  }

  const copyWord = async (word: string) => {
    try {
      await navigator.clipboard.writeText(word)
      setCopiedWord(word)
      setCopiedAll(false)
      trackToolUsed('word-unscrambler', { detail: 'copy-word', pages: 1 })
      window.setTimeout(() => {
        setCopiedWord((current) => (current === word ? null : current))
      }, 1200)
    } catch {
      setCopiedWord(null)
    }
  }

  const clearAll = () => {
    setLetters('')
    setLength('any')
    setStartsWith('')
    setContains('')
    setEndsWith('')
    setCopiedAll(false)
    setCopiedWord(null)
  }

  const clearDisabled =
    !letters && length === 'any' && !startsWith && !contains && !endsWith

  let hint: string
  if (!canSearch) {
    hint = `Enter at least ${MIN_TILES} letters. ? = one unknown letter (max ${MAX_WILDCARDS}).`
  } else {
    const parts = [
      `${parsed.tiles} ${parsed.tiles === 1 ? 'tile' : 'tiles'}`,
    ]
    if (parsed.wildcards) {
      parts.push(
        `${parsed.wildcards} ${parsed.wildcards === 1 ? 'blank' : 'blanks'}`,
      )
    }
    parts.push('results update as you type')
    hint = parts.join(' · ')
  }

  let emptyMessage = 'Type a jumble to find valid English words.'
  if (canSearch && words.length === 0) {
    emptyMessage = filtersActive
      ? 'No words match these letters and filters. Try loosening starts/contains/ends or length.'
      : 'No words found for those letters. Try a different mix.'
  }

  return (
    <section className="unscramble" aria-label="Word Unscrambler">
      <div className="unscramble__panel">
        <label className="unscramble__field">
          <span className="unscramble__label">Letters</span>
          <input
            className="unscramble__input"
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            maxLength={MAX_TILES}
            placeholder="e.g. retins or c?t"
            value={letters}
            onChange={(e) => {
              setLetters(sanitizeLetterInput(e.target.value))
              setCopiedAll(false)
              setCopiedWord(null)
            }}
            aria-describedby="unscramble-hint"
          />
        </label>

        <label className="field unscramble__length">
          <span className="field__label">Word length</span>
          <select
            className="field__select"
            value={String(length)}
            onChange={(e) => {
              const next = e.target.value
              setLength(next === 'any' ? 'any' : (Number(next) as LengthFilter))
              setCopiedAll(false)
              setCopiedWord(null)
            }}
          >
            {LENGTH_OPTIONS.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p id="unscramble-hint" className="unscramble__hint">
        {hint}
      </p>
      <p className="unscramble__wildcard-help">? = one unknown letter · max 2</p>

      <div className="unscramble__more">
        <button
          type="button"
          className="unscramble__more-toggle"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          More filters{hasAdvancedFilters ? ' · on' : ''}
          <span aria-hidden="true">{filtersOpen ? '▴' : '▾'}</span>
        </button>

        {filtersOpen && (
          <div className="unscramble__filters" role="group" aria-label="Word filters">
            <label className="unscramble__field">
              <span className="unscramble__label">Starts with</span>
              <input
                className="unscramble__input unscramble__input--filter"
                type="text"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                maxLength={MAX_TILES}
                placeholder="e.g. st"
                value={startsWith}
                onChange={(e) => {
                  setStartsWith(sanitizeFilterInput(e.target.value))
                  setCopiedAll(false)
                  setCopiedWord(null)
                }}
              />
            </label>
            <label className="unscramble__field">
              <span className="unscramble__label">Contains</span>
              <input
                className="unscramble__input unscramble__input--filter"
                type="text"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                maxLength={MAX_TILES}
                placeholder="e.g. ai"
                value={contains}
                onChange={(e) => {
                  setContains(sanitizeFilterInput(e.target.value))
                  setCopiedAll(false)
                  setCopiedWord(null)
                }}
              />
            </label>
            <label className="unscramble__field">
              <span className="unscramble__label">Ends with</span>
              <input
                className="unscramble__input unscramble__input--filter"
                type="text"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                maxLength={MAX_TILES}
                placeholder="e.g. er"
                value={endsWith}
                onChange={(e) => {
                  setEndsWith(sanitizeFilterInput(e.target.value))
                  setCopiedAll(false)
                  setCopiedWord(null)
                }}
              />
            </label>
          </div>
        )}
      </div>

      <div className="unscramble__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={clearAll}
          disabled={clearDisabled}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={copyResults}
          disabled={!words.length}
        >
          {copiedAll ? 'Copied' : 'Copy all'}
        </button>
      </div>

      {!canSearch ? (
        <p className="unscramble__empty">{emptyMessage}</p>
      ) : words.length === 0 ? (
        <p className="unscramble__empty" role="status">
          {emptyMessage}
        </p>
      ) : (
        <div className="unscramble__results" role="region" aria-live="polite">
          <p className="count">
            {words.length} {words.length === 1 ? 'word' : 'words'}
            <span className="unscramble__copy-tip"> · tap a word to copy</span>
          </p>
          {groups.map((group) => (
            <div key={group.length} className="unscramble__group">
              <h2 className="unscramble__group-title">
                {group.length} {group.length === 1 ? 'letter' : 'letters'}
                <span className="unscramble__group-count">{group.words.length}</span>
              </h2>
              <ul className="unscramble__list">
                {group.words.map((word) => (
                  <li key={word}>
                    <button
                      type="button"
                      className={`unscramble__word${
                        copiedWord === word ? ' unscramble__word--copied' : ''
                      }`}
                      onClick={() => void copyWord(word)}
                      aria-label={
                        copiedWord === word
                          ? `Copied ${word}`
                          : `Copy ${word}`
                      }
                    >
                      {copiedWord === word ? 'Copied' : word}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
