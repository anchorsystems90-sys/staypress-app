import type { AppMode } from './types'

/** PDF-family tools. Keep this aligned with `AppMode` in types.ts. */
export type ToolFamily = 'pdf' | 'words'

export type NonPdfToolId = 'word-unscrambler'

/** All first-class tools. `AppMode` remains the four PDF tools only. */
export type ToolId = AppMode | NonPdfToolId

export const PDF_TOOL_IDS: readonly AppMode[] = [
  'images',
  'merge',
  'extract',
  'slim',
]

export function isPdfTool(id: ToolId): id is AppMode {
  return (
    id === 'images' || id === 'merge' || id === 'extract' || id === 'slim'
  )
}

export const TOOL_FAMILIES: readonly { id: ToolFamily; label: string }[] = [
  { id: 'pdf', label: 'Files / PDF' },
  { id: 'words', label: 'Words' },
]

export type ToolDirectoryEntry = {
  id: ToolId
  family: ToolFamily
  label: string
  blurb: string
}

/** Directory metadata in display order. Paths live in seoData (`pathForMode`). */
export const TOOLS: readonly ToolDirectoryEntry[] = [
  {
    id: 'images',
    family: 'pdf',
    label: 'Images → PDF',
    blurb: 'Turn photos into a PDF on this device.',
  },
  {
    id: 'merge',
    family: 'pdf',
    label: 'Merge PDF',
    blurb: 'Combine PDFs locally, in order.',
  },
  {
    id: 'extract',
    family: 'pdf',
    label: 'PDF → Images',
    blurb: 'Export each page as a JPG or PNG.',
  },
  {
    id: 'slim',
    family: 'pdf',
    label: 'Slim PDF',
    blurb: 'Rebuild a smaller file without uploading.',
  },
  {
    id: 'word-unscrambler',
    family: 'words',
    label: 'Word Unscrambler',
    blurb: 'Find words from a jumble of letters.',
  },
]

export const WORD_UNSCRAMBLER_META = {
  id: 'word-unscrambler' as const,
  family: 'words' as const,
  label: 'Word Unscrambler',
  tagline: 'Unscramble letters. Find words.',
  privacyIdle: 'Runs in your browser. Letters never leave this device.',
}
