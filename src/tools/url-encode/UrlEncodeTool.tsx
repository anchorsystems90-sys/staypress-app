import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import {
  DEFAULT_URL_ENCODE_OPTIONS,
  convertUrl,
  sampleForMode,
  type UrlEncodeMode,
  type UrlEncodeOptions,
  type UrlEncodeStyle,
} from './urlEncode'

const MODES: { id: UrlEncodeMode; label: string }[] = [
  { id: 'encode', label: 'Encode' },
  { id: 'decode', label: 'Decode' },
]

const STYLES: { id: UrlEncodeStyle; label: string }[] = [
  { id: 'component', label: 'Component' },
  { id: 'uri', label: 'Full URL' },
]

export default function UrlEncodeTool() {
  const [mode, setMode] = useState<UrlEncodeMode>('encode')
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<UrlEncodeOptions>(
    DEFAULT_URL_ENCODE_OPTIONS,
  )
  const [copied, setCopied] = useState(false)

  const result = useMemo(
    () => convertUrl(mode, input, options),
    [mode, input, options],
  )
  const output = result.ok ? result.text : ''
  const hasOutput = result.ok && output.length > 0
  const error = !result.ok && !result.empty ? result.error : null

  const switchMode = (next: UrlEncodeMode) => {
    if (next === mode) return
    setMode(next)
    setCopied(false)
  }

  const copyOutput = async () => {
    if (!hasOutput) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      trackToolUsed('url-encode', {
        detail: `${mode}-copy`,
        pages: result.ok ? result.outputChars : 0,
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
      `bento-url-${mode === 'encode' ? 'encoded' : 'decoded'}-${dateStamp()}.txt`,
    )
    trackToolUsed('url-encode', {
      detail: `${mode}-download`,
      pages: result.outputChars,
    })
  }

  return (
    <section className="text-tool" aria-label="URL Encode Decode">
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

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Style</legend>
          <div className="text-tool__mode-row">
            {STYLES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`text-tool__mode${
                  options.style === item.id ? ' is-on' : ''
                }`}
                aria-pressed={options.style === item.id}
                onClick={() => {
                  setOptions((current) => ({ ...current, style: item.id }))
                  setCopied(false)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="text-tool__field">
          <span className="text-tool__label">
            {mode === 'encode' ? 'Plain text / URL' : 'Encoded text'}
          </span>
          <textarea
            className="text-tool__textarea text-tool__textarea--code"
            spellCheck={false}
            rows={10}
            placeholder={
              mode === 'encode'
                ? 'https://example.com/search?q=hello world'
                : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world'
            }
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setCopied(false)
            }}
          />
        </label>

        {mode === 'decode' && (
          <label className="text-tool__check text-tool__check--solo">
            <input
              type="checkbox"
              checked={options.plusAsSpace}
              onChange={() => {
                setOptions((current) => ({
                  ...current,
                  plusAsSpace: !current.plusAsSpace,
                }))
                setCopied(false)
              }}
            />
            Treat + as space
          </label>
        )}

        <div className="text-tool__actions text-tool__actions--inline">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setInput(sampleForMode(mode, options.style))
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
            ? `${result.inputChars.toLocaleString()} → ${result.outputChars.toLocaleString()} characters`
            : mode === 'encode'
              ? 'Encode query values or a full URL on this device.'
              : 'Decode percent-encoded text on this device.'}
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
          {mode === 'encode' ? 'Encoded' : 'Decoded'}
        </span>
        <textarea
          className="text-tool__textarea text-tool__textarea--code"
          readOnly
          rows={10}
          value={output}
          placeholder={
            mode === 'encode'
              ? 'Encoded text appears here.'
              : 'Decoded text appears here.'
          }
        />
      </label>
    </section>
  )
}
