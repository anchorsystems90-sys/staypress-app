import { PDFDocument } from 'pdf-lib'

export async function loadPdfDocument(file: File) {
  const bytes = await file.arrayBuffer()
  try {
    return await PDFDocument.load(bytes)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (/password|encrypted|Encryption/i.test(message)) {
      throw new Error(
        `“${file.name}” is password-protected. Remove the password and try again.`,
      )
    }
    throw new Error(`“${file.name}” doesn’t look like a valid PDF.`)
  }
}

export async function getPdfPageCount(file: File): Promise<number> {
  const doc = await loadPdfDocument(file)
  return doc.getPageCount()
}

