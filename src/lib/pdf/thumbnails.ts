import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist'

let workerReady = false

function ensureWorker() {
  if (workerReady) return
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
  workerReady = true
}

const docCache = new WeakMap<File, Promise<PDFDocumentProxy>>()

async function getDoc(file: File): Promise<PDFDocumentProxy> {
  ensureWorker()
  let pending = docCache.get(file)
  if (!pending) {
    pending = (async () => {
      const data = new Uint8Array(await file.arrayBuffer())
      return getDocument({ data, useSystemFonts: true }).promise
    })()
    docCache.set(file, pending)
  }
  return pending
}

/**
 * Render one PDF page to a JPEG data URL for arrangement thumbnails.
 * Small scale keeps memory low in advanced merge UI.
 */
export async function renderPageThumbnail(
  file: File,
  pageIndex: number,
  scale = 0.45,
): Promise<string> {
  const doc = await getDoc(file)
  const pageNumber = pageIndex + 1
  if (pageNumber < 1 || pageNumber > doc.numPages) {
    throw new Error(`Page ${pageNumber} is out of range.`)
  }

  const page = await doc.getPage(pageNumber)
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.floor(viewport.width))
  canvas.height = Math.max(1, Math.floor(viewport.height))
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    page.cleanup()
    throw new Error('Could not render page preview')
  }

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  await page.render({
    canvasContext: ctx,
    viewport,
  }).promise

  const url = canvas.toDataURL('image/jpeg', 0.72)
  canvas.width = 0
  canvas.height = 0
  page.cleanup()
  return url
}

export async function preloadThumbnails(
  pages: { file: File; pageIndex: number }[],
  onProgress?: (current: number, total: number) => void,
): Promise<string[]> {
  const urls: string[] = []
  const total = pages.length
  for (let i = 0; i < pages.length; i++) {
    onProgress?.(i + 1, total)
    urls.push(await renderPageThumbnail(pages[i].file, pages[i].pageIndex))
  }
  return urls
}
