import { useCallback, useState } from 'react'
import { IconDoc, IconRemove } from '../../components/Icons'
import { Stage } from '../../components/Stage'
import { trackToolUsed } from '../../lib/analytics'
import { dateStamp, downloadPdf, safeBaseName } from '../../lib/download'
import { friendlyToolError } from '../../lib/errors'
import { formatBytes } from '../../lib/format'
import { isPdfFile } from '../../lib/pdf/files'
import type { SlimPreset } from '../../types'
import { MODE_META, PDF_ACCEPT } from '../../types'

const HARD_PAGE_CAP = 100
const WARN_PAGES = 30

type CompressModeProps = {
  onReadyChange?: (ready: boolean, status: string) => void
}

type LoadedPdf = {
  file: File
  name: string
  pageCount: number
  bytes: number
}

type SlimOutcome = {
  bytes: Uint8Array
  originalBytes: number
  slimBytes: number
  savedRatio: number
  preset: SlimPreset
}

const PRESET_COPY: Record<
  SlimPreset,
  { label: string; detail: string }
> = {
  repack: {
    label: 'Rebuild lightly',
    detail: 'Rewrite with object streams. Keeps vectors/text; size gain is often small.',
  },
  balanced: {
    label: 'Balanced',
    detail: 'Pages rebuilt as medium-quality images. Good size drop; text may soften.',
  },
  small: {
    label: 'Smaller file',
    detail: 'Stronger image rebuild. Smallest file; noticeable quality loss on text.',
  },
}

export function CompressMode({ onReadyChange }: CompressModeProps) {
  const meta = MODE_META.slim

  const [pdf, setPdf] = useState<LoadedPdf | null>(null)
  const [preset, setPreset] = useState<SlimPreset>('balanced')
  const [busy, setBusy] = useState(false)
  const [busyLabel, setBusyLabel] = useState('Slimming…')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [outcome, setOutcome] = useState<SlimOutcome | null>(null)

  const ready = pdf !== null

  const reportReady = useCallback(
    (next: LoadedPdf | null) => {
      if (!next) {
        onReadyChange?.(false, '')
        return
      }
      onReadyChange?.(
        true,
        `1 file · ${next.pageCount} ${next.pageCount === 1 ? 'page' : 'pages'} · private`,
      )
    },
    [onReadyChange],
  )

  const clearAll = () => {
    setPdf(null)
    setOutcome(null)
    setError(null)
    setNotice(null)
    setBusy(false)
    reportReady(null)
  }

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter(isPdfFile)
      if (!files.length) {
        setError('Please choose a PDF file.')
        return
      }
      if (files.length > 1) {
        setError('Choose one PDF at a time for Slim PDF.')
        return
      }

      const file = files[0]
      setError(null)
      setNotice(null)
      setOutcome(null)
      setBusy(true)
      setBusyLabel('Reading PDF…')

      try {
        const { getPdfPageCount } = await import('../../lib/pdf/common')
        const pageCount = await getPdfPageCount(file)
        if (pageCount > HARD_PAGE_CAP) {
          throw new Error(
            `This PDF has ${pageCount} pages — over the ${HARD_PAGE_CAP}-page limit for in-browser slim. Try a shorter document.`,
          )
        }
        const next: LoadedPdf = {
          file,
          name: file.name,
          pageCount,
          bytes: file.size,
        }
        setPdf(next)
        reportReady(next)
        if (pageCount > WARN_PAGES) {
          setNotice(
            `Large document (${pageCount} pages). Balanced / Smaller may take a while on phones.`,
          )
        }
      } catch (err) {
        console.error(err)
        setPdf(null)
        reportReady(null)
        setError(friendlyToolError(err, 'Could not open that PDF.'))
      } finally {
        setBusy(false)
        setBusyLabel('Slimming…')
      }
    },
    [reportReady],
  )

  const runSlim = async () => {
    if (!pdf || busy) return
    setBusy(true)
    setBusyLabel('Slimming…')
    setError(null)
    setNotice(null)
    setOutcome(null)

    try {
      const { slimPdf } = await import('../../lib/pdf/compress')
      const result = await slimPdf(pdf.file, {
        preset,
        onProgress: (current, total) => {
          if (total <= 0) return
          setBusyLabel(
            preset === 'repack'
              ? `Rebuilding… ${current}/${total}`
              : `Rendering… ${current}/${total}`,
          )
        },
      })

      setOutcome({
        bytes: result.bytes,
        originalBytes: result.originalBytes,
        slimBytes: result.slimBytes,
        savedRatio: result.savedRatio,
        preset: result.preset,
      })

      if (result.savedRatio <= 0.02) {
        setNotice(
          result.savedRatio <= 0
            ? `The rebuilt file is about the same size or larger (${formatBytes(result.slimBytes)} vs ${formatBytes(result.originalBytes)}). Try Balanced/Smaller, or the file may already be compact.`
            : `Only a small reduction (${Math.round(result.savedRatio * 100)}%). Light rebuild often can’t shrink already-optimized PDFs much.`,
        )
      } else {
        setNotice(
          `Reduced by about ${Math.round(result.savedRatio * 100)}% (${formatBytes(result.originalBytes)} → ${formatBytes(result.slimBytes)}).`,
        )
      }
    } catch (err) {
      console.error(err)
      setError(friendlyToolError(err, 'Could not slim that PDF. Try again.'))
    } finally {
      setBusy(false)
      setBusyLabel('Slimming…')
    }
  }

  const downloadSlim = () => {
    if (!pdf || !outcome) return
    const base = safeBaseName(pdf.name)
    downloadPdf(outcome.bytes, `${base}-staypress-slim-${dateStamp()}.pdf`)
    trackToolUsed('slim', {
      detail: outcome.preset,
      pages: pdf.pageCount,
    })
  }

  return (
    <>
      <Stage
        accept={PDF_ACCEPT}
        multiple={false}
        compact={ready}
        title={ready ? meta.stageTitleReady : meta.stageTitle}
        hint={ready ? meta.stageHintReady : meta.stageHint}
        onFiles={addFiles}
        icon={
          <svg viewBox="0 0 56 56" fill="none">
            <path
              d="M16 12h16l10 10v22a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M32 12v10h10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M20 38c4-8 12-8 16 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M22 30h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        }
      />

      {ready && pdf && (
        <section className="workspace" aria-label="Slim PDF">
          <div className="toolbar">
            <div className="toolbar__meta">
              <p className="count">
                {pdf.pageCount} {pdf.pageCount === 1 ? 'page' : 'pages'}
              </p>
              <p className="toolbar__hint" title={pdf.name}>
                {pdf.name}
              </p>
            </div>
          </div>

          <div className="slim-disclaimer">
            <p className="slim-disclaimer__title">Honest expectations</p>
            <p className="slim-disclaimer__text">
              This rebuilds the PDF in your browser. “Balanced” and “Smaller”
              redraw pages as images for savings — not Adobe-class compression.
              Text-heavy documents may look softer.
            </p>
          </div>

          <div className="extract-source">
            <div className="thumb__page pdf-thumb extract-source__icon" aria-hidden="true">
              <IconDoc />
              <span className="pdf-thumb__pages">
                {pdf.pageCount} {pdf.pageCount === 1 ? 'page' : 'pages'}
              </span>
            </div>
            <div className="extract-source__meta">
              <p className="extract-source__name" title={pdf.name}>
                {pdf.name}
              </p>
              <p className="extract-source__detail">
                Original size · {formatBytes(pdf.bytes)}
              </p>
            </div>
            <button
              type="button"
              className="icon-btn icon-btn--danger extract-source__remove"
              aria-label={`Remove ${pdf.name}`}
              onClick={clearAll}
            >
              <IconRemove />
            </button>
          </div>

          <fieldset className="slim-presets" disabled={busy}>
            <legend className="slim-presets__legend">How aggressive?</legend>
            {(Object.keys(PRESET_COPY) as SlimPreset[]).map((id) => {
              const copy = PRESET_COPY[id]
              return (
                <label
                  key={id}
                  className={`slim-preset ${preset === id ? 'slim-preset--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="slim-preset"
                    value={id}
                    checked={preset === id}
                    onChange={() => {
                      setPreset(id)
                      setOutcome(null)
                      setNotice(null)
                    }}
                  />
                  <span className="slim-preset__body">
                    <span className="slim-preset__label">{copy.label}</span>
                    <span className="slim-preset__detail">{copy.detail}</span>
                  </span>
                </label>
              )
            })}
          </fieldset>

          {outcome && (
            <div className="slim-result" aria-live="polite">
              <div className="slim-result__row">
                <span className="slim-result__label">Before</span>
                <span className="slim-result__value">
                  {formatBytes(outcome.originalBytes)}
                </span>
              </div>
              <div className="slim-result__row">
                <span className="slim-result__label">After</span>
                <span className="slim-result__value">
                  {formatBytes(outcome.slimBytes)}
                </span>
              </div>
              <div className="slim-result__row slim-result__row--emphasis">
                <span className="slim-result__label">Change</span>
                <span
                  className={`slim-result__value ${
                    outcome.savedRatio > 0.02
                      ? 'slim-result__value--good'
                      : 'slim-result__value--flat'
                  }`}
                >
                  {outcome.savedRatio > 0
                    ? `−${Math.round(outcome.savedRatio * 100)}%`
                    : outcome.savedRatio < 0
                      ? `+${Math.round(Math.abs(outcome.savedRatio) * 100)}%`
                      : '≈ 0%'}
                </span>
              </div>
            </div>
          )}

          <div className="slim-actions">
            <button type="button" className="btn btn--ghost" onClick={clearAll} disabled={busy}>
              Clear
            </button>
            {!outcome ? (
              <button
                type="button"
                className="btn btn--primary slim-actions__primary"
                onClick={runSlim}
                disabled={busy}
              >
                {busy ? busyLabel : 'Slim PDF'}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn--ghost slim-actions__primary"
                  onClick={runSlim}
                  disabled={busy}
                >
                  {busy ? busyLabel : 'Run again'}
                </button>
                <button
                  type="button"
                  className="btn btn--primary slim-actions__primary"
                  onClick={downloadSlim}
                  disabled={busy}
                >
                  Download slim PDF
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {notice && !error && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {ready && pdf && (
        <div className="sticky-cta" role="region" aria-label="Slim actions">
          <p className="sticky-cta__count">
            {outcome
              ? outcome.savedRatio > 0
                ? `−${Math.round(outcome.savedRatio * 100)}%`
                : 'Ready'
              : `${pdf.pageCount} ${pdf.pageCount === 1 ? 'page' : 'pages'}`}
          </p>
          <button
            type="button"
            className="btn btn--primary sticky-cta__btn"
            onClick={outcome ? downloadSlim : runSlim}
            disabled={busy}
          >
            {busy
              ? busyLabel
              : outcome
                ? 'Download slim'
                : 'Slim PDF'}
          </button>
        </div>
      )}
    </>
  )
}
