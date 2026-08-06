export type AppMode = 'images' | 'merge'

export type PageSize = 'fit' | 'a4' | 'letter'

export type ImageItem = {
  id: string
  file: File
  url: string
  name: string
}

export type PdfItem = {
  id: string
  file: File
  name: string
  pageCount: number | null
}

export type ModeMeta = {
  id: AppMode
  label: string
  tagline: string
  privacyIdle: string
  privacyReady: string
  stageTitle: string
  stageTitleReady: string
  stageHint: string
  stageHintReady: string
}

export const MODE_META: Record<AppMode, ModeMeta> = {
  images: {
    id: 'images',
    label: 'Images → PDF',
    tagline: 'Drop images. Get a PDF.',
    privacyIdle: 'Private by design — nothing leaves this device.',
    privacyReady: 'PDF is built locally in your browser. Your images are never uploaded.',
    stageTitle: 'Drop images here',
    stageTitleReady: 'Add more images',
    stageHint: 'or choose from your photos · JPG, PNG, WebP, GIF, HEIC',
    stageHintReady: 'or browse · JPG, PNG, WebP, GIF, HEIC',
  },
  merge: {
    id: 'merge',
    label: 'Merge PDFs',
    tagline: 'Combine PDFs. Stay local.',
    privacyIdle: 'Private by design — nothing leaves this device.',
    privacyReady: 'PDFs are merged locally in your browser. Files are never uploaded.',
    stageTitle: 'Drop PDFs here',
    stageTitleReady: 'Add more PDFs',
    stageHint: 'or browse · PDF files only · combine in order',
    stageHintReady: 'or browse · more PDF files',
  },
}

export const IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/jpg,image/heic,image/heif,.heic,.heif'

export const PDF_ACCEPT = 'application/pdf,.pdf'

export function parseAppMode(value: string | null | undefined): AppMode {
  return value === 'merge' ? 'merge' : 'images'
}
