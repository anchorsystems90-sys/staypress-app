import { useCallback, useRef, useState, type CSSProperties } from 'react'
import { IconChevronLeft, IconChevronRight, IconRemove } from '../../components/Icons'
import { Stage } from '../../components/Stage'
import { Viewer } from '../../components/Viewer'
import { dateStamp, downloadPdf } from '../../lib/download'
import { friendlyToolError } from '../../lib/errors'
import { createId } from '../../lib/id'
import { isImageFile, normalizeImageFile } from '../../lib/images'
import type { ImageItem, PageSize } from '../../types'
import { IMAGE_ACCEPT, MODE_META } from '../../types'

type ImagesModeProps = {
  onReadyChange?: (ready: boolean, status: string) => void
}

export function ImagesMode({ onReadyChange }: ImagesModeProps) {
  const dragIndex = useRef<number | null>(null)
  const meta = MODE_META.images

  const [images, setImages] = useState<ImageItem[]>([])
  const [pageSize, setPageSize] = useState<PageSize>('fit')
  const [busy, setBusy] = useState(false)
  const [busyLabel, setBusyLabel] = useState('Making PDF…')
  const [error, setError] = useState<string | null>(null)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const ready = images.length > 0

  const reportReady = useCallback(
    (next: ImageItem[]) => {
      const count = next.length
      onReadyChange?.(
        count > 0,
        count === 0
          ? ''
          : `${count} ${count === 1 ? 'page' : 'pages'} · private`,
      )
    },
    [onReadyChange],
  )

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter(isImageFile)
      if (!files.length) {
        setError('Please choose image files (JPG, PNG, WebP, GIF, or HEIC).')
        return
      }

      setError(null)
      setBusy(true)
      setBusyLabel('Preparing images…')

      try {
        const next: ImageItem[] = []
        for (const raw of files) {
          const file = await normalizeImageFile(raw)
          next.push({
            id: createId(),
            file,
            url: URL.createObjectURL(file),
            name: raw.name,
          })
        }
        setImages((prev) => {
          const combined = [...prev, ...next]
          reportReady(combined)
          return combined
        })
      } catch (err) {
        console.error(err)
        setError(friendlyToolError(err, 'Could not open one of those images.'))
      } finally {
        setBusy(false)
        setBusyLabel('Making PDF…')
      }
    },
    [reportReady],
  )

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

      reportReady(next)
      return next
    })
  }

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url))
    setImages([])
    setViewerIndex(null)
    setError(null)
    reportReady([])
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

  const generate = async () => {
    if (!images.length || busy) return
    setBusy(true)
    setBusyLabel('Making PDF…')
    setError(null)
    try {
      const { imagesToPdf } = await import('../../lib/pdf/imagesToPdf')
      const bytes = await imagesToPdf(images, pageSize, (current, total) => {
        setBusyLabel(`Making PDF… ${current}/${total}`)
      })
      downloadPdf(bytes, `imprint-${dateStamp()}.pdf`)
    } catch (err) {
      console.error(err)
      setError(friendlyToolError(err, 'Could not create the PDF. Try again.'))
    } finally {
      setBusy(false)
      setBusyLabel('Making PDF…')
    }
  }

  const viewing = viewerIndex !== null ? images[viewerIndex] : null

  return (
    <>
      <Stage
        accept={IMAGE_ACCEPT}
        compact={ready}
        title={ready ? meta.stageTitleReady : meta.stageTitle}
        hint={ready ? meta.stageHintReady : meta.stageHint}
        onFiles={addFiles}
      />

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
                {busy ? busyLabel : 'Download PDF'}
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
            {busy ? busyLabel : 'Download PDF'}
          </button>
        </div>
      )}

      {viewing && viewerIndex !== null && (
        <Viewer
          name={viewing.name}
          url={viewing.url}
          index={viewerIndex}
          total={images.length}
          onClose={closeViewer}
          onStep={stepViewer}
        />
      )}
    </>
  )
}
