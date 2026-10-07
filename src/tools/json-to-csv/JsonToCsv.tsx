import { useMemo, useRef, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import type { CsvDelimiter } from '../csv-column-extractor/csv'
import {
  DEFAULT_JSON_TO_CSV,
  SAMPLE_JSON,
  jsonToCsv,
  type JsonToCsvOptions,
} from '../csv-to-json/convert'

const DELIMITERS: { id: CsvDelimiter; label: string }[] = [
  { id: ',', label: 'Comma' },
  { id: ';', label: 'Semicolon' },
  { id: '\t', label: 'Tab' },
]

export default function JsonToCsv() {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<JsonToCsvOptions>(DEFAULT_JSON_TO_CSV)
  const [copied, setCopied] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const result = useMemo(() => jsonToCsv(input, options), [input, options])
  const output = result.ok ? result.text : ''
  const hasOutput = result.ok && output.length > 0
  const error =
    fileError ?? (!result.ok && !result.empty ? result.error : null)

  const copyOutput = async () => {
    if (!hasOutput) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      trackToolUsed('json-to-csv', {
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
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8' })
    downloadBlob(blob, `bento-from-json-${dateStamp()}.csv`)
    trackToolUsed('json-to-csv', {
      detail: 'download',
      pages: result.rowCount,
    })
  }

  const onFile = async (file: File | undefined) => {
    setFileError(null)
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      setFileError('Keep JSON files under 8 MB for this browser tool.')
      return
    }
    try {
      setInput(await file.text())
      setCopied(false)
      trackToolUsed('json-to-csv', { detail: 'upload' })
    } catch {
      setFileError('Could not read that file.')
    }
  }

  return (
    <section className="text-tool" aria-label="JSON to CSV">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Paste JSON</span>
          <textarea
            className="text-tool__textarea text-tool__textarea--code"
            spellCheck={false}
            rows={12}
            placeholder='[{"name":"Ada","city":"London"}]'
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
            accept=".json,application/json,text/plain"
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
            Choose JSON
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setInput(SAMPLE_JSON)
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

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">CSV delimiter</legend>
          <div className="text-tool__mode-row">
            {DELIMITERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`text-tool__mode${
                  options.delimiter === item.id ? ' is-on' : ''
                }`}
                aria-pressed={options.delimiter === item.id}
                onClick={() => {
                  setOptions({ delimiter: item.id })
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
            ? result.rowCount === 0
              ? 'Empty array — nothing to export yet.'
              : `${result.rowCount.toLocaleString()} ${
                  result.rowCount === 1 ? 'row' : 'rows'
                } · ${result.columnCount.toLocaleString()} ${
                  result.columnCount === 1 ? 'column' : 'columns'
                }`
            : 'Paste a JSON array of objects or arrays, then export CSV.'}
        </p>
      )}

      <div className="text-tool__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={downloadOutput}
          disabled={!hasOutput}
        >
          Download CSV
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
        <span className="text-tool__label">CSV</span>
        <textarea
          className="text-tool__textarea text-tool__textarea--code"
          readOnly
          rows={12}
          value={output}
          placeholder="Converted CSV appears here."
        />
      </label>
    </section>
  )
}
