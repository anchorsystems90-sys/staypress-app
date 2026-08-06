/** Longest edge (px) when embedding images in a PDF — caps memory on phones. */
export const MAX_IMAGE_EDGE = 3000

export function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  return (
    type === 'image/heic' ||
    type === 'image/heif' ||
    type.includes('heic') ||
    type.includes('heif') ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  )
}

export function isImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true
  return isHeicFile(file)
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default
  const result = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.92,
  })
  const blob = Array.isArray(result) ? result[0] : result
  if (!(blob instanceof Blob)) {
    throw new Error('HEIC conversion failed')
  }
  const base = file.name.replace(/\.(heic|heif)$/i, '') || 'photo'
  return new File([blob], `${base}.jpg`, { type: 'image/jpeg' })
}

/**
 * Normalize an input image for preview + PDF use.
 * HEIC files are converted to JPEG so the browser can display and embed them.
 */
export async function normalizeImageFile(file: File): Promise<File> {
  if (isHeicFile(file)) {
    return convertHeicToJpeg(file)
  }
  return file
}

function scaleDown(width: number, height: number, maxEdge: number) {
  const edge = Math.max(width, height)
  if (edge <= maxEdge) return { width, height, scale: 1 }
  const scale = maxEdge / edge
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    scale,
  }
}

/**
 * Rasterize a file to JPEG bytes, optionally capping the longest edge.
 * Used for WebP/GIF and oversized JPEG/PNG so pdf-lib stays happy on mobile.
 */
export async function rasterizeToJpeg(
  file: File,
  maxEdge = MAX_IMAGE_EDGE,
): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file)
  try {
    const { width, height } = scaleDown(bitmap.width, bitmap.height, maxEdge)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not prepare image for PDF')
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Image conversion failed'))),
        'image/jpeg',
        0.9,
      )
    })
    return new Uint8Array(await blob.arrayBuffer())
  } finally {
    bitmap.close()
  }
}

export async function maybeDownscaleJpegPng(
  file: File,
  maxEdge = MAX_IMAGE_EDGE,
): Promise<{ bytes: Uint8Array; kind: 'jpg' | 'png' } | null> {
  const type = file.type.toLowerCase()
  const isJpg =
    type === 'image/jpeg' ||
    type === 'image/jpg' ||
    type.includes('jpeg') ||
    type.includes('jpg')
  const isPng = type === 'image/png' || type.includes('png')
  if (!isJpg && !isPng) return null

  const bitmap = await createImageBitmap(file)
  try {
    if (Math.max(bitmap.width, bitmap.height) <= maxEdge) {
      return null
    }
    const { width, height } = scaleDown(bitmap.width, bitmap.height, maxEdge)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not prepare image for PDF')
    ctx.drawImage(bitmap, 0, 0, width, height)

    if (isJpg) {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Image conversion failed'))),
          'image/jpeg',
          0.9,
        )
      })
      return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: 'jpg' }
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Image conversion failed'))),
        'image/png',
      )
    })
    return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: 'png' }
  } finally {
    bitmap.close()
  }
}
