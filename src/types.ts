export type AppMode = 'images' | 'merge' | 'extract' | 'slim'

export type PageSize = 'fit' | 'a4' | 'letter'

export type ImageFormat = 'jpeg' | 'png'

/** How aggressively to rebuild a PDF for a smaller file. */
export type SlimPreset = 'repack' | 'balanced' | 'small'

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
  extract: {
    id: 'extract',
    label: 'PDF → images',
    tagline: 'PDF pages to images.',
    privacyIdle: 'Private by design — nothing leaves this device.',
    privacyReady:
      'Pages are rendered locally in your browser. Your PDF is never uploaded.',
    stageTitle: 'Drop a PDF here',
    stageTitleReady: 'Choose a different PDF',
    stageHint: 'or browse · each page becomes an image',
    stageHintReady: 'or browse · replace with another PDF',
  },
  slim: {
    id: 'slim',
    label: 'Slim PDF',
    tagline: 'Rebuild smaller. Stay honest.',
    privacyIdle: 'Private by design — nothing leaves this device.',
    privacyReady:
      'Your PDF is rebuilt locally in the browser. Nothing is uploaded for compression.',
    stageTitle: 'Drop a PDF here',
    stageTitleReady: 'Choose a different PDF',
    stageHint: 'or browse · rebuild for a smaller file',
    stageHintReady: 'or browse · replace with another PDF',
  },
}

export const IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/jpg,image/heic,image/heif,.heic,.heif'

export const PDF_ACCEPT = 'application/pdf,.pdf'

export function parseAppMode(value: string | null | undefined): AppMode {
  if (value === 'merge' || value === 'extract' || value === 'slim') return value
  return 'images'
}
