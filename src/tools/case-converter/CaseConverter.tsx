import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import { CASE_MODES, convertCase, type CaseMode } from './convertCase'

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<CaseMode>('title')
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => convertCase(input, mode), [input, mode])
  const hasOutput = output.length > 0

  const copyOutput = async () => {
    if (!hasOutput) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      trackToolUsed('case-converter', { detail: mode })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const downloadOutput = () => {
    if (!hasOutput) return
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    downloadBlob(blob, `bento-case-${dateStamp()}.txt`)
    trackToolUsed('case-converter', { detail: `${mode}-download` })
  }

  return (
    <section className="text-tool" aria-label="Case Converter">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Paste text</span>
          <textarea
            className="text-tool__textarea"
            spellCheck={false}
            rows={8}
            placeholder="hello world"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setCopied(false)
            }}
          />
        </label>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Case</legend>
          <div className="text-tool__mode-row">
            {CASE_MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`text-tool__mode${mode === item.id ? ' is-on' : ''}`}
                aria-pressed={mode === item.id}
                onClick={() => {
                  setMode(item.id)
                  setCopied(false)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="text-tool__hint">
        Identifier styles (camelCase, snake_case, and similar) rebuild from the
        words in your text.
      </p>

      <div className="text-tool__actions">
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
        <span className="text-tool__label">Converted text</span>
        <textarea
          className="text-tool__textarea"
          readOnly
          rows={8}
          value={output}
          placeholder="Converted text appears here."
        />
      </label>
    </section>
  )
}
