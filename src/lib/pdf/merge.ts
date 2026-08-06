import { PDFDocument } from 'pdf-lib'
import { loadPdfDocument } from './common'

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
