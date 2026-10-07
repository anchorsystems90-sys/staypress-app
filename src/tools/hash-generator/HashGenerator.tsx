import { useEffect, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import {
  DEFAULT_HASH_OPTIONS,
  HASH_ALGORITHMS,
  hashText,
  type HashAlgorithm,
  type HashOptions,
  type HashResult,
} from './generate'

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<HashOptions>(DEFAULT_HASH_OPTIONS)
  const [result, setResult] = useState<HashResult | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      if (!input) {
        setResult(null)
        return
      }
      const next = await hashText(input, options)
      if (!cancelled) setResult(next)
    })()
    return () => {
      cancelled = true
    }
  }, [input, options])

  const patch = (partial: Partial<HashOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    setCopied(false)
  }

  const copyDigest = async () => {
    if (!result?.ok) return
    try {
      await navigator.clipboard.writeText(result.digest)
      setCopied(true)
      trackToolUsed('hash-generator', {
        detail: `${options.algorithm}-${options.output}`,
      })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="text-tool" aria-label="Hash Generator">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Text to hash</span>
          <textarea
            className="text-tool__textarea text-tool__textarea--code"
            spellCheck={false}
            rows={8}
            placeholder="Paste text…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setCopied(false)
            }}
          />
        </label>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Algorithm</legend>
          <div className="text-tool__mode-row">
            {HASH_ALGORITHMS.map((algo) => (
              <button
                key={algo}
                type="button"
                className={`text-tool__mode${options.algorithm === algo ? ' is-on' : ''}`}
                onClick={() => patch({ algorithm: algo as HashAlgorithm })}
              >
                {algo}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Output</legend>
          <div className="text-tool__mode-row">
            {(['hex', 'base64'] as const).map((output) => (
              <button
                key={output}
                type="button"
                className={`text-tool__mode${options.output === output ? ' is-on' : ''}`}
                onClick={() => patch({ output })}
              >
                {output}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="text-tool__actions text-tool__actions--inline">
          <button
            type="button"
            className="btn btn--primary"
            onClick={copyDigest}
            disabled={!result?.ok}
          >
            {copied ? 'Copied' : 'Copy digest'}
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

      {result?.ok ? (
        <>
          <p className="text-tool__hint">
            {result.algorithm} · {result.bytes} bytes · UTF-8 input · stays on
            this device
          </p>
          <div className="text-tool__output-wrap">
            <code className="text-tool__password text-tool__password--block">
              {result.digest}
            </code>
          </div>
        </>
      ) : result ? (
        <p className="text-tool__hint text-tool__hint--warn" role="status">
          {result.error}
        </p>
      ) : (
        <p className="text-tool__hint">
          Hash with Web Crypto — nothing is uploaded.
        </p>
      )}
    </section>
  )
}
