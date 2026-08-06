import { useCallback, useRef, useState, type CSSProperties } from 'react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconDoc,
  IconRemove,
} from '../../components/Icons'
import { Stage } from '../../components/Stage'
import { dateStamp, downloadPdf } from '../../lib/download'
import { friendlyToolError } from '../../lib/errors'
import { createId } from '../../lib/id'
import { isPdfFile } from '../../lib/pdf/files'
import type { PdfItem } from '../../types'
import { MODE_META, PDF_ACCEPT } from '../../types'

type MergeModeProps = {
  onReadyChange?: (ready: boolean, status: string) => void
}

export function MergeMode({ onReadyChange }: MergeModeProps) {
  const dragIndex = useRef<number | null>(null)
  const meta = MODE_META.merge

  const [items, setItems] = useState<PdfItem[]>([])
  const [busy, setBusy] = useState(false)
  const [busyLabel, setBusyLabel] = useState('Merging…')
  const [error, setError] = useState<string | null>(null)

  const ready = items.length > 0
  const totalPages = items.reduce((sum, item) => sum + (item.pageCount ?? 0), 0)

  const reportReady = useCallback(
    (next: PdfItem[]) => {
      const count = next.length
      if (count === 0) {
        onReadyChange?.(false, '')
        return
      }
      const pages = next.reduce((sum, item) => sum + (item.pageCount ?? 0), 0)
      onReadyChange?.(
        true,
        `${count} ${count === 1 ? 'file' : 'files'} · ${pages} ${pages === 1 ? 'page' : 'pages'} · private`,
      )
    },
    [onReadyChange],
  )

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter(isPdfFile)
      if (!files.length) {
        setError('Please choose PDF files.')
        return
      }

      setError(null)
      setBusy(true)
      setBusyLabel('Reading PDFs…')

      try {
        const next: PdfItem[] = []
        for (const file of files) {
          let pageCount: number | null = null
          try {
            const { getPdfPageCount } = await import('../../lib/pdf/common')
            pageCount = await getPdfPageCount(file)
          } catch (err) {
            throw err
          }
          next.push({
            id: createId(),
            file,
            name: file.name,
            pageCount,
          })
        }
        setItems((prev) => {
          const combined = [...prev, ...next]
          reportReady(combined)
          return combined
        })
      } catch (err) {
        console.error(err)
        setError(friendlyToolError(err, 'Could not open one of those PDFs.'))
      } finally {
        setBusy(false)
        setBusyLabel('Merging…')
      }
    },
    [reportReady],
  )

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id)
      reportReady(next)
      return next
    })
  }

  const clearAll = () => {
    setItems([])
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
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      return next
    })
  }

  const moveItem = useCallback((index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }, [])

  const generate = async () => {
    if (!items.length || busy) return
    setBusy(true)
    setBusyLabel('Merging…')
    setError(null)
    try {
      const { mergePdfs } = await import('../../lib/pdf/merge')
      const bytes = await mergePdfs(
        items.map((item) => item.file),
        (current, total) => {
          setBusyLabel(`Merging… ${current}/${total}`)
        },
      )
      downloadPdf(bytes, `imprint-merged-${dateStamp()}.pdf`)
    } catch (err) {
      console.error(err)
      setError(friendlyToolError(err, 'Could not merge those PDFs. Try again.'))
    } finally {
      setBusy(false)
      setBusyLabel('Merging…')
    }
  }

  return (
    <>
      <Stage
        accept={PDF_ACCEPT}
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
              d="M20 30h16M20 36h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        }
      />

      {ready && (
        <section className="workspace" aria-label="PDF queue">
          <div className="toolbar">
            <div className="toolbar__meta">
              <p className="count">
                {items.length} {items.length === 1 ? 'file' : 'files'}
                {totalPages > 0
                  ? ` · ${totalPages} ${totalPages === 1 ? 'page' : 'pages'}`
                  : ''}
              </p>
              <p className="toolbar__hint">Drag to reorder · merge keeps page order</p>
            </div>

            <div className="toolbar__controls">
              <button type="button" className="btn btn--ghost" onClick={clearAll}>
                Clear
              </button>
              <button
                type="button"
                className="btn btn--primary toolbar__download"
                onClick={generate}
                disabled={busy || items.length < 1}
              >
                {busy ? busyLabel : 'Download merged PDF'}
              </button>
            </div>
          </div>

          <ul className="grid">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="thumb"
                style={{ '--i': index } as CSSProperties}
                draggable
                onDragStart={() => onThumbDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onThumbDrop(index)}
              >
                <div className="thumb__page pdf-thumb" aria-hidden="true">
                  <span className="thumb__order">{index + 1}</span>
                  <IconDoc />
                  {item.pageCount !== null && (
                    <span className="pdf-thumb__pages">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                    </span>
                  )}
                </div>
                <p className="thumb__name" title={item.name}>
                  {item.name}
                </p>
                <div className="thumb__actions">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Move ${item.name} earlier`}
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                  >
                    <IconChevronLeft />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Move ${item.name} later`}
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 1)}
                  >
                    <IconChevronRight />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.id)}
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
            {items.length} {items.length === 1 ? 'file' : 'files'}
          </p>
          <button
            type="button"
            className="btn btn--primary sticky-cta__btn"
            onClick={generate}
            disabled={busy}
          >
            {busy ? busyLabel : 'Merge PDF'}
          </button>
        </div>
      )}
    </>
  )
}
