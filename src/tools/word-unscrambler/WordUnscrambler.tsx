import { useDeferredValue, useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { loadDictionary } from './dictionary'
import {
  groupByLength,
  normalizeLetters,
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

export default function WordUnscrambler() {
  const [letters, setLetters] = useState('')
  const [length, setLength] = useState<LengthFilter>('any')
  const [copied, setCopied] = useState(false)

  const deferredLetters = useDeferredValue(letters)
  const deferredLength = useDeferredValue(length)

  const dictionary = useMemo(() => loadDictionary(), [])

  const words = useMemo(
    () => unscrambleWords(dictionary, deferredLetters, deferredLength),
    [dictionary, deferredLetters, deferredLength],
  )

  const groups = useMemo(() => groupByLength(words), [words])
  const normalized = normalizeLetters(letters)
  const canSearch = normalized.length >= 3

  const copyResults = async () => {
    if (!words.length) return
    try {
      await navigator.clipboard.writeText(words.join('\n'))
      setCopied(true)
      trackToolUsed('word-unscrambler', { detail: 'copy', pages: words.length })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const clearAll = () => {
    setLetters('')
    setLength('any')
    setCopied(false)
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
            maxLength={12}
            placeholder="e.g. retins"
            value={letters}
            onChange={(e) => {
              setLetters(e.target.value.replace(/[^a-zA-Z]/g, ''))
              setCopied(false)
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
              setCopied(false)
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
        {canSearch
          ? `${normalized.length} letters · results update as you type`
          : 'Enter at least 3 letters. Words are built from your letters only.'}
      </p>

      <div className="unscramble__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={clearAll}
          disabled={!letters && length === 'any'}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={copyResults}
          disabled={!words.length}
        >
          {copied ? 'Copied' : 'Copy words'}
        </button>
      </div>

      {!canSearch ? (
        <p className="unscramble__empty">Type a jumble to find valid English words.</p>
      ) : words.length === 0 ? (
        <p className="unscramble__empty" role="status">
          No words found for those letters. Try a different mix.
        </p>
      ) : (
        <div className="unscramble__results" role="region" aria-live="polite">
          <p className="count">
            {words.length} {words.length === 1 ? 'word' : 'words'}
          </p>
          {groups.map((group) => (
            <div key={group.length} className="unscramble__group">
              <h2 className="unscramble__group-title">
                {group.length} {group.length === 1 ? 'letter' : 'letters'}
                <span className="unscramble__group-count">{group.words.length}</span>
              </h2>
              <ul className="unscramble__list">
                {group.words.map((word) => (
                  <li key={word} className="unscramble__word">
                    {word}
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
