import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

export type FeedbackKind = 'bug' | 'feature'

type Props = {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

const MIN_MESSAGE = 12
const MAX_MESSAGE = 4000

export function FeedbackDialog({ open, onClose }: Props) {
  const titleId = useId()
  const descId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [kind, setKind] = useState<FeedbackKind>('feature')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    setStatus('idle')
    setError('')
    const previous = document.activeElement as HTMLElement | null
    const t = window.setTimeout(() => closeRef.current?.focus(), 0)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = message.trim()
    if (trimmed.length < MIN_MESSAGE) {
      setStatus('error')
      setError('Please add a bit more detail.')
      return
    }
    if (trimmed.length > MAX_MESSAGE) {
      setStatus('error')
      setError('Message is too long.')
      return
    }

    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          kind,
          message: trimmed,
          website: honeypot,
        }),
      })

      const data = (await res.json().catch(() => ({}))) as { error?: string }

      if (!res.ok) {
        setStatus('error')
        setError(data.error || 'Could not send feedback. Try again later.')
        return
      }

      setStatus('sent')
      setMessage('')
      setKind('feature')
    } catch {
      setStatus('error')
      setError('Could not send feedback. Check your connection and try again.')
    }
  }

  const busy = status === 'sending'

  return (
    <div className="feedback-overlay" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        className="feedback-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-dialog__head">
          <div>
            <h2 id={titleId} className="feedback-dialog__title">
              Feedback
            </h2>
            <p id={descId} className="feedback-dialog__lede">
              Report a bug, request a feature, or just say hi to the team.
              Your note is emailed to us — PDF files stay on your device.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="feedback-dialog__close"
            onClick={onClose}
            aria-label="Close feedback form"
          >
            ×
          </button>
        </div>

        {status === 'sent' ? (
          <div className="feedback-dialog__success" role="status">
            <p className="feedback-dialog__success-title">Thanks — sent.</p>
            <p className="feedback-dialog__success-copy">
              We read every report. Close this and keep converting.
            </p>
            <button type="button" className="btn btn--primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="feedback-form" onSubmit={onSubmit} noValidate>
            <fieldset className="feedback-form__fieldset" disabled={busy}>
              <legend className="feedback-form__legend">Type</legend>
              <div className="feedback-form__kinds" role="radiogroup" aria-label="Feedback type">
                <label className={`feedback-kind ${kind === 'feature' ? 'feedback-kind--on' : ''}`}>
                  <input
                    type="radio"
                    name="kind"
                    value="feature"
                    checked={kind === 'feature'}
                    onChange={() => setKind('feature')}
                  />
                  Feature request
                </label>
                <label className={`feedback-kind ${kind === 'bug' ? 'feedback-kind--on' : ''}`}>
                  <input
                    type="radio"
                    name="kind"
                    value="bug"
                    checked={kind === 'bug'}
                    onChange={() => setKind('bug')}
                  />
                  Bug report
                </label>
              </div>
            </fieldset>

            <label className="feedback-form__message">
              <span className="feedback-form__label">What should we know?</span>
              <textarea
                className="feedback-form__textarea"
                name="message"
                rows={5}
                maxLength={MAX_MESSAGE}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  kind === 'bug'
                    ? 'What happened? What did you expect? Browser / device if relevant.'
                    : 'Describe the feature and how it would help your workflow.'
                }
                required
                disabled={busy}
              />
              <span className="feedback-form__count">
                {message.trim().length}/{MAX_MESSAGE}
              </span>
            </label>

            {/* Honeypot for bots — hidden from humans */}
            <label className="feedback-form__hp" aria-hidden="true">
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>

            {status === 'error' && error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}

            <div className="feedback-form__actions">
              <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary" disabled={busy}>
                {busy ? 'Sending…' : 'Send feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
