import { useMemo, useRef, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import {
  SAMPLE_CSV,
  csvStats,
  extractColumns,
  inspectCsv,
  serializeCsv,
  type CsvDelimiter,
  type CsvTable,
} from './csv'

const DELIMITER_LABEL: Record<CsvDelimiter, string> = {
  ',': 'Comma',
  ';': 'Semicolon',
  '\t': 'Tab',
}

type StoredSelection = {
  /** Matches columnSignature when the user has made a choice for this shape. */
  sig: string
  indexes: number[]
}

function allColumnIndexes(table: CsvTable): number[] {
  return table.headers.map((_, index) => index)
}

function resolveSelectedIndexes(
  table: CsvTable | undefined,
  columnSignature: string,
  stored: StoredSelection,
): number[] {
  if (!table || !columnSignature) return []
  if (stored.sig !== columnSignature) return allColumnIndexes(table)
  return stored.indexes.filter(
    (index) => index >= 0 && index < table.columnCount,
  )
}

export default function CsvColumnExtractor() {
  const [input, setInput] = useState('')
  const [hasHeader, setHasHeader] = useState(true)
  const [storedSelection, setStoredSelection] = useState<StoredSelection>({
    sig: '',
    indexes: [],
  })
  const [copied, setCopied] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const inspected = useMemo(
    () => (input.trim() ? inspectCsv(input, { hasHeader }) : null),
    [input, hasHeader],
  )
  const table = inspected?.ok ? inspected.table : undefined
  const parseError =
    inspected && !inspected.ok
      ? inspected.error
      : fileError

  const columnSignature = table
    ? `${hasHeader}:${table.columnCount}:${table.headers.join('\u0001')}`
    : ''

  const selectedIndexes = useMemo(
    () => resolveSelectedIndexes(table, columnSignature, storedSelection),
    [table, columnSignature, storedSelection],
  )

  const outputRows = useMemo(() => {
    if (!table || selectedIndexes.length === 0) return []
    return extractColumns(table, selectedIndexes, hasHeader)
  }, [table, selectedIndexes, hasHeader])

  const output = useMemo(() => {
    if (!table || outputRows.length === 0) return ''
    return serializeCsv(outputRows, table.delimiter)
  }, [table, outputRows])

  const stats = table
    ? csvStats(table, selectedIndexes.length)
    : { rows: 0, columns: 0, selected: 0 }
  const hasOutput = output.length > 0

  const commitSelection = (indexes: number[]) => {
    setStoredSelection({ sig: columnSignature, indexes })
    setCopied(false)
  }

  const toggleColumn = (index: number) => {
    const next = selectedIndexes.includes(index)
      ? selectedIndexes.filter((item) => item !== index)
      : [...selectedIndexes, index].sort((a, b) => a - b)
    commitSelection(next)
  }

  const selectAll = () => {
    if (!table) return
    commitSelection(allColumnIndexes(table))
  }

  const selectNone = () => {
    commitSelection([])
  }

  const copyOutput = async () => {
    if (!hasOutput) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      trackToolUsed('csv-column-extractor', {
        detail: 'copy',
        pages: stats.rows,
        files: selectedIndexes.length,
      })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const downloadOutput = () => {
    if (!hasOutput) return
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8' })
    downloadBlob(blob, `bento-columns-${dateStamp()}.csv`)
    trackToolUsed('csv-column-extractor', {
      detail: 'download',
      pages: stats.rows,
      files: selectedIndexes.length,
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
      const text = await file.text()
      setInput(text)
      setCopied(false)
      trackToolUsed('csv-column-extractor', { detail: 'upload' })
    } catch {
      setFileError('Could not read that file.')
    }
  }

  return (
    <section className="text-tool" aria-label="CSV Column Extractor">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Paste CSV</span>
          <textarea
            className="text-tool__textarea text-tool__textarea--code"
            spellCheck={false}
            rows={10}
            placeholder="name,email,city&#10;Ada,ada@example.com,London"
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
              setHasHeader(true)
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
            checked={hasHeader}
            onChange={() => {
              setHasHeader((value) => !value)
              setCopied(false)
            }}
          />
          First row is a header
        </label>

        {table && (
          <fieldset className="text-tool__opts">
            <legend className="text-tool__label">
              Columns
              <span className="text-tool__label-meta">
                {' '}
                · {DELIMITER_LABEL[table.delimiter]} detected
              </span>
            </legend>
            <div className="text-tool__column-actions">
              <button
                type="button"
                className="btn btn--ghost text-tool__mini"
                onClick={selectAll}
              >
                Select all
              </button>
              <button
                type="button"
                className="btn btn--ghost text-tool__mini"
                onClick={selectNone}
              >
                Select none
              </button>
            </div>
            {table.headers.map((header, index) => (
              <label key={`${index}-${header}`} className="text-tool__check">
                <input
                  type="checkbox"
                  checked={selectedIndexes.includes(index)}
                  onChange={() => toggleColumn(index)}
                />
                <span className="text-tool__column-name">{header}</span>
              </label>
            ))}
          </fieldset>
        )}
      </div>

      {parseError ? (
        <p className="text-tool__hint text-tool__hint--warn" role="status">
          {parseError}
        </p>
      ) : (
        <p className="text-tool__hint">
          {table
            ? `${stats.rows.toLocaleString()} ${
                stats.rows === 1 ? 'row' : 'rows'
              } · ${stats.selected} of ${stats.columns} ${
                stats.columns === 1 ? 'column' : 'columns'
              } selected`
            : 'Paste a CSV or choose a file, then pick the columns to keep.'}
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
        <span className="text-tool__label">Extracted CSV</span>
        <textarea
          className="text-tool__textarea text-tool__textarea--code"
          readOnly
          rows={10}
          value={output}
          placeholder="Selected columns appear here."
        />
      </label>
    </section>
  )
}
