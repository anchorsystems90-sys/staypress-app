import { useEffect, useMemo, useState } from 'react'
import { trackToolUsed } from '../../lib/analytics'
import {
  DEFAULT_OTP_OPTIONS,
  computeTotp,
  generateOtpSecret,
  type OtpOptions,
  type TotpCodeResult,
} from './generate'

export default function OtpSecret() {
  const [options, setOptions] = useState<OtpOptions>(DEFAULT_OTP_OPTIONS)
  const [nonce, setNonce] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [totp, setTotp] = useState<TotpCodeResult | null>(null)

  const secretBundle = useMemo(() => {
    void nonce
    return generateOtpSecret(options)
  }, [options, nonce])

  useEffect(() => {
    let cancelled = false
    const tick = async () => {
      const next = await computeTotp(secretBundle.secret, options)
      if (!cancelled) setTotp(next)
    }
    void tick()
    const id = window.setInterval(() => void tick(), 1000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [secretBundle.secret, options])

  const patch = (partial: Partial<OtpOptions>) => {
    setOptions((current) => ({ ...current, ...partial }))
    setCopied(null)
  }

  const regenerate = () => {
    setNonce((value) => value + 1)
    setCopied(null)
    trackToolUsed('otp-secret', { detail: 'generate' })
  }

  const copyOne = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      trackToolUsed('otp-secret', { detail: `copy-${key}` })
      window.setTimeout(() => {
        setCopied((current) => (current === key ? null : current))
      }, 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <section className="text-tool" aria-label="OTP Secret">
      <div className="text-tool__panel">
        <label className="text-tool__field">
          <span className="text-tool__label">Issuer</span>
          <input
            className="text-tool__input"
            type="text"
            value={options.issuer}
            onChange={(e) => patch({ issuer: e.target.value })}
          />
        </label>

        <label className="text-tool__field">
          <span className="text-tool__label">Account</span>
          <input
            className="text-tool__input"
            type="text"
            spellCheck={false}
            value={options.account}
            onChange={(e) => patch({ account: e.target.value })}
          />
        </label>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Digits</legend>
          <div className="text-tool__mode-row">
            {([6, 8] as const).map((digits) => (
              <button
                key={digits}
                type="button"
                className={`text-tool__mode${options.digits === digits ? ' is-on' : ''}`}
                onClick={() => patch({ digits })}
              >
                {digits}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Period (seconds)</legend>
          <div className="text-tool__mode-row">
            {([30, 60] as const).map((period) => (
              <button
                key={period}
                type="button"
                className={`text-tool__mode${options.period === period ? ' is-on' : ''}`}
                onClick={() => patch({ period })}
              >
                {period}s
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="text-tool__modes">
          <legend className="text-tool__label">Algorithm</legend>
          <div className="text-tool__mode-row">
            {(['SHA-1', 'SHA-256', 'SHA-512'] as const).map((algorithm) => (
              <button
                key={algorithm}
                type="button"
                className={`text-tool__mode${options.algorithm === algorithm ? ' is-on' : ''}`}
                onClick={() => patch({ algorithm })}
              >
                {algorithm}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="text-tool__actions text-tool__actions--inline">
          <button type="button" className="btn btn--primary" onClick={regenerate}>
            New secret
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => void copyOne(secretBundle.secret, 'secret')}
          >
            {copied === 'secret' ? 'Copied' : 'Copy secret'}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => void copyOne(secretBundle.otpauthUrl, 'uri')}
          >
            {copied === 'uri' ? 'Copied' : 'Copy otpauth URI'}
          </button>
        </div>
      </div>

      <p className="text-tool__hint">
        Base32 secret + otpauth URI for authenticator apps. Generated locally —
        nothing is uploaded or stored.
      </p>

      <ul className="text-tool__password-list">
        <li className="text-tool__password-row">
          <div className="text-tool__password-meta">
            <span className="text-tool__stat-label">Secret</span>
            <code className="text-tool__password">{secretBundle.secret}</code>
          </div>
        </li>
        <li className="text-tool__password-row">
          <div className="text-tool__password-meta">
            <span className="text-tool__stat-label">otpauth URI</span>
            <code className="text-tool__password">{secretBundle.otpauthUrl}</code>
          </div>
        </li>
        <li className="text-tool__password-row">
          <div className="text-tool__password-meta">
            <span className="text-tool__stat-label">
              Current code
              {totp?.ok ? ` · ${totp.remaining}s left` : ''}
            </span>
            <code className="text-tool__password text-tool__password--code">
              {totp?.ok ? totp.code : totp?.error ?? '…'}
            </code>
          </div>
          {totp?.ok && (
            <button
              type="button"
              className="btn btn--ghost text-tool__mini"
              onClick={() => void copyOne(totp.code, 'code')}
            >
              {copied === 'code' ? 'Copied' : 'Copy'}
            </button>
          )}
        </li>
      </ul>
    </section>
  )
}
