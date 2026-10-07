import { useEffect, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import {
  DEFAULT_HMAC_OPTIONS,
  HMAC_ALGORITHMS,
  hmacText,
  type HmacAlgorithm,
  type HmacOptions,
  type HmacResult,
} from './generate'

export default function HmacGenerator() {
  const [message, setMessage] = useState('')
  const [secret, setSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [options, setOptions] = useState<HmacOptions>(DEFAULT_HMAC_OPTIONS)
  const [result, setResult] = useState<HmacResult | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      if (!message && !secret) {
        setResult(null)
        return
      }
      const next = await hmacText(message, secret, options)
      if (!cancelled) setResult(next)
    })()
    return () => {
      cancelled = true
    }
  }, [message, secret, options])

  const patch = (partial: Partial<HmacOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    setCopied(false)
  }

  const copyDigest = async () => {
    if (!result?.ok) return
    try {
      await navigator.clipboard.writeText(result.digest)
      setCopied(true)
      trackToolUsed('hmac-generator', {
        detail: `${options.algorithm}-${options.output}`,
      })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="text-tool" aria-label="HMAC Generator">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Message</span>
          <textarea
            className="text-tool__textarea text-tool__textarea--code"
            spellCheck={false}
            rows={7}
            placeholder="Paste the payload to sign…"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              setCopied(false)
            }}
          />
        </label>

        <div className="text-tool__field">
          <div className="text-tool__label">
            <label htmlFor="hmac-secret">Secret key</label>
            <button
              type="button"
              className="text-tool__reveal"
              onClick={() => setShowSecret((value) => !value)}
            >
              {showSecret ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            id="hmac-secret"
            className="text-tool__input text-tool__input--mono"
            type={showSecret ? 'text' : 'password'}
            spellCheck={false}
            autoComplete="off"
            placeholder="Shared secret…"
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value)
              setCopied(false)
            }}
          />
        </div>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Algorithm</legend>
          <div className="text-tool__mode-row">
            {HMAC_ALGORITHMS.map((algo) => (
              <button
                key={algo}
                type="button"
                className={`text-tool__mode${options.algorithm === algo ? ' is-on' : ''}`}
                onClick={() => patch({ algorithm: algo as HmacAlgorithm })}
              >
                HMAC-{algo}
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
              setMessage('')
              setSecret('')
              setCopied(false)
            }}
            disabled={!message && !secret}
          >
            Clear
          </button>
        </div>
      </div>

      {result?.ok ? (
        <>
          <p className="text-tool__hint">
            HMAC-{result.algorithm} · {result.bytes} bytes · UTF-8 message &amp;
            secret · stays on this device
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
          Sign with a secret using Web Crypto — nothing is uploaded.
        </p>
      )}
    </section>
  )
}
