import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import {
  DEFAULT_CLEAN_OPTIONS,
  SAMPLE_CLEAN_INPUT,
  cleanText,
  formatDelta,
  textDelta,
  textStats,
  type CleanOptions,
} from './clean'

const OPTION_LABELS: { key: keyof CleanOptions; label: string }[] = [
  { key: 'trimLines', label: 'Trim lines' },
  { key: 'collapseSpaces', label: 'Collapse extra spaces' },
  { key: 'tabsToSpaces', label: 'Tabs → spaces' },
  { key: 'normalizeNewlines', label: 'Normalize line endings' },
  { key: 'removeBlankLines', label: 'Remove blank lines' },
  { key: 'joinLines', label: 'Join lines' },
  { key: 'removeDuplicateLines', label: 'Remove duplicate lines' },
  { key: 'stripHtml', label: 'Strip HTML' },
  { key: 'removeSpecialChars', label: 'Remove special characters' },
]

export default function TextCleaner() {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<CleanOptions>(DEFAULT_CLEAN_OPTIONS)
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => cleanText(input, options), [input, options])
  const stats = textStats(output)
  const delta = useMemo(() => textDelta(input, output), [input, output])
  const deltaLabel = input.length > 0 ? formatDelta(delta) : null
  const hasOutput = output.length > 0
  const optionsDirty = useMemo(
    () =>
      (Object.keys(DEFAULT_CLEAN_OPTIONS) as (keyof CleanOptions)[]).some(
        (key) => options[key] !== DEFAULT_CLEAN_OPTIONS[key],
      ),
    [options],
  )

  const toggle = (key: keyof CleanOptions) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }))
    setCopied(false)
  }

  const copyOutput = async () => {
    if (!hasOutput) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      trackToolUsed('text-cleaner', { detail: 'copy', pages: stats.lines })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const downloadOutput = () => {
    if (!hasOutput) return
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    downloadBlob(blob, `bento-cleaned-${dateStamp()}.txt`)
    trackToolUsed('text-cleaner', { detail: 'download', pages: stats.lines })
  }

  return (
    <section className="text-tool" aria-label="Text Cleaner">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Paste text</span>
          <textarea
            className="text-tool__textarea"
            spellCheck={false}
            rows={10}
            placeholder="Drop in messy copy, logs, or HTML…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setCopied(false)
            }}
          />
        </label>

        <fieldset className="text-tool__opts">
          <legend className="text-tool__label">Cleanup</legend>
          {OPTION_LABELS.map((opt) => (
            <label key={opt.key} className="text-tool__check">
              <input
                type="checkbox"
                checked={options[opt.key]}
                onChange={() => toggle(opt.key)}
              />
              {opt.label}
            </label>
          ))}
        </fieldset>
      </div>

      <p className="text-tool__hint">
        {hasOutput
          ? `${stats.characters.toLocaleString()} characters · ${stats.words.toLocaleString()} ${
              stats.words === 1 ? 'word' : 'words'
            } · ${stats.lines.toLocaleString()} ${stats.lines === 1 ? 'line' : 'lines'}${
              deltaLabel ? ` · ${deltaLabel}` : ''
            }`
          : 'Choose options, then copy or download the cleaned result.'}
      </p>

      <div className="text-tool__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setInput(SAMPLE_CLEAN_INPUT)
            setCopied(false)
          }}
        >
          Sample
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setOptions({ ...DEFAULT_CLEAN_OPTIONS })
            setCopied(false)
          }}
          disabled={!optionsDirty}
        >
          Reset options
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setInput('')
            setCopied(false)
          }}
          disabled={!input}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={downloadOutput}
          disabled={!hasOutput}
        >
          Download
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={copyOutput}
          disabled={!hasOutput}
        >
          {copied ? 'Copied' : 'Copy result'}
        </button>
      </div>

      <label className="text-tool__field text-tool__output-wrap">
        <span className="text-tool__label">Cleaned text</span>
        <textarea
          className="text-tool__textarea"
          readOnly
          rows={10}
          value={output}
          placeholder="Cleaned text appears here."
        />
      </label>
    </section>
  )
}
