import { useMemo, useRef, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import {
  DEFAULT_JSON_OPTIONS,
  INDENT_CHOICES,
  SAMPLE_JSON,
  countSourceLines,
  formatJson,
  inspectJson,
  jsonDocStats,
  mapTrimmedErrorLineToSource,
  type JsonFormatOptions,
  type JsonIndent,
} from './formatJson'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState<JsonFormatOptions>(DEFAULT_JSON_OPTIONS)
  const gutterRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)

  // Live inspect stays synchronous: Audit #7 showed ≤100 KB is ~ms and ~1 MB
  // pastes are ~50 ms — not enough to justify debounce for typical use.
  const check = useMemo(() => inspectJson(input), [input])
  const stats = useMemo(() => jsonDocStats(input), [input])
  const lineCount = useMemo(() => countSourceLines(input), [input])
  const lineNumbers = useMemo(() => {
    const lines = new Array<number>(lineCount)
    for (let i = 0; i < lineCount; i++) lines[i] = i + 1
    return lines
  }, [lineCount])
  const errorSourceLine = useMemo(() => {
    if (check.ok || check.empty || !check.error) return null
    return mapTrimmedErrorLineToSource(input, check.error.line)
  }, [check, input])
  const gutterDigits = Math.max(2, String(lineCount).length)
  const hasInput = input.length > 0
  const isValid = check.ok

  const syncGutterScroll = () => {
    const gutter = gutterRef.current
    const text = textRef.current
    if (!gutter || !text) return
    gutter.scrollTop = text.scrollTop
  }

  const apply = (mode: 'pretty' | 'minify') => {
    const result = formatJson(input, mode, options)
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
    if (!isValid) return
    const blob = new Blob([input], { type: 'application/json;charset=utf-8' })
    downloadBlob(blob, `bento-formatted-${dateStamp()}.json`)
    trackToolUsed('json-formatter', { detail: 'download' })
  }

  const setIndent = (indent: JsonIndent) => {
    setOptions((current) => ({ ...current, indent }))
  }

  return (
    <section className="text-tool" aria-label="JSON Formatter">
      <div className="text-tool__panel">
        <div className="text-tool__field">
          <label className="text-tool__label" htmlFor="json-formatter-input">
            JSON
          </label>
          <div className="text-tool__editor">
            <div
              ref={gutterRef}
              className="text-tool__gutter"
              aria-hidden="true"
              style={{ width: `${gutterDigits + 1.25}ch` }}
            >
              {lineNumbers.map((n) => (
                <div
                  key={n}
                  className={`text-tool__gutter-line${
                    errorSourceLine === n ? ' is-error' : ''
                  }`}
                >
                  {n}
                </div>
              ))}
            </div>
            <textarea
              id="json-formatter-input"
              ref={textRef}
              className="text-tool__textarea text-tool__textarea--code text-tool__textarea--lined"
              spellCheck={false}
              rows={16}
              placeholder='{"hello": "world"}'
              value={input}
              onScroll={syncGutterScroll}
              onChange={(e) => {
                setInput(e.target.value)
                setCopied(false)
              }}
            />
          </div>
        </div>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Indent</legend>
          <div className="text-tool__mode-row">
            {INDENT_CHOICES.map((item) => (
              <button
                key={String(item.id)}
                type="button"
                className={`text-tool__mode${options.indent === item.id ? ' is-on' : ''}`}
                aria-pressed={options.indent === item.id}
                onClick={() => setIndent(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="text-tool__check text-tool__check--solo">
          <input
            type="checkbox"
            checked={options.sortKeys}
            onChange={() =>
              setOptions((current) => ({
                ...current,
                sortKeys: !current.sortKeys,
              }))
            }
          />
          Sort keys
        </label>
      </div>

      {!hasInput ? (
        <p className="text-tool__hint" role="status">
          Paste JSON, then pretty-print or minify it on this device.
        </p>
      ) : isValid ? (
        <p className="text-tool__hint" role="status">
          Valid JSON · {stats.characters.toLocaleString()} characters ·{' '}
          {stats.lines.toLocaleString()} {stats.lines === 1 ? 'line' : 'lines'} ·{' '}
          {stats.bytes.toLocaleString()} UTF-8{' '}
          {stats.bytes === 1 ? 'byte' : 'bytes'}
        </p>
      ) : check.error ? (
        <div className="text-tool__error" role="status">
          <p className="text-tool__error-title">{check.error.title}</p>
          {check.error.line != null && check.error.column != null ? (
            <p className="text-tool__error-loc">
              Line {check.error.line}, column {check.error.column}
            </p>
          ) : null}
          <p className="text-tool__error-msg">{check.error.message}</p>
          {check.error.context ? (
            <pre className="text-tool__error-ctx">{check.error.context}</pre>
          ) : null}
          <p className="text-tool__hint text-tool__hint--compact">
            {stats.characters.toLocaleString()} characters ·{' '}
            {stats.lines.toLocaleString()} {stats.lines === 1 ? 'line' : 'lines'} ·{' '}
            {stats.bytes.toLocaleString()} UTF-8{' '}
            {stats.bytes === 1 ? 'byte' : 'bytes'}
          </p>
        </div>
      ) : null}

      <div className="text-tool__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setInput(SAMPLE_JSON)
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
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => apply('minify')}
          disabled={!isValid}
        >
          Minify
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={downloadOutput}
          disabled={!isValid}
          title={
            hasInput && !isValid
              ? 'Download is available when the JSON is valid.'
              : undefined
          }
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
          disabled={!isValid}
        >
          Pretty-print
        </button>
      </div>
    </section>
  )
}
