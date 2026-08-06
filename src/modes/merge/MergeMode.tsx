import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
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

/** One page slot in advanced arrange mode. */
type ArrangePage = {
  id: string
  sourceId: string
  sourceName: string
  file: File
  pageIndex: number
  previewUrl: string | null
}

function buildDefaultSequence(items: PdfItem[]): ArrangePage[] {
  const pages: ArrangePage[] = []
  for (const item of items) {
    const count = item.pageCount ?? 0
    for (let i = 0; i < count; i++) {
      pages.push({
        id: createId(),
        sourceId: item.id,
        sourceName: item.name,
        file: item.file,
        pageIndex: i,
        previewUrl: null,
      })
    }
  }
  return pages
}

export function MergeMode({ onReadyChange }: MergeModeProps) {
  const dragIndex = useRef<number | null>(null)
  const arrangeDrag = useRef<number | null>(null)
  const meta = MODE_META.merge
  const previewGen = useRef(0)

  const [items, setItems] = useState<PdfItem[]>([])
  const [busy, setBusy] = useState(false)
  const [busyLabel, setBusyLabel] = useState('Merging…')
  const [error, setError] = useState<string | null>(null)
  const [advanced, setAdvanced] = useState(false)
  const [arrangePages, setArrangePages] = useState<ArrangePage[]>([])
  const [loadingPreviews, setLoadingPreviews] = useState(false)

  const ready = items.length > 0
  const totalPages = items.reduce((sum, item) => sum + (item.pageCount ?? 0), 0)
  const arrangedCount = arrangePages.length

  const reportReady = useCallback(
    (next: PdfItem[], arrangedLen?: number) => {
      const count = next.length
      if (count === 0) {
        onReadyChange?.(false, '')
        return
      }
      const pages =
        arrangedLen !== undefined
          ? arrangedLen
          : next.reduce((sum, item) => sum + (item.pageCount ?? 0), 0)
      onReadyChange?.(
        true,
        `${count} ${count === 1 ? 'file' : 'files'} · ${pages} ${pages === 1 ? 'page' : 'pages'} · private`,
      )
    },
    [onReadyChange],
  )

  useEffect(() => {
    return () => {
      previewGen.current += 1
    }
  }, [])

  const loadPreviews = useCallback(async (pages: ArrangePage[]) => {
    const gen = ++previewGen.current
    if (!pages.length) {
      setArrangePages([])
      setLoadingPreviews(false)
      return
    }

    setLoadingPreviews(true)
    setArrangePages(pages.map((p) => ({ ...p, previewUrl: null })))

    try {
      const { renderPageThumbnail } = await import('../../lib/pdf/thumbnails')
      const next = [...pages]
      for (let i = 0; i < next.length; i++) {
        if (gen !== previewGen.current) return
        try {
          const url = await renderPageThumbnail(next[i].file, next[i].pageIndex)
          next[i] = { ...next[i], previewUrl: url }
        } catch {
          next[i] = { ...next[i], previewUrl: null }
        }
        // Progressive update so UI feels responsive
        if (i % 2 === 1 || i === next.length - 1) {
          setArrangePages([...next])
        }
        setBusyLabel(`Loading previews… ${i + 1}/${next.length}`)
      }
      if (gen === previewGen.current) {
        setArrangePages([...next])
      }
    } finally {
      if (gen === previewGen.current) {
        setLoadingPreviews(false)
        setBusyLabel('Merging…')
      }
    }
  }, [])

  const enableAdvanced = useCallback(async () => {
    if (!items.length) return
    setError(null)
    setAdvanced(true)
    const sequence = buildDefaultSequence(items)
    reportReady(items, sequence.length)
    setBusy(true)
    setBusyLabel('Loading previews…')
    try {
      await loadPreviews(sequence)
    } catch (err) {
      console.error(err)
      setError(friendlyToolError(err, 'Could not load page previews.'))
    } finally {
      setBusy(false)
      setBusyLabel('Merging…')
    }
  }, [items, loadPreviews, reportReady])

  const disableAdvanced = () => {
    previewGen.current += 1
    setAdvanced(false)
    setArrangePages([])
    setLoadingPreviews(false)
    reportReady(items)
  }

  const resetArrangeOrder = async () => {
    if (!items.length) return
    setError(null)
    const sequence = buildDefaultSequence(items)
    reportReady(items, sequence.length)
    setBusy(true)
    setBusyLabel('Loading previews…')
    try {
      await loadPreviews(sequence)
    } finally {
      setBusy(false)
      setBusyLabel('Merging…')
    }
  }

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
          const { getPdfPageCount } = await import('../../lib/pdf/common')
          const pageCount = await getPdfPageCount(file)
          next.push({
            id: createId(),
            file,
            name: file.name,
            pageCount,
          })
        }

        const combined = [...items, ...next]
        setItems(combined)

        if (advanced) {
          // Append new pages to the arranged sequence
          const added = buildDefaultSequence(next)
          const mergedSequence = [...arrangePages, ...added]
          reportReady(combined, mergedSequence.length)
          setBusyLabel('Loading previews…')
          await loadPreviews(mergedSequence)
        } else {
          reportReady(combined)
        }
      } catch (err) {
        console.error(err)
        setError(friendlyToolError(err, 'Could not open one of those PDFs.'))
      } finally {
        setBusy(false)
        setBusyLabel('Merging…')
      }
    },
    [advanced, arrangePages, items, loadPreviews, reportReady],
  )

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id)
      if (advanced) {
        setArrangePages((pages) => {
          const filtered = pages.filter((p) => p.sourceId !== id)
          reportReady(next, filtered.length)
          return filtered
        })
      } else {
        reportReady(next)
      }
      if (next.length === 0) {
        setAdvanced(false)
        setArrangePages([])
      }
      return next
    })
  }

  const clearAll = () => {
    previewGen.current += 1
    setItems([])
    setArrangePages([])
    setAdvanced(false)
    setError(null)
    setLoadingPreviews(false)
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

  const onArrangeDragStart = (index: number) => {
    arrangeDrag.current = index
  }

  const onArrangeDrop = (index: number) => {
    const from = arrangeDrag.current
    arrangeDrag.current = null
    if (from === null || from === index) return
    setArrangePages((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      return next
    })
  }

  const moveArrangePage = useCallback((index: number, direction: -1 | 1) => {
    setArrangePages((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }, [])

  const removeArrangePage = (id: string) => {
    setArrangePages((prev) => {
      const next = prev.filter((p) => p.id !== id)
      reportReady(items, next.length)
      return next
    })
  }

  const generate = async () => {
    if (!items.length || busy) return
    if (advanced && arrangePages.length === 0) {
      setError('Include at least one page, or turn off page arrange.')
      return
    }

    setBusy(true)
    setBusyLabel('Merging…')
    setError(null)
    try {
      const { mergePdfs, mergePdfPages } = await import('../../lib/pdf/merge')
      let bytes: Uint8Array

      if (advanced) {
        bytes = await mergePdfPages(
          arrangePages.map((p) => ({
            file: p.file,
            pageIndex: p.pageIndex,
          })),
          (current, total) => {
            setBusyLabel(`Merging… ${current}/${total}`)
          },
        )
      } else {
        bytes = await mergePdfs(
          items.map((item) => item.file),
          (current, total) => {
            setBusyLabel(`Merging… ${current}/${total}`)
          },
        )
      }

      downloadPdf(bytes, `staypress-merged-${dateStamp()}.pdf`)
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
                {advanced
                  ? `${arrangedCount} ${arrangedCount === 1 ? 'page' : 'pages'} in order`
                  : `${items.length} ${items.length === 1 ? 'file' : 'files'}${
                      totalPages > 0
                        ? ` · ${totalPages} ${totalPages === 1 ? 'page' : 'pages'}`
                        : ''
                    }`}
              </p>
              <p className="toolbar__hint">
                {advanced
                  ? loadingPreviews
                    ? 'Loading page previews…'
                    : 'Drag pages to reorder · remove any page you don’t need'
                  : 'Drag files to reorder · open Arrange pages for fine control'}
              </p>
            </div>

            <div className="toolbar__controls">
              <button type="button" className="btn btn--ghost" onClick={clearAll}>
                Clear
              </button>
              <button
                type="button"
                className="btn btn--primary toolbar__download"
                onClick={generate}
                disabled={busy || (advanced ? arrangePages.length < 1 : items.length < 1)}
              >
                {busy && !loadingPreviews ? busyLabel : 'Download merged PDF'}
              </button>
            </div>
          </div>

          <div className="merge-advanced">
            <div className="merge-advanced__row">
              <div className="merge-advanced__copy">
                <p className="merge-advanced__title">Arrange pages</p>
                <p className="merge-advanced__desc">
                  Advanced: reorder or drop individual pages before download.
                </p>
              </div>
              <div className="merge-advanced__actions">
                {!advanced ? (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => void enableAdvanced()}
                    disabled={busy || totalPages === 0}
                  >
                    Open page arrange
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => void resetArrangeOrder()}
                      disabled={busy || loadingPreviews}
                    >
                      Reset order
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={disableAdvanced}
                      disabled={busy && loadingPreviews}
                    >
                      File order only
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {!advanced && (
            <ul className="grid">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="thumb"
                  style={{ '--i': index } as CSSProperties}
                  draggable={!busy}
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
                      disabled={index === 0 || busy}
                      onClick={() => moveItem(index, -1)}
                    >
                      <IconChevronLeft />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Move ${item.name} later`}
                      disabled={index === items.length - 1 || busy}
                      onClick={() => moveItem(index, 1)}
                    >
                      <IconChevronRight />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      aria-label={`Remove ${item.name}`}
                      disabled={busy}
                      onClick={() => removeItem(item.id)}
                    >
                      <IconRemove />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {advanced && (
            <ul className="grid merge-page-grid" aria-label="Page order">
              {arrangePages.map((page, index) => (
                <li
                  key={page.id}
                  className="thumb"
                  style={{ '--i': index } as CSSProperties}
                  draggable={!busy}
                  onDragStart={() => onArrangeDragStart(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onArrangeDrop(index)}
                >
                  <div className="thumb__page merge-page-thumb">
                    <span className="thumb__order">{index + 1}</span>
                    {page.previewUrl ? (
                      <img
                        src={page.previewUrl}
                        alt=""
                        className="thumb__image"
                        draggable={false}
                      />
                    ) : (
                      <div className="merge-page-thumb__placeholder" aria-hidden="true">
                        <IconDoc />
                      </div>
                    )}
                  </div>
                  <p className="thumb__name" title={`${page.sourceName} · p.${page.pageIndex + 1}`}>
                    {page.sourceName}
                  </p>
                  <p className="merge-page-source">Page {page.pageIndex + 1}</p>
                  <div className="thumb__actions">
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Move page ${index + 1} earlier`}
                      disabled={index === 0 || busy}
                      onClick={() => moveArrangePage(index, -1)}
                    >
                      <IconChevronLeft />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Move page ${index + 1} later`}
                      disabled={index === arrangePages.length - 1 || busy}
                      onClick={() => moveArrangePage(index, 1)}
                    >
                      <IconChevronRight />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      aria-label={`Remove page ${page.pageIndex + 1} of ${page.sourceName}`}
                      disabled={busy}
                      onClick={() => removeArrangePage(page.id)}
                    >
                      <IconRemove />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {advanced && arrangePages.length === 0 && !loadingPreviews && (
            <p className="merge-empty">
              No pages included. Reset order or add PDFs again.
            </p>
          )}
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
            {advanced
              ? `${arrangedCount} ${arrangedCount === 1 ? 'page' : 'pages'}`
              : `${items.length} ${items.length === 1 ? 'file' : 'files'}`}
          </p>
          <button
            type="button"
            className="btn btn--primary sticky-cta__btn"
            onClick={generate}
            disabled={busy || (advanced && arrangePages.length < 1)}
          >
            {busy && !loadingPreviews ? busyLabel : 'Merge PDF'}
          </button>
        </div>
      )}
    </>
  )
}
