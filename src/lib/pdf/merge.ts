import { PDFDocument } from 'pdf-lib'
import { loadPdfDocument } from './common'

/** One page taken from a source PDF (0-based page index). */
export type PageSource = {
  file: File
  pageIndex: number
}

/**
 * Merge whole PDF files in order (every page from each file).
 */
export async function mergePdfs(
  files: File[],
  onProgress?: (current: number, total: number) => void,
): Promise<Uint8Array> {
  if (!files.length) {
    throw new Error('Add at least one PDF to merge.')
  }

  const out = await PDFDocument.create()
  const total = files.length

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    onProgress?.(i + 1, total)
    const doc = await loadPdfDocument(file)
    const indices = doc.getPageIndices()
    const pages = await out.copyPages(doc, indices)
    for (const page of pages) {
      out.addPage(page)
    }
  }

  return out.save()
}

/**
 * Build a PDF from an ordered list of source pages (advanced arrange mode).
 * Loads each unique File once and copies pages by index.
 */
export async function mergePdfPages(
  sources: PageSource[],
  onProgress?: (current: number, total: number) => void,
): Promise<Uint8Array> {
  if (!sources.length) {
    throw new Error('Add at least one page to include in the merge.')
  }

  const out = await PDFDocument.create()
  const cache = new Map<File, Awaited<ReturnType<typeof loadPdfDocument>>>()
  const total = sources.length

  for (let i = 0; i < sources.length; i++) {
    const { file, pageIndex } = sources[i]
    onProgress?.(i + 1, total)

    let doc = cache.get(file)
    if (!doc) {
      doc = await loadPdfDocument(file)
      cache.set(file, doc)
    }

    const pageCount = doc.getPageCount()
    if (pageIndex < 0 || pageIndex >= pageCount) {
      throw new Error(
        `Page ${pageIndex + 1} is missing from “${file.name}” (${pageCount} pages).`,
      )
    }

    const [copied] = await out.copyPages(doc, [pageIndex])
    out.addPage(copied)
  }

  return out.save()
}
