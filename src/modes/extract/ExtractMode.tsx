import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { IconDoc, IconDownload, IconRemove } from '../../components/Icons'
import { Stage } from '../../components/Stage'
import { Viewer } from '../../components/Viewer'
import { dateStamp, downloadBlob, safeBaseName } from '../../lib/download'
import { friendlyToolError } from '../../lib/errors'
import { isPdfFile } from '../../lib/pdf/files'
import type { ExtractedPage } from '../../lib/pdf/extract'
import type { ImageFormat } from '../../types'
import { MODE_META, PDF_ACCEPT } from '../../types'

/** Soft warning threshold — still allowed, but we mention size. */
const WARN_PAGES = 40
const HARD_PAGE_CAP = 150

type ExtractModeProps = {
  onReadyChange?: (ready: boolean, status: string) => void
}

type LoadedPdf = {
  file: File
  name: string
  pageCount: number
}

export function ExtractMode({ onReadyChange }: ExtractModeProps) {
  const meta = MODE_META.extract

  const [pdf, setPdf] = useState<LoadedPdf | null>(null)
  const [format, setFormat] = useState<ImageFormat>('jpeg')
  const [quality, setQuality] = useState(0.9)
  const [busy, setBusy] = useState(false)
  const [busyLabel, setBusyLabel] = useState('Rendering pages…')
  const [packing, setPacking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pages, setPages] = useState<ExtractedPage[]>([])
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const ready = pdf !== null
  const canZip = pages.length > 1 && !busy

  const revokePages = useCallback((list: ExtractedPage[]) => {
    list.forEach((p) => URL.revokeObjectURL(p.previewUrl))
  }, [])

  const pagesRef = useRef<ExtractedPage[]>([])
  pagesRef.current = pages

  /** Bumps to cancel in-flight renders when settings change or a new file loads. */
  const renderGen = useRef(0)

  useEffect(() => {
    return () => {
      renderGen.current += 1
      pagesRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl))
    }
  }, [])

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

  const clearResult = useCallback(() => {
    setPages((prev) => {
      revokePages(prev)
      return []
    })
    setViewerIndex(null)
  }, [revokePages])

  const clearAll = () => {
    renderGen.current += 1
    clearResult()
    setPdf(null)
    setError(null)
    setBusy(false)
    setPacking(false)
    reportReady(null)
  }

  const renderPages = useCallback(
    async (
      loaded: LoadedPdf,
      opts: { format: ImageFormat; quality: number },
      largeDocWarning?: string | null,
    ) => {
      const gen = ++renderGen.current
      setBusy(true)
      setBusyLabel('Rendering pages…')
      setError(largeDocWarning ?? null)
      clearResult()

      try {
        const { extractPdfToImages } = await import('../../lib/pdf/extract')
        const extracted = await extractPdfToImages(loaded.file, {
          format: opts.format,
          quality: opts.quality,
          scale: 2,
          onProgress: (current, total) => {
            if (gen !== renderGen.current) return
            setBusyLabel(`Rendering… ${current}/${total}`)
          },
        })

        if (gen !== renderGen.current) {
          revokePages(extracted)
          return
        }

        setPages(extracted)
      } catch (err) {
        if (gen !== renderGen.current) return
        console.error(err)
        setError(friendlyToolError(err, 'Could not render images from that PDF.'))
        clearResult()
      } finally {
        if (gen === renderGen.current) {
          setBusy(false)
          setBusyLabel('Rendering pages…')
        }
      }
    },
    [clearResult, revokePages],
  )

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter(isPdfFile)
      if (!files.length) {
        setError('Please choose a PDF file.')
        return
      }
      if (files.length > 1) {
        setError('Choose one PDF at a time. Extract turns each page into an image.')
        return
      }

      const file = files[0]
      setError(null)
      setBusy(true)
      setBusyLabel('Reading PDF…')
      renderGen.current += 1
      clearResult()

      try {
        const { getPdfJsPageCount } = await import('../../lib/pdf/extract')
        const pageCount = await getPdfJsPageCount(file)
        if (pageCount > HARD_PAGE_CAP) {
          throw new Error(
            `This PDF has ${pageCount} pages — over the ${HARD_PAGE_CAP}-page limit for in-browser export. Try a shorter document.`,
          )
        }
        const next = { file, name: file.name, pageCount }
        setPdf(next)
        reportReady(next)

        const warning =
          pageCount > WARN_PAGES
            ? `Large document (${pageCount} pages). Rendering may take a while on phones.`
            : null

        await renderPages(next, { format, quality }, warning)
      } catch (err) {
        console.error(err)
        setPdf(null)
        reportReady(null)
        setBusy(false)
        setError(friendlyToolError(err, 'Could not open that PDF.'))
      }
    },
    [clearResult, format, quality, renderPages, reportReady],
  )

  const onFormatChange = (next: ImageFormat) => {
    setFormat(next)
    if (pdf) {
      void renderPages(pdf, { format: next, quality })
    }
  }

  const onQualityChange = (next: number) => {
    setQuality(next)
    if (pdf) {
      void renderPages(pdf, { format, quality: next })
    }
  }

  const downloadPage = (page: ExtractedPage) => {
    downloadBlob(page.blob, page.filename)
  }

  const downloadZip = async () => {
    if (!pdf || pages.length < 2 || busy || packing) return
    setPacking(true)
    setError(null)
    try {
      const { pagesToZipBlob } = await import('../../lib/pdf/extract')
      const zip = await pagesToZipBlob(pages)
      const base = safeBaseName(pdf.name)
      downloadBlob(zip, `${base}-pages-${dateStamp()}.zip`)
    } catch (err) {
      console.error(err)
      setError(friendlyToolError(err, 'Could not create the ZIP file.'))
    } finally {
      setPacking(false)
    }
  }

  const closeViewer = useCallback(() => setViewerIndex(null), [])

  const stepViewer = useCallback(
    (direction: -1 | 1) => {
      setViewerIndex((current) => {
        if (current === null || pages.length === 0) return current
        const next = current + direction
        if (next < 0 || next >= pages.length) return current
        return next
      })
    },
    [pages.length],
  )

  const viewing = viewerIndex !== null ? pages[viewerIndex] : null

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
            <rect
              x="18"
              y="28"
              width="12"
              height="10"
              rx="1"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M34 32h4M34 38h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        }
      />

      {ready && pdf && (
        <section className="workspace" aria-label="Extract results">
          <div className="toolbar">
            <div className="toolbar__meta">
              <p className="count">
                {busy
                  ? busyLabel
                  : pages.length > 0
                    ? `${pages.length} ${pages.length === 1 ? 'image' : 'images'} ready`
                    : `${pdf.pageCount} ${pdf.pageCount === 1 ? 'page' : 'pages'}`}
              </p>
              <p className="toolbar__hint" title={pdf.name}>
                {pdf.name}
              </p>
            </div>

            <div className="toolbar__controls">
              <label className="field">
                <span className="field__label">Format</span>
                <select
                  value={format}
                  onChange={(e) => onFormatChange(e.target.value as ImageFormat)}
                  className="field__select"
                  disabled={busy || packing}
                >
                  <option value="jpeg">JPG</option>
                  <option value="png">PNG</option>
                </select>
              </label>

              {format === 'jpeg' && (
                <label className="field">
                  <span className="field__label">Quality</span>
                  <select
                    value={String(quality)}
                    onChange={(e) => onQualityChange(Number(e.target.value))}
                    className="field__select"
                    disabled={busy || packing}
                  >
                    <option value="0.75">Smaller</option>
                    <option value="0.9">Balanced</option>
                    <option value="0.95">High</option>
                  </select>
                </label>
              )}

              <button type="button" className="btn btn--ghost" onClick={clearAll}>
                Clear
              </button>
              {pages.length > 1 && (
                <button
                  type="button"
                  className="btn btn--primary toolbar__download"
                  onClick={downloadZip}
                  disabled={!canZip || packing}
                >
                  {packing ? 'Packing ZIP…' : 'Download all (ZIP)'}
                </button>
              )}
            </div>
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
                {busy
                  ? 'Rendering pages locally…'
                  : pages.length > 0
                    ? `Ready as ${format === 'png' ? 'PNG' : 'JPG'} · download a page below${
                        pages.length > 1 ? ' or grab a ZIP of everything' : ''
                      }`
                    : 'Waiting for pages…'}
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

          {busy && pages.length === 0 && (
            <p className="extract-progress" aria-live="polite">
              {busyLabel}
            </p>
          )}

          {pages.length > 0 && (
            <>
              <p className="extract-preview-label">
                Pages · download one, or preview
              </p>
              <ul className="grid">
                {pages.map((page, index) => (
                  <li
                    key={`${page.pageNumber}-${page.filename}`}
                    className="thumb"
                    style={{ '--i': index } as CSSProperties}
                  >
                    <button
                      type="button"
                      className="thumb__page"
                      onClick={() => setViewerIndex(index)}
                      aria-label={`Preview page ${page.pageNumber}`}
                    >
                      <span className="thumb__order">{page.pageNumber}</span>
                      <img
                        src={page.previewUrl}
                        alt=""
                        className="thumb__image"
                        draggable={false}
                      />
                      <span className="thumb__expand" aria-hidden="true">
                        Expand
                      </span>
                    </button>
                    <p className="thumb__name" title={page.filename}>
                      {page.filename}
                    </p>
                    <div className="thumb__actions">
                      <button
                        type="button"
                        className="icon-btn icon-btn--primary"
                        aria-label={`Download page ${page.pageNumber}`}
                        onClick={() => downloadPage(page)}
                        disabled={busy || packing}
                      >
                        <IconDownload />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {ready && pdf && pages.length > 1 && (
        <div className="sticky-cta" role="region" aria-label="Download ZIP">
          <p className="sticky-cta__count">
            {pages.length} images
          </p>
          <button
            type="button"
            className="btn btn--primary sticky-cta__btn"
            onClick={downloadZip}
            disabled={!canZip || packing}
          >
            {packing ? 'Packing ZIP…' : 'Download ZIP'}
          </button>
        </div>
      )}

      {viewing && viewerIndex !== null && (
        <>
          <Viewer
            name={viewing.filename}
            url={viewing.previewUrl}
            index={viewerIndex}
            total={pages.length}
            onClose={closeViewer}
            onStep={stepViewer}
          />
          <button
            type="button"
            className="btn btn--primary viewer__download"
            onClick={() => downloadPage(viewing)}
          >
            Download this page
          </button>
        </>
      )}
    </>
  )
}
