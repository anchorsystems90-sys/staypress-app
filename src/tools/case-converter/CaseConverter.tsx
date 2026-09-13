import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadBlob } from '../../lib/download'
import {
  CASE_MODES,
  IDENTIFIER_MODES,
  SAMPLE_CASE_INPUT,
  convertCase,
  countText,
  identifierOutputs,
  type CaseMode,
  type IdentifierMode,
} from './convertCase'

const IDENTIFIER_LABELS: Record<IdentifierMode, string> = {
  camel: 'camelCase',
  pascal: 'PascalCase',
  snake: 'snake_case',
  kebab: 'kebab-case',
  constant: 'CONSTANT_CASE',
}

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<CaseMode>('title')
  const [copied, setCopied] = useState(false)
  const [copiedId, setCopiedId] = useState<IdentifierMode | null>(null)

  const output = useMemo(() => convertCase(input, mode), [input, mode])
  const identifiers = useMemo(() => identifierOutputs(input), [input])
  const counts = countText(input)
  const hasOutput = output.length > 0
  const hasIdentifiers = IDENTIFIER_MODES.some((id) => identifiers[id].length > 0)

  const copyOutput = async () => {
    if (!hasOutput) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setCopiedId(null)
      trackToolUsed('case-converter', { detail: mode })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const copyIdentifier = async (id: IdentifierMode) => {
    const value = identifiers[id]
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopiedId(id)
      setCopied(false)
      trackToolUsed('case-converter', { detail: `id-${id}` })
      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current))
      }, 1200)
    } catch {
      setCopiedId(null)
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
              setCopiedId(null)
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
        {input
          ? `${counts.characters.toLocaleString()} characters · ${counts.words.toLocaleString()} ${
              counts.words === 1 ? 'word' : 'words'
            }`
          : 'Identifier styles rebuild from the words in your text.'}
      </p>

      <div className="text-tool__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setInput(SAMPLE_CASE_INPUT)
            setCopied(false)
            setCopiedId(null)
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
            setCopiedId(null)
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

      {hasIdentifiers && (
        <div className="text-tool__ids" aria-label="Identifier formats">
          <p className="text-tool__label">Identifier formats</p>
          <ul className="text-tool__id-list">
            {IDENTIFIER_MODES.map((id) => (
              <li key={id} className="text-tool__id-row">
                <span className="text-tool__id-name">{IDENTIFIER_LABELS[id]}</span>
                <code className="text-tool__id-value">{identifiers[id] || '—'}</code>
                <button
                  type="button"
                  className="btn btn--ghost text-tool__id-copy"
                  disabled={!identifiers[id]}
                  onClick={() => void copyIdentifier(id)}
                >
                  {copiedId === id ? 'Copied' : 'Copy'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
