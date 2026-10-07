import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import {
  DEFAULT_PASSWORD_OPTIONS,
  MAX_COUNT,
  MAX_LENGTH,
  MIN_COUNT,
  MIN_LENGTH,
  generatePasswords,
  type PasswordOptions,
} from './generate'

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>(
    DEFAULT_PASSWORD_OPTIONS,
  )
  const [nonce, setNonce] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const result = useMemo(() => {
    void nonce
    return generatePasswords(options)
  }, [options, nonce])

  const passwords = result.ok ? result.passwords : []
  const error = result.ok ? null : result.error

  const patch = (partial: Partial<PasswordOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    setCopied(null)
  }

  const regenerate = () => {
    setNonce((value) => value + 1)
    setCopied(null)
    trackToolUsed('password-generator', {
      detail: 'generate',
      pages: options.count,
    })
  }

  const copyPassword = async (password: string, key: string) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(key)
      trackToolUsed('password-generator', { detail: 'copy' })
      window.setTimeout(() => {
        setCopied((current) => (current === key ? null : current))
      }, 1600)
    } catch {
      setCopied(null)
    }
  }

  const copyAll = async () => {
    if (!passwords.length) return
    await copyPassword(passwords.join('\n'), 'all')
  }

  return (
    <section className="text-tool" aria-label="Password Generator">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">
            Length · {options.length}
          </span>
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
          <span className="text-tool__label">
            How many · {options.count}
          </span>
          <input
            className="text-tool__range"
            type="range"
            min={MIN_COUNT}
            max={MAX_COUNT}
            value={options.count}
            onChange={(e) => patch({ count: Number(e.target.value) })}
          />
        </label>

        <fieldset className="text-tool__opts">
          <legend className="text-tool__label">Characters</legend>
          <label className="text-tool__check">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={() => patch({ lowercase: !options.lowercase })}
            />
            Lowercase (a–z)
          </label>
          <label className="text-tool__check">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={() => patch({ uppercase: !options.uppercase })}
            />
            Uppercase (A–Z)
          </label>
          <label className="text-tool__check">
            <input
              type="checkbox"
              checked={options.digits}
              onChange={() => patch({ digits: !options.digits })}
            />
            Digits (0–9)
          </label>
          <label className="text-tool__check">
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={() => patch({ symbols: !options.symbols })}
            />
            Symbols (!@#$…)
          </label>
          <label className="text-tool__check">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={() =>
                patch({ excludeAmbiguous: !options.excludeAmbiguous })
              }
            />
            Exclude ambiguous (0 O 1 l I)
          </label>
        </fieldset>

        <div className="text-tool__actions text-tool__actions--inline">
          <button
            type="button"
            className="btn btn--primary"
            onClick={regenerate}
            disabled={!result.ok}
          >
            Generate
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={copyAll}
            disabled={!passwords.length}
          >
            {copied === 'all' ? 'Copied' : 'Copy all'}
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
            ? `${result.strength.label} · ~${Math.round(result.strength.bits)} bits · ${result.charsetSize} character pool`
            : 'Choose character sets, then generate.'}
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
        {passwords.map((password, index) => {
          const key = `pw-${index}`
          return (
            <li key={key} className="text-tool__password-row">
              <code className="text-tool__password">{password}</code>
              <button
                type="button"
                className="btn btn--ghost text-tool__mini"
                onClick={() => void copyPassword(password, key)}
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
