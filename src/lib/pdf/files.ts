export function isPdfFile(file: File): boolean {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  return type === 'application/pdf' || type === 'application/x-pdf' || name.endsWith('.pdf')
}
