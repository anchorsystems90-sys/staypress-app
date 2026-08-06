import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist'
import type { ImageFormat } from '../../types'

let workerReady = false

function ensureWorker() {
  if (workerReady) return
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
  workerReady = true
}

export type ExtractOptions = {
  format: ImageFormat
  /** JPEG quality 0–1 (ignored for PNG) */
  quality?: number
  /** Render scale (1 = 72dpi-ish, 2 = sharper) */
  scale?: number
  onProgress?: (current: number, total: number) => void
}

export type ExtractedPage = {
  pageNumber: number
  filename: string
  blob: Blob
  /** object URL for optional preview — caller should revoke */
  previewUrl: string
}

function baseName(file: File) {
  return file.name.replace(/\.[^.]+$/, '') || 'document'
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number,
): Promise<Blob> {
  const mime = format === 'png' ? 'image/png' : 'image/jpeg'
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not export page image'))),
      mime,
      format === 'jpeg' ? quality : undefined,
    )
  })
}

export async function loadPdfJsDocument(file: File): Promise<PDFDocumentProxy> {
  ensureWorker()
  const data = new Uint8Array(await file.arrayBuffer())
  try {
    const loadingTask = getDocument({ data, useSystemFonts: true })
    return await loadingTask.promise
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (/password|encrypted/i.test(message)) {
      throw new Error(
        `“${file.name}” is password-protected. Remove the password and try again.`,
      )
    }
    throw new Error(`“${file.name}” doesn’t look like a valid PDF.`)
  }
}

export async function getPdfJsPageCount(file: File): Promise<number> {
  const doc = await loadPdfJsDocument(file)
  try {
    return doc.numPages
  } finally {
    await doc.destroy()
  }
}

/**
 * Render each PDF page to an image blob.
 * Sequential rendering keeps peak memory lower on mobile.
 */
export async function extractPdfToImages(
  file: File,
  options: ExtractOptions,
): Promise<ExtractedPage[]> {
  const format = options.format
  const quality = options.quality ?? 0.92
  const scale = options.scale ?? 2
  const ext = format === 'png' ? 'png' : 'jpg'
  const stem = baseName(file)

  const doc = await loadPdfJsDocument(file)
  const total = doc.numPages
  const pages: ExtractedPage[] = []

  try {
    for (let pageNumber = 1; pageNumber <= total; pageNumber++) {
      options.onProgress?.(pageNumber, total)
      const page = await doc.getPage(pageNumber)
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      const ctx = canvas.getContext('2d', { alpha: format === 'png' })
      if (!ctx) {
        page.cleanup()
        throw new Error('Could not prepare page for export')
      }

      // White background for JPEG (no transparency)
      if (format === 'jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise

      const blob = await canvasToBlob(canvas, format, quality)
      // free canvas memory
      canvas.width = 0
      canvas.height = 0
      page.cleanup()

      pages.push({
        pageNumber,
        filename: `${stem}-page-${String(pageNumber).padStart(3, '0')}.${ext}`,
        blob,
        previewUrl: URL.createObjectURL(blob),
      })
    }
  } finally {
    await doc.destroy()
  }

  return pages
}

export async function pagesToZipBlob(
  pages: { filename: string; blob: Blob }[],
): Promise<Blob> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  for (const page of pages) {
    zip.file(page.filename, page.blob)
  }
  return zip.generateAsync({ type: 'blob' })
}
