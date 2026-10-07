import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import {
  SAMPLE_COUNT_INPUT,
  countTextStats,
  formatCountSummary,
} from './count'

export default function WordCounter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => countTextStats(input), [input])
  const summary = useMemo(() => formatCountSummary(stats), [stats])
  const hasInput = input.length > 0

  const copySummary = async () => {
    if (!hasInput) return
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      trackToolUsed('word-counter', {
        detail: 'copy-summary',
        pages: stats.words,
      })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const rows: { label: string; value: string }[] = [
    { label: 'Words', value: stats.words.toLocaleString() },
    { label: 'Characters', value: stats.characters.toLocaleString() },
    {
      label: 'Characters (no spaces)',
      value: stats.charactersNoSpaces.toLocaleString(),
    },
    { label: 'Sentences', value: stats.sentences.toLocaleString() },
    { label: 'Paragraphs', value: stats.paragraphs.toLocaleString() },
    { label: 'Lines', value: stats.lines.toLocaleString() },
    {
      label: 'Reading time',
      value:
        stats.words === 0
          ? '—'
          : `~${stats.readingMinutes} min`,
    },
  ]

  return (
    <section className="text-tool" aria-label="Word Counter">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Paste text</span>
          <textarea
            className="text-tool__textarea"
            spellCheck={true}
            rows={12}
            placeholder="Paste a draft, email, or essay…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setCopied(false)
            }}
          />
        </label>

        <div className="text-tool__actions text-tool__actions--inline">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setInput(SAMPLE_COUNT_INPUT)
              setCopied(false)
            }}
          >
            Sample
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setInput('')
              setCopied(false)
            }}
            disabled={!hasInput}
          >
            Clear
          </button>
        </div>
      </div>

      <p className="text-tool__hint">
        {hasInput
          ? 'Counts update as you type. Nothing is uploaded.'
          : 'Paste text to count words, characters, sentences, and more.'}
      </p>

      <dl className="text-tool__stats" aria-live="polite">
        {rows.map((row) => (
          <div key={row.label} className="text-tool__stat">
            <dt className="text-tool__stat-label">{row.label}</dt>
            <dd className="text-tool__stat-value">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="text-tool__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={copySummary}
          disabled={!hasInput}
        >
          {copied ? 'Copied' : 'Copy summary'}
        </button>
      </div>
    </section>
  )
}
