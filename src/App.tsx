import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { downloadPdf, imagesToPdf } from './lib/pdf'
import type { ImageItem, PageSize } from './types'
import './App.css'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/jpg'

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
      const bytes = await imagesToPdf(images, pageSize)
      const stamp = new Date().toISOString().slice(0, 10)
      downloadPdf(bytes, `imprint-${stamp}.pdf`)
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error ? err.message : 'Could not create the PDF. Try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  const viewing = viewerIndex !== null ? images[viewerIndex] : null

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />

      <header className="header">
        <p className="brand">Imprint</p>
        <p className="tagline">Drop images. Get a PDF.</p>
      </header>

      <main className="main">
        <section
          className={`dropzone ${draggingOver ? 'dropzone--active' : ''} ${images.length ? 'dropzone--compact' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDraggingOver(true)
          }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={onDrop}
        >
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
          <label htmlFor={inputId} className="dropzone__label">
            <span className="dropzone__icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="28" height="28" rx="2" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="8" width="28" height="28" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.45" />
                <path d="M22 26v-8m0 0l-3.5 3.5M22 18l3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="dropzone__title">
              {images.length ? 'Add more images' : 'Drop images here'}
            </span>
            <span className="dropzone__hint">or click to browse · JPG, PNG, WebP, GIF</span>
          </label>
        </section>

        {images.length > 0 && (
          <section className="workspace" aria-label="Image queue">
            <div className="toolbar">
              <p className="count">
                {images.length} {images.length === 1 ? 'page' : 'pages'}
              </p>

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
                  className="btn btn--primary"
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
                      ←
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Move ${img.name} later`}
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                    >
                      →
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      aria-label={`Remove ${img.name}`}
                      onClick={() => removeImage(img.id)}
                    >
                      ×
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

      <footer className="footer">
        <p>Images stay on your device — nothing is uploaded to a server.</p>
      </footer>

      {viewing && viewerIndex !== null && (
        <div
          className="viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${viewing.name}, page ${viewerIndex + 1} of ${images.length}`}
          onClick={closeViewer}
        >
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
