import type { AppMode } from './types'

/** PDF-family tools. Keep this aligned with `AppMode` in types.ts. */
export type ToolFamily = 'pdf' | 'words' | 'text' | 'developer'

export type NonPdfToolId =
  | 'word-unscrambler'
  | 'text-cleaner'
  | 'case-converter'
  | 'json-formatter'

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

export function isStandaloneTool(id: ToolId): id is NonPdfToolId {
  return !isPdfTool(id)
}

export const TOOL_FAMILIES: readonly { id: ToolFamily; label: string }[] = [
  { id: 'pdf', label: 'Files / PDF' },
  { id: 'words', label: 'Words' },
  { id: 'text', label: 'Text' },
  { id: 'developer', label: 'Developer' },
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
  {
    id: 'text-cleaner',
    family: 'text',
    label: 'Text Cleaner',
    blurb: 'Trim, collapse, and tidy messy text.',
  },
  {
    id: 'case-converter',
    family: 'text',
    label: 'Case Converter',
    blurb: 'Switch case styles without uploading.',
  },
  {
    id: 'json-formatter',
    family: 'developer',
    label: 'JSON Formatter',
    blurb: 'Pretty-print, minify, and check JSON.',
  },
]

export type StandaloneMeta = {
  tagline: string
  privacyIdle: string
}

export const STANDALONE_META: Record<NonPdfToolId, StandaloneMeta> = {
  'word-unscrambler': {
    tagline: 'Unscramble letters. Find words.',
    privacyIdle: 'Runs in your browser. Letters never leave this device.',
  },
  'text-cleaner': {
    tagline: 'Paste messy text. Get a clean copy.',
    privacyIdle: 'Runs in your browser. Text never leaves this device.',
  },
  'case-converter': {
    tagline: 'Change case. Stay local.',
    privacyIdle: 'Runs in your browser. Text never leaves this device.',
  },
  'json-formatter': {
    tagline: 'Format JSON on this device.',
    privacyIdle: 'Runs in your browser. JSON never leaves this device.',
  },
}

/** Other tools in the same family — used for static related-tool links. */
export function relatedTools(id: ToolId): readonly ToolDirectoryEntry[] {
  const current = TOOLS.find((tool) => tool.id === id)
  if (!current) return []
  return TOOLS.filter((tool) => tool.family === current.family && tool.id !== id)
}

export const WORD_UNSCRAMBLER_META = {
  id: 'word-unscrambler' as const,
  family: 'words' as const,
  label: 'Word Unscrambler',
  ...STANDALONE_META['word-unscrambler'],
}
