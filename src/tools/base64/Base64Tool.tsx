import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import {
  DEFAULT_BASE64_OPTIONS,
  convertBase64,
  sampleForMode,
  type Base64Mode,
  type Base64Options,
} from './base64'

const MODES: { id: Base64Mode; label: string }[] = [
  { id: 'encode', label: 'Encode' },
  { id: 'decode', label: 'Decode' },
]

export default function Base64Tool() {
  const [mode, setMode] = useState<Base64Mode>('encode')
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<Base64Options>(DEFAULT_BASE64_OPTIONS)
  const [copied, setCopied] = useState(false)

  const result = useMemo(
    () => convertBase64(mode, input, options),
    [mode, input, options],
  )
  const output = result.ok ? result.text : ''
  const hasOutput = result.ok && output.length > 0
  const error = !result.ok && !result.empty ? result.error : null

  const switchMode = (next: Base64Mode) => {
    if (next === mode) return
    setMode(next)
    setCopied(false)
  }

  const copyOutput = async () => {
    if (!hasOutput) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      trackToolUsed('base64', {
        detail: `${mode}-copy`,
        pages: result.ok ? result.outputBytes : 0,
      })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const downloadOutput = () => {
    if (!hasOutput || !result.ok) return
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    downloadBlob(
      blob,
      `bento-base64-${mode === 'encode' ? 'encoded' : 'decoded'}-${dateStamp()}.txt`,
    )
    trackToolUsed('base64', {
      detail: `${mode}-download`,
      pages: result.outputBytes,
    })
  }

  return (
    <section className="text-tool" aria-label="Base64 Encode Decode">
      <div className="text-tool__panel">
        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Mode</legend>
          <div className="text-tool__mode-row">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`text-tool__mode${mode === item.id ? ' is-on' : ''}`}
                aria-pressed={mode === item.id}
                onClick={() => switchMode(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="text-tool__field">
          <span className="text-tool__label">
            {mode === 'encode' ? 'Plain text' : 'Base64'}
          </span>
          <textarea
            className="text-tool__textarea text-tool__textarea--code"
            spellCheck={false}
            rows={10}
            placeholder={
              mode === 'encode'
                ? 'Type or paste text to encode…'
                : 'Paste Base64 to decode…'
            }
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setCopied(false)
            }}
          />
        </label>

        {mode === 'encode' && (
          <label className="text-tool__check text-tool__check--solo">
            <input
              type="checkbox"
              checked={options.urlSafe}
              onChange={() => {
                setOptions((current) => ({
                  ...current,
                  urlSafe: !current.urlSafe,
                }))
                setCopied(false)
              }}
            />
            URL-safe (no + / =)
          </label>
        )}

        <div className="text-tool__actions text-tool__actions--inline">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setInput(sampleForMode(mode))
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
            disabled={!input}
          >
            Clear
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-tool__hint text-tool__hint--warn" role="status">
          {error}
        </p>
      ) : (
        <p className="text-tool__hint">
          {result.ok
            ? `${result.inputBytes.toLocaleString()} → ${result.outputBytes.toLocaleString()} bytes`
            : mode === 'encode'
              ? 'Encode UTF-8 text to Base64 on this device.'
              : 'Decode standard or URL-safe Base64 on this device.'}
        </p>
      )}

      <div className="text-tool__actions">
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
        <span className="text-tool__label">
          {mode === 'encode' ? 'Base64' : 'Decoded text'}
        </span>
        <textarea
          className="text-tool__textarea text-tool__textarea--code"
          readOnly
          rows={10}
          value={output}
          placeholder={
            mode === 'encode'
              ? 'Encoded Base64 appears here.'
              : 'Decoded text appears here.'
          }
        />
      </label>
    </section>
  )
}
