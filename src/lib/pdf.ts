import { PDFDocument, PageSizes } from 'pdf-lib'
import type { ImageItem, PageSize } from '../types'

async function embedImage(pdf: PDFDocument, file: File) {
  const bytes = await file.arrayBuffer()
  const type = file.type.toLowerCase()

  if (type === 'image/png' || type.includes('png')) {
    return pdf.embedPng(bytes)
  }
  if (
    type === 'image/jpeg' ||
    type === 'image/jpg' ||
    type.includes('jpeg') ||
    type.includes('jpg')
  ) {
    return pdf.embedJpg(bytes)
  }

  // Convert webp/gif/other formats via canvas
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not prepare image for PDF')
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Image conversion failed'))),
      'image/png',
    )
  })
  return pdf.embedPng(await blob.arrayBuffer())
}

function pageDimensions(size: PageSize, imgW: number, imgH: number) {
  if (size === 'a4') return PageSizes.A4
  if (size === 'letter') return PageSizes.Letter
  return [imgW, imgH] as [number, number]
}

export async function imagesToPdf(
  images: ImageItem[],
  pageSize: PageSize,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()

  for (const item of images) {
    const image = await embedImage(pdf, item.file)
    const [pageW, pageH] = pageDimensions(pageSize, image.width, image.height)
    const page = pdf.addPage([pageW, pageH])

    const scale = Math.min(pageW / image.width, pageH / image.height)
    const drawW = image.width * scale
    const drawH = image.height * scale
    const x = (pageW - drawW) / 2
    const y = (pageH - drawH) / 2

    page.drawImage(image, { x, y, width: drawW, height: drawH })
  }

  return pdf.save()
}

export function downloadPdf(bytes: Uint8Array, filename = 'images.pdf') {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  const blob = new Blob([copy], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
