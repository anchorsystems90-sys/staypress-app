import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import {
  DEFAULT_PASSPHRASE_OPTIONS,
  MAX_COUNT,
  MAX_WORDS,
  MIN_COUNT,
  MIN_WORDS,
  generatePassphrases,
  type PassphraseOptions,
} from './generate'

const SEPARATORS = [
  { id: '-', label: 'Hyphen' },
  { id: ' ', label: 'Space' },
  { id: '.', label: 'Dot' },
  { id: '', label: 'None' },
] as const

export default function PassphraseGenerator() {
  const [options, setOptions] = useState<PassphraseOptions>(
    DEFAULT_PASSPHRASE_OPTIONS,
  )
  const [nonce, setNonce] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const result = useMemo(() => {
    void nonce
    return generatePassphrases(options)
  }, [options, nonce])

  const passphrases = result.ok ? result.passphrases : []

  const patch = (partial: Partial<PassphraseOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    setCopied(null)
  }

  const regenerate = () => {
    setNonce((value) => value + 1)
    setCopied(null)
    trackToolUsed('passphrase-generator', {
      detail: 'generate',
      pages: options.count,
    })
  }

  const copyOne = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      trackToolUsed('passphrase-generator', { detail: 'copy' })
      window.setTimeout(() => {
        setCopied((current) => (current === key ? null : current))
      }, 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <section className="text-tool" aria-label="Passphrase Generator">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Words · {options.words}</span>
          <input
            className="text-tool__range"
            type="range"
            min={MIN_WORDS}
            max={MAX_WORDS}
            value={options.words}
            onChange={(e) => patch({ words: Number(e.target.value) })}
          />
        </label>

        <label className="text-tool__field">
          <span className="text-tool__label">How many · {options.count}</span>
          <input
            className="text-tool__range"
            type="range"
            min={MIN_COUNT}
            max={MAX_COUNT}
            value={options.count}
            onChange={(e) => patch({ count: Number(e.target.value) })}
          />
        </label>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Separator</legend>
          <div className="text-tool__mode-row">
            {SEPARATORS.map((sep) => (
              <button
                key={sep.label}
                type="button"
                className={`text-tool__mode${options.separator === sep.id ? ' is-on' : ''}`}
                onClick={() => patch({ separator: sep.id })}
              >
                {sep.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="text-tool__opts">
          <legend className="text-tool__label">Options</legend>
          <label className="text-tool__check">
            <input
              type="checkbox"
              checked={options.capitalize}
              onChange={() => patch({ capitalize: !options.capitalize })}
            />
            Capitalize words
          </label>
          <label className="text-tool__check">
            <input
              type="checkbox"
              checked={options.includeNumber}
              onChange={() => patch({ includeNumber: !options.includeNumber })}
            />
            Append a digit
          </label>
        </fieldset>

        <div className="text-tool__actions text-tool__actions--inline">
          <button type="button" className="btn btn--primary" onClick={regenerate}>
            Generate
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => void copyOne(passphrases.join('\n'), 'all')}
            disabled={!passphrases.length}
          >
            {copied === 'all' ? 'Copied' : 'Copy all'}
          </button>
        </div>
      </div>

      {result.ok ? (
        <p className="text-tool__hint">
          {result.strength.label} · ~{Math.round(result.strength.bits)} bits ·{' '}
          {result.wordCount.toLocaleString()} word pool
        </p>
      ) : (
        <p className="text-tool__hint text-tool__hint--warn" role="status">
          {result.error}
        </p>
      )}

      {result.ok && (
        <div
          className={`text-tool__strength text-tool__strength--${result.strength.score}`}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )}

      <ul className="text-tool__password-list">
        {passphrases.map((phrase, index) => {
          const key = `pp-${index}`
          return (
            <li key={key} className="text-tool__password-row">
              <code className="text-tool__password">{phrase}</code>
              <button
                type="button"
                className="btn btn--ghost text-tool__mini"
                onClick={() => void copyOne(phrase, key)}
              >
                {copied === key ? 'Copied' : 'Copy'}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
