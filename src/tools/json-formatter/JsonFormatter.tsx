import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import { formatJson, inspectJson } from './formatJson'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const check = useMemo(() => inspectJson(input), [input])
  const hasInput = input.trim().length > 0

  const apply = (mode: 'pretty' | 'minify') => {
    const result = formatJson(input, mode)
    if (!result.ok) return
    setInput(result.text)
    setCopied(false)
    trackToolUsed('json-formatter', { detail: mode })
  }

  const copyOutput = async () => {
    if (!hasInput) return
    try {
      await navigator.clipboard.writeText(input)
      setCopied(true)
      trackToolUsed('json-formatter', { detail: 'copy' })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const downloadOutput = () => {
    if (!hasInput) return
    const blob = new Blob([input], { type: 'application/json;charset=utf-8' })
    downloadBlob(blob, `bento-formatted-${dateStamp()}.json`)
    trackToolUsed('json-formatter', { detail: 'download' })
  }

  return (
    <section className="text-tool" aria-label="JSON Formatter">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">JSON</span>
          <textarea
            className="text-tool__textarea text-tool__textarea--code"
            spellCheck={false}
            rows={16}
            placeholder='{"hello": "world"}'
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setCopied(false)
            }}
          />
        </label>
      </div>

      <p
        className={`text-tool__hint${hasInput && !check.ok ? ' text-tool__hint--warn' : ''}`}
        role="status"
      >
        {!hasInput
          ? 'Paste JSON, then pretty-print or minify it on this device.'
          : check.ok
            ? 'Valid JSON.'
            : check.error}
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
          onClick={() => apply('minify')}
          disabled={!check.ok}
        >
          Minify
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={downloadOutput}
          disabled={!hasInput}
        >
          Download
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={copyOutput}
          disabled={!hasInput}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => apply('pretty')}
          disabled={!check.ok}
        >
          Pretty-print
        </button>
      </div>
    </section>
  )
}
