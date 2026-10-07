import { useMemo, useRef, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import {
  DEFAULT_CSV_TO_JSON,
  SAMPLE_CSV,
  csvToJson,
  type CsvToJsonOptions,
  type JsonShape,
} from './convert'

const SHAPES: { id: JsonShape; label: string }[] = [
  { id: 'objects', label: 'Objects' },
  { id: 'arrays', label: 'Arrays' },
]

export default function CsvToJson() {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<CsvToJsonOptions>(DEFAULT_CSV_TO_JSON)
  const [copied, setCopied] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const result = useMemo(() => csvToJson(input, options), [input, options])
  const output = result.ok ? result.text : ''
  const hasOutput = result.ok && output.length > 0
  const error =
    fileError ?? (!result.ok && !result.empty ? result.error : null)

  const copyOutput = async () => {
    if (!hasOutput) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      trackToolUsed('csv-to-json', {
        detail: 'copy',
        pages: result.ok ? result.rowCount : 0,
      })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const downloadOutput = () => {
    if (!hasOutput || !result.ok) return
    const blob = new Blob([output], { type: 'application/json;charset=utf-8' })
    downloadBlob(blob, `bento-from-csv-${dateStamp()}.json`)
    trackToolUsed('csv-to-json', {
      detail: 'download',
      pages: result.rowCount,
    })
  }

  const onFile = async (file: File | undefined) => {
    setFileError(null)
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      setFileError('Keep CSV files under 8 MB for this browser tool.')
      return
    }
    try {
      setInput(await file.text())
      setCopied(false)
      trackToolUsed('csv-to-json', { detail: 'upload' })
    } catch {
      setFileError('Could not read that file.')
    }
  }

  return (
    <section className="text-tool" aria-label="CSV to JSON">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Paste CSV</span>
          <textarea
            className="text-tool__textarea text-tool__textarea--code"
            spellCheck={false}
            rows={12}
            placeholder={'name,email,city\nAda,ada@example.com,London'}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setFileError(null)
              setCopied(false)
            }}
          />
        </label>

        <div className="text-tool__actions text-tool__actions--inline">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            hidden
            onChange={(e) => {
              void onFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => fileRef.current?.click()}
          >
            Choose CSV
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setInput(SAMPLE_CSV)
              setFileError(null)
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
              setFileError(null)
              setCopied(false)
            }}
            disabled={!input}
          >
            Clear
          </button>
        </div>

        <label className="text-tool__check text-tool__check--solo">
          <input
            type="checkbox"
            checked={options.hasHeader}
            onChange={() => {
              setOptions((current) => ({
                ...current,
                hasHeader: !current.hasHeader,
              }))
              setCopied(false)
            }}
          />
          First row is a header
        </label>
        <label className="text-tool__check text-tool__check--solo">
          <input
            type="checkbox"
            checked={options.pretty}
            onChange={() => {
              setOptions((current) => ({
                ...current,
                pretty: !current.pretty,
              }))
              setCopied(false)
            }}
          />
          Pretty-print JSON
        </label>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">JSON shape</legend>
          <div className="text-tool__mode-row">
            {SHAPES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`text-tool__mode${
                  options.shape === item.id ? ' is-on' : ''
                }`}
                aria-pressed={options.shape === item.id}
                onClick={() => {
                  setOptions((current) => ({ ...current, shape: item.id }))
                  setCopied(false)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {error ? (
        <p className="text-tool__hint text-tool__hint--warn" role="status">
          {error}
        </p>
      ) : (
        <p className="text-tool__hint">
          {result.ok
            ? `${result.rowCount.toLocaleString()} ${
                result.rowCount === 1 ? 'row' : 'rows'
              } · ${result.columnCount.toLocaleString()} ${
                result.columnCount === 1 ? 'column' : 'columns'
              }`
            : 'Paste CSV or choose a file, then copy or download JSON.'}
        </p>
      )}

      <div className="text-tool__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={downloadOutput}
          disabled={!hasOutput}
        >
          Download JSON
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
        <span className="text-tool__label">JSON</span>
        <textarea
          className="text-tool__textarea text-tool__textarea--code"
          readOnly
          rows={12}
          value={output}
          placeholder="Converted JSON appears here."
        />
      </label>
    </section>
  )
}
