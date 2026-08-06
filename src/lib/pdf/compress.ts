import type { SlimPreset } from '../../types'
import { loadPdfDocument } from './common'

export type SlimOptions = {
  preset: SlimPreset
  onProgress?: (current: number, total: number) => void
}

export type SlimResult = {
  bytes: Uint8Array
  originalBytes: number
  slimBytes: number
  pageCount: number
  preset: SlimPreset
  /** Fraction saved (can be negative if file grew) */
  savedRatio: number
}

const PRESET_OPTS: Record<
  Exclude<SlimPreset, 'repack'>,
  { scale: number; quality: number; maxEdge: number }
> = {
  balanced: { scale: 1.4, quality: 0.72, maxEdge: 1600 },
  small: { scale: 1.05, quality: 0.55, maxEdge: 1200 },
}

async function loadPdfJs(file: File) {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()

  const data = new Uint8Array(await file.arrayBuffer())
  try {
    return await getDocument({ data, useSystemFonts: true }).promise
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

async function canvasToJpeg(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Could not compress page'))),
      'image/jpeg',
      quality,
    )
  })
  return new Uint8Array(await blob.arrayBuffer())
}

/**
 * Lossless-ish rebuild: copy pages and write with object streams.
 * Honest expectation: often only a small gain unless the PDF was poorly packed.
 */
async function repackPdf(
  file: File,
  onProgress?: (current: number, total: number) => void,
): Promise<{ bytes: Uint8Array; pageCount: number }> {
  const { PDFDocument } = await import('pdf-lib')
  const src = await loadPdfDocument(file)
  const pageCount = src.getPageCount()
  const out = await PDFDocument.create()
  onProgress?.(0, pageCount)

  const indices = src.getPageIndices()
  const copied = await out.copyPages(src, indices)
  for (let i = 0; i < copied.length; i++) {
    out.addPage(copied[i])
    onProgress?.(i + 1, pageCount)
  }

  const bytes = await out.save({ useObjectStreams: true })
  return { bytes, pageCount }
}

/**
 * Rebuild by rendering each page and embedding a JPEG (quality/size tradeoff).
 * Not magic compression — pages become images of the original layout.
 */
async function rasterRebuildPdf(
  file: File,
  preset: 'balanced' | 'small',
  onProgress?: (current: number, total: number) => void,
): Promise<{ bytes: Uint8Array; pageCount: number }> {
  const { PDFDocument } = await import('pdf-lib')
  const { scale, quality, maxEdge } = PRESET_OPTS[preset]
  const doc = await loadPdfJs(file)
  const pageCount = doc.numPages
  const out = await PDFDocument.create()

  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      onProgress?.(pageNumber, pageCount)
      const page = await doc.getPage(pageNumber)
      let viewport = page.getViewport({ scale })
      const edge = Math.max(viewport.width, viewport.height)
      if (edge > maxEdge) {
        viewport = page.getViewport({ scale: scale * (maxEdge / edge) })
      }

      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.floor(viewport.width))
      canvas.height = Math.max(1, Math.floor(viewport.height))
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        page.cleanup()
        throw new Error('Could not prepare page for slim rebuild')
      }

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      await page.render({ canvasContext: ctx, viewport }).promise

      const jpeg = await canvasToJpeg(canvas, quality)
      canvas.width = 0
      canvas.height = 0
      page.cleanup()

      const image = await out.embedJpg(jpeg)
      const pdfPage = out.addPage([image.width, image.height])
      pdfPage.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      })
    }
  } finally {
    await doc.destroy()
  }

  const bytes = await out.save({ useObjectStreams: true })
  return { bytes, pageCount }
}

export async function slimPdf(
  file: File,
  options: SlimOptions,
): Promise<SlimResult> {
  const originalBytes = file.size
  const onProgress = options.onProgress

  const { bytes, pageCount } =
    options.preset === 'repack'
      ? await repackPdf(file, onProgress)
      : await rasterRebuildPdf(file, options.preset, onProgress)

  const slimBytes = bytes.byteLength
  const savedRatio =
    originalBytes > 0 ? (originalBytes - slimBytes) / originalBytes : 0

  return {
    bytes,
    originalBytes,
    slimBytes,
    pageCount,
    preset: options.preset,
    savedRatio,
  }
}
