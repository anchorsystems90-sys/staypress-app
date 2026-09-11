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

export const WORD_UNSCRAMBLER_META = {
  id: 'word-unscrambler' as const,
  family: 'words' as const,
  label: 'Word Unscrambler',
  tagline: 'Unscramble letters. Find words.',
  privacyIdle: 'Runs in your browser. Letters never leave this device.',
}
