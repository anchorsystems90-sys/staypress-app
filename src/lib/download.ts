export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadBytes(
  bytes: Uint8Array,
  filename: string,
  mimeType: string,
) {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  const blob = new Blob([copy.buffer], { type: mimeType })
  downloadBlob(blob, filename)
}

export function downloadPdf(bytes: Uint8Array, filename = 'document.pdf') {
  downloadBytes(bytes, filename, 'application/pdf')
}

export function dateStamp() {
  return new Date().toISOString().slice(0, 10)
}

export function safeBaseName(filename: string) {
  const base = filename.replace(/\.[^.]+$/, '').trim() || 'document'
  return base.replace(/[^\w.\-()+\s]/g, '_').slice(0, 80)
}
