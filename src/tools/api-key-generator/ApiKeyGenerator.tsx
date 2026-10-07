import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import {
  DEFAULT_API_KEY_OPTIONS,
  MAX_COUNT,
  MAX_LENGTH,
  MIN_COUNT,
  MIN_LENGTH,
  generateApiKeys,
  type ApiKeyAlphabet,
  type ApiKeyOptions,
} from './generate'

const ALPHABETS: { id: ApiKeyAlphabet; label: string }[] = [
  { id: 'base62', label: 'Base62' },
  { id: 'hex', label: 'Hex' },
  { id: 'base32', label: 'Base32' },
  { id: 'base64url', label: 'Base64url' },
]

export default function ApiKeyGenerator() {
  const [options, setOptions] = useState<ApiKeyOptions>(
    DEFAULT_API_KEY_OPTIONS,
  )
  const [nonce, setNonce] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const result = useMemo(() => {
    void nonce
    return generateApiKeys(options)
  }, [options, nonce])

  const keys = result.ok ? result.keys : []

  const patch = (partial: Partial<ApiKeyOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    setCopied(null)
  }

  const regenerate = () => {
    setNonce((value) => value + 1)
    setCopied(null)
    trackToolUsed('api-key-generator', {
      detail: options.alphabet,
      pages: options.count,
    })
  }

  const copyOne = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      trackToolUsed('api-key-generator', { detail: 'copy' })
      window.setTimeout(() => {
        setCopied((current) => (current === key ? null : current))
      }, 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <section className="text-tool" aria-label="API Key Generator">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Length · {options.length}</span>
          <input
            className="text-tool__range"
            type="range"
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            value={options.length}
            onChange={(e) => patch({ length: Number(e.target.value) })}
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

        <label className="text-tool__field">
          <span className="text-tool__label">Optional prefix</span>
          <input
            className="text-tool__input"
            type="text"
            spellCheck={false}
            placeholder="e.g. sk_live_"
            value={options.prefix}
            onChange={(e) => patch({ prefix: e.target.value })}
          />
        </label>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Alphabet</legend>
          <div className="text-tool__mode-row">
            {ALPHABETS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`text-tool__mode${options.alphabet === item.id ? ' is-on' : ''}`}
                onClick={() => patch({ alphabet: item.id })}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="text-tool__actions text-tool__actions--inline">
          <button type="button" className="btn btn--primary" onClick={regenerate}>
            Generate
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => void copyOne(keys.join('\n'), 'all')}
            disabled={!keys.length}
          >
            {copied === 'all' ? 'Copied' : 'Copy all'}
          </button>
        </div>
      </div>

      {result.ok ? (
        <p className="text-tool__hint">
          ~{Math.round(result.bits)} bits · {result.alphabetSize}-symbol alphabet
        </p>
      ) : (
        <p className="text-tool__hint text-tool__hint--warn" role="status">
          {result.error}
        </p>
      )}

      <ul className="text-tool__password-list">
        {keys.map((key, index) => {
          const rowKey = `key-${index}`
          return (
            <li key={rowKey} className="text-tool__password-row">
              <code className="text-tool__password">{key}</code>
              <button
                type="button"
                className="btn btn--ghost text-tool__mini"
                onClick={() => void copyOne(key, rowKey)}
              >
                {copied === rowKey ? 'Copied' : 'Copy'}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
