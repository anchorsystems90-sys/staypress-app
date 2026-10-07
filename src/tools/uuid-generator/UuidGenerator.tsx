import { useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import {
  DEFAULT_UUID_OPTIONS,
  MAX_COUNT,
  MIN_COUNT,
  generateUuids,
  type UuidOptions,
} from './generate'

export default function UuidGenerator() {
  const [options, setOptions] = useState<UuidOptions>(DEFAULT_UUID_OPTIONS)
  const [nonce, setNonce] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const result = useMemo(() => {
    void nonce
    return generateUuids(options)
  }, [options, nonce])

  const uuids = result.ok ? result.uuids : []

  const patch = (partial: Partial<UuidOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    setCopied(null)
  }

  const regenerate = () => {
    setNonce((value) => value + 1)
    setCopied(null)
    trackToolUsed('uuid-generator', {
      detail: 'generate',
      pages: options.count,
    })
  }

  const copyOne = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      trackToolUsed('uuid-generator', { detail: 'copy' })
      window.setTimeout(() => {
        setCopied((current) => (current === key ? null : current))
      }, 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <section className="text-tool" aria-label="UUID Generator">
      <div className="text-tool__panel">
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

        <fieldset className="text-tool__opts">
          <legend className="text-tool__label">Format</legend>
          <label className="text-tool__check">
            <input
              type="checkbox"
              checked={options.hyphens}
              onChange={() => patch({ hyphens: !options.hyphens })}
            />
            Hyphens
          </label>
          <label className="text-tool__check">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={() => patch({ uppercase: !options.uppercase })}
            />
            Uppercase
          </label>
        </fieldset>

        <div className="text-tool__actions text-tool__actions--inline">
          <button type="button" className="btn btn--primary" onClick={regenerate}>
            Generate
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => void copyOne(uuids.join('\n'), 'all')}
            disabled={!uuids.length}
          >
            {copied === 'all' ? 'Copied' : 'Copy all'}
          </button>
        </div>
      </div>

      <p className="text-tool__hint">
        RFC 4122 version 4 · random UUIDs on this device
      </p>

      <ul className="text-tool__password-list">
        {uuids.map((id, index) => {
          const key = `uuid-${index}`
          return (
            <li key={key} className="text-tool__password-row">
              <code className="text-tool__password">{id}</code>
              <button
                type="button"
                className="btn btn--ghost text-tool__mini"
                onClick={() => void copyOne(id, key)}
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
