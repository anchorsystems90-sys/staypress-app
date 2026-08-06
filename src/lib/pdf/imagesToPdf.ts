import { PDFDocument, PageSizes } from 'pdf-lib'
import { maybeDownscaleJpegPng, rasterizeToJpeg } from '../images'
import type { ImageItem, PageSize } from '../../types'

async function embedImage(pdf: PDFDocument, file: File) {
  const type = file.type.toLowerCase()
  const isJpg =
    type === 'image/jpeg' ||
    type === 'image/jpg' ||
    type.includes('jpeg') ||
    type.includes('jpg')
  const isPng = type === 'image/png' || type.includes('png')

  if (isJpg || isPng) {
    const scaled = await maybeDownscaleJpegPng(file)
    if (scaled) {
      return scaled.kind === 'jpg'
        ? pdf.embedJpg(scaled.bytes)
        : pdf.embedPng(scaled.bytes)
    }
    const bytes = await file.arrayBuffer()
    return isJpg ? pdf.embedJpg(bytes) : pdf.embedPng(bytes)
  }

  // WebP, GIF, and anything else: rasterize (with max edge) to JPEG
  const jpeg = await rasterizeToJpeg(file)
  return pdf.embedJpg(jpeg)
}

function pageDimensions(size: PageSize, imgW: number, imgH: number) {
  if (size === 'a4') return PageSizes.A4
  if (size === 'letter') return PageSizes.Letter
  return [imgW, imgH] as [number, number]
}

export async function imagesToPdf(
  images: ImageItem[],
  pageSize: PageSize,
  onProgress?: (current: number, total: number) => void,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const total = images.length

  for (let i = 0; i < images.length; i++) {
    const item = images[i]
    onProgress?.(i + 1, total)
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
