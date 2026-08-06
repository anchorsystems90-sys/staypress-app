import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import type { ImageItem, PageSize } from './types'
import './App.css'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/jpg'

function IconChevronLeft() {
  return (
    <svg className="icon-btn__svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M12.25 4.75 7 10l5.25 5.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg className="icon-btn__svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.75 4.75 13 10l-5.25 5.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconRemove() {
  return (
    <svg className="icon-btn__svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function App() {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragIndex = useRef<number | null>(null)

  const [images, setImages] = useState<ImageItem[]>([])
  const [pageSize, setPageSize] = useState<PageSize>('fit')
  const [draggingOver, setDraggingOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const ready = images.length > 0

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!files.length) {
      setError('Please choose image files (JPG, PNG, WebP, or GIF).')
      return
    }
    setError(null)
    const next: ImageItem[] = files.map((file) => ({
      id: createId(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    setImages((prev) => [...prev, ...next])
  }, [])

  const removeImage = (id: string) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id)
      const target = prev[index]
      if (target) URL.revokeObjectURL(target.url)
      const next = prev.filter((img) => img.id !== id)

      setViewerIndex((current) => {
        if (current === null) return null
        if (next.length === 0) return null
        if (index < 0) return current
        if (current > index) return current - 1
        if (current === index) return Math.min(index, next.length - 1)
        return current
      })

      return next
    })
  }

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url))
    setImages([])
    setViewerIndex(null)
    setError(null)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDraggingOver(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  const onThumbDragStart = (index: number) => {
    dragIndex.current = index
  }

  const onThumbDrop = (index: number) => {
    const from = dragIndex.current
    dragIndex.current = null
    if (from === null || from === index) return
    setImages((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      return next
    })
    setViewerIndex((current) => {
      if (current === null) return null
      if (current === from) return index
      if (from < current && index >= current) return current - 1
      if (from > current && index <= current) return current + 1
      return current
    })
  }

  const moveImage = useCallback((index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev

      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]

      setViewerIndex((current) => {
        if (current === null) return null
        if (current === index) return target
        if (current === target) return index
        return current
      })

      return next
    })
  }, [])

  const closeViewer = useCallback(() => setViewerIndex(null), [])

  const stepViewer = useCallback(
    (direction: -1 | 1) => {
      setViewerIndex((current) => {
        if (current === null || images.length === 0) return current
        const next = current + direction
        if (next < 0 || next >= images.length) return current
        return next
      })
    },
    [images.length],
  )

  useEffect(() => {
    if (viewerIndex === null) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeViewer()
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        stepViewer(-1)
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        stepViewer(1)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [viewerIndex, closeViewer, stepViewer])

  const generate = async () => {
    if (!images.length || busy) return
    setBusy(true)
    setError(null)
    try {
      const { downloadPdf, imagesToPdf } = await import('./lib/pdf')
      const bytes = await imagesToPdf(images, pageSize)
      const stamp = new Date().toISOString().slice(0, 10)
      downloadPdf(bytes, `imprint-${stamp}.pdf`)
    } catch (err) {
      console.error(err)
      const message =
        err instanceof Error ? err.message : 'Could not create the PDF. Try again.'
      const isMemory =
        /memory|quota|allocation|too large|canvas/i.test(message) ||
        (err instanceof DOMException && err.name === 'QuotaExceededError')
      setError(
        isMemory
          ? 'That batch is too large for this device. Try fewer or smaller images.'
          : message,
      )
    } finally {
      setBusy(false)
    }
  }

  const viewing = viewerIndex !== null ? images[viewerIndex] : null

  return (
    <div className={`app ${ready ? 'app--ready' : 'app--idle'}`}>
      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere__wash" />
        <div className="atmosphere__grain" />
      </div>

      <header className="header">
        <p className="brand">Imprint</p>
        {!ready && (
          <>
            <p className="tagline">Drop images. Get a PDF.</p>
            <p className="privacy">Private by design — nothing leaves this device.</p>
          </>
        )}
        {ready && (
          <p className="header__status">
            <span className="header__status-dot" aria-hidden="true" />
            {images.length} {images.length === 1 ? 'page' : 'pages'} · private
          </p>
        )}
      </header>

      <main className="main">
        <section
          className={[
            'stage',
            draggingOver ? 'stage--active' : '',
            ready ? 'stage--compact' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onDragOver={(e) => {
            e.preventDefault()
            setDraggingOver(true)
          }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={onDrop}
        >
          {!ready && (
            <div className="sheets" aria-hidden="true">
              <span className="sheet sheet--a" />
              <span className="sheet sheet--b" />
              <span className="sheet sheet--c" />
            </div>
          )}

          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <label htmlFor={inputId} className="stage__label">
            <span className="stage__icon" aria-hidden="true">
              <svg viewBox="0 0 56 56" fill="none">
                <path
                  d="M18 16h14l8 8v22a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V18a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M32 16v8h8" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M28 26v12m0-12-4 4m4-4 4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="stage__title">
              {ready ? 'Add more images' : 'Drop images here'}
            </span>
            <span className="stage__hint">
              {ready
                ? 'or browse · JPG, PNG, WebP, GIF'
                : 'or choose from your photos · JPG, PNG, WebP, GIF'}
            </span>
          </label>
        </section>

        {ready && (
          <section className="workspace" aria-label="Image queue">
            <div className="toolbar">
              <div className="toolbar__meta">
                <p className="count">
                  {images.length} {images.length === 1 ? 'page' : 'pages'}
                </p>
                <p className="toolbar__hint">Drag to reorder · tap to preview</p>
              </div>

              <div className="toolbar__controls">
                <label className="field">
                  <span className="field__label">Page size</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as PageSize)}
                    className="field__select"
                  >
                    <option value="fit">Fit image</option>
                    <option value="a4">A4</option>
                    <option value="letter">US Letter</option>
                  </select>
                </label>

                <button type="button" className="btn btn--ghost" onClick={clearAll}>
                  Clear
                </button>
                <button
                  type="button"
                  className="btn btn--primary toolbar__download"
                  onClick={generate}
                  disabled={busy}
                >
                  {busy ? 'Making PDF…' : 'Download PDF'}
                </button>
              </div>
            </div>

            <ul className="grid">
              {images.map((img, index) => (
                <li
                  key={img.id}
                  className="thumb"
                  style={{ '--i': index } as CSSProperties}
                  draggable
                  onDragStart={() => onThumbDragStart(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onThumbDrop(index)}
                >
                  <button
                    type="button"
                    className="thumb__page"
                    onClick={() => setViewerIndex(index)}
                    aria-label={`View ${img.name} full screen, page ${index + 1}`}
                  >
                    <span className="thumb__order">{index + 1}</span>
                    <img src={img.url} alt="" className="thumb__image" draggable={false} />
                    <span className="thumb__expand" aria-hidden="true">
                      Expand
                    </span>
                  </button>
                  <p className="thumb__name" title={img.name}>
                    {img.name}
                  </p>
                  <div className="thumb__actions">
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Move ${img.name} earlier`}
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                    >
                      <IconChevronLeft />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Move ${img.name} later`}
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                    >
                      <IconChevronRight />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      aria-label={`Remove ${img.name}`}
                      onClick={() => removeImage(img.id)}
                    >
                      <IconRemove />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </main>

      {ready && (
        <div className="sticky-cta" role="region" aria-label="Download actions">
          <p className="sticky-cta__count">
            {images.length} {images.length === 1 ? 'page' : 'pages'}
          </p>
          <button
            type="button"
            className="btn btn--primary sticky-cta__btn"
            onClick={generate}
            disabled={busy}
          >
            {busy ? 'Making PDF…' : 'Download PDF'}
          </button>
        </div>
      )}

      <footer className="footer">
        <p className="footer__privacy">
          {ready
            ? 'PDF is built locally in your browser. Your images are never uploaded.'
            : 'No account. No upload. The PDF is written on this device.'}
        </p>
        <p className="footer__maker">
          <span className="footer__maker-label">A free tool from</span>{' '}
          <a
            className="footer__maker-link"
            href="https://anchorsystems.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anchor Systems
          </a>
          <span className="footer__maker-sep" aria-hidden="true">
            ·
          </span>
          <a
            className="footer__cta"
            href="https://anchorsystems.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Technology delivery that ships
            <span className="footer__cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </p>
      </footer>

      {viewing && viewerIndex !== null && (
        <div
          className="viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${viewing.name}, page ${viewerIndex + 1} of ${images.length}`}
          onClick={closeViewer}
        >
          <button
            type="button"
            className="viewer__close"
            aria-label="Close preview"
            onClick={(e) => {
              e.stopPropagation()
              closeViewer()
            }}
          >
            Close
          </button>

          <p className="viewer__counter" aria-live="polite">
            {viewerIndex + 1} / {images.length}
          </p>

          <button
            type="button"
            className="viewer__nav viewer__nav--prev"
            aria-label="Previous image"
            disabled={viewerIndex === 0}
            onClick={(e) => {
              e.stopPropagation()
              stepViewer(-1)
            }}
          >
            ‹
          </button>

          <img
            key={viewing.id}
            src={viewing.url}
            alt={viewing.name}
            className="viewer__image"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="viewer__nav viewer__nav--next"
            aria-label="Next image"
            disabled={viewerIndex === images.length - 1}
            onClick={(e) => {
              e.stopPropagation()
              stepViewer(1)
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
