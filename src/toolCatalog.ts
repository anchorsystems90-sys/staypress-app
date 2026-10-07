import type { AppMode } from './types'

/** PDF-family tools. Keep this aligned with `AppMode` in types.ts. */
export type ToolFamily = 'pdf' | 'words' | 'text' | 'developer' | 'data'

export type NonPdfToolId =
  | 'word-unscrambler'
  | 'text-cleaner'
  | 'case-converter'
  | 'json-formatter'
  | 'base64'
  | 'url-encode'
  | 'csv-column-extractor'
  | 'csv-to-json'
  | 'json-to-csv'

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
  { id: 'data', label: 'Data' },
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
    blurb: 'Convert each PDF page to a JPG or PNG.',
  },
  {
    id: 'slim',
    family: 'pdf',
    label: 'Slim PDF',
    blurb: 'Compress a PDF in your browser — no upload.',
  },
  {
    id: 'word-unscrambler',
    family: 'words',
    label: 'Word Unscrambler',
    blurb: 'Unscramble letters, with optional ? blanks and filters.',
  },
  {
    id: 'text-cleaner',
    family: 'text',
    label: 'Text Cleaner',
    blurb: 'Trim, join lines, strip HTML, and tidy text.',
  },
  {
    id: 'case-converter',
    family: 'text',
    label: 'Case Converter',
    blurb: 'Switch case and copy camel/snake/kebab styles.',
  },
  {
    id: 'json-formatter',
    family: 'developer',
    label: 'JSON Formatter',
    blurb: 'Pretty-print, minify, and validate JSON locally.',
  },
  {
    id: 'base64',
    family: 'developer',
    label: 'Base64',
    blurb: 'Encode or decode Base64 text on this device.',
  },
  {
    id: 'url-encode',
    family: 'developer',
    label: 'URL Encode',
    blurb: 'Encode or decode URL and query-string text.',
  },
  {
    id: 'csv-column-extractor',
    family: 'data',
    label: 'CSV Column Extractor',
    blurb: 'Pick columns from a CSV and export only those.',
  },
  {
    id: 'csv-to-json',
    family: 'data',
    label: 'CSV → JSON',
    blurb: 'Turn a CSV into JSON objects or arrays.',
  },
  {
    id: 'json-to-csv',
    family: 'data',
    label: 'JSON → CSV',
    blurb: 'Turn a JSON array into a downloadable CSV.',
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
  base64: {
    tagline: 'Encode. Decode. Stay local.',
    privacyIdle: 'Runs in your browser. Your text never leaves this device.',
  },
  'url-encode': {
    tagline: 'Percent-encode. Decode. Stay local.',
    privacyIdle: 'Runs in your browser. Your text never leaves this device.',
  },
  'csv-column-extractor': {
    tagline: 'Keep the columns you need.',
    privacyIdle: 'Runs in your browser. Your CSV never leaves this device.',
  },
  'csv-to-json': {
    tagline: 'CSV in. JSON out.',
    privacyIdle: 'Runs in your browser. Your CSV never leaves this device.',
  },
  'json-to-csv': {
    tagline: 'JSON in. CSV out.',
    privacyIdle: 'Runs in your browser. Your JSON never leaves this device.',
  },
}

/** Preferred sibling order for PDF-family related links. */
const PDF_RELATED_ORDER: Record<AppMode, readonly AppMode[]> = {
  images: ['extract', 'merge', 'slim'],
  extract: ['images', 'slim', 'merge'],
  slim: ['extract', 'images', 'merge'],
  merge: ['extract', 'images', 'slim'],
}

/** Short contextual notes for PDF topic-cluster links. */
const PDF_RELATED_NOTES: Partial<
  Record<AppMode, Partial<Record<AppMode, string>>>
> = {
  images: {
    extract: 'Export PDF pages back to JPG or PNG.',
  },
  extract: {
    images: 'Need the reverse? Build a PDF from images.',
    slim: 'Shrink a heavy PDF before or after exporting pages.',
  },
  slim: {
    extract: 'Or convert PDF pages to JPG or PNG instead.',
    images: 'Build a PDF from photos, then compress it here.',
  },
  merge: {
    extract: 'Export pages from the merged file as images.',
  },
}

/** Short contextual notes for text-family related links. */
const TEXT_RELATED_NOTES: Partial<
  Record<NonPdfToolId, Partial<Record<NonPdfToolId, string>>>
> = {
  'text-cleaner': {
    'case-converter': 'Need a different case after cleaning? Switch styles next.',
  },
  'case-converter': {
    'text-cleaner': 'Clean messy spacing or HTML before converting case.',
  },
}

/** Short contextual notes for developer-family related links. */
const DEVELOPER_RELATED_NOTES: Partial<
  Record<NonPdfToolId, Partial<Record<NonPdfToolId, string>>>
> = {
  'json-formatter': {
    base64: 'Need to encode a payload next? Base64 encode or decode here.',
    'url-encode': 'Shipping a query string? URL-encode values here.',
  },
  base64: {
    'json-formatter': 'Working with JSON too? Pretty-print or minify it next.',
    'url-encode': 'Need percent-encoding instead? URL Encode is next door.',
  },
  'url-encode': {
    base64: 'Encoding a token or blob? Try Base64 encode/decode.',
    'json-formatter': 'Formatting a JSON body? Pretty-print it locally.',
  },
}

/** Short contextual notes for data-family related links. */
const DATA_RELATED_NOTES: Partial<
  Record<NonPdfToolId, Partial<Record<NonPdfToolId, string>>>
> = {
  'csv-column-extractor': {
    'csv-to-json': 'Need the whole file as JSON instead? Convert CSV → JSON next.',
  },
  'csv-to-json': {
    'csv-column-extractor': 'Want fewer columns first? Extract them, then convert.',
    'json-to-csv': 'Going the other way? Turn JSON back into CSV.',
  },
  'json-to-csv': {
    'csv-to-json': 'Need JSON again? Convert CSV → JSON.',
    'csv-column-extractor': 'Trim columns from the CSV after you export it.',
  },
}

export type RelatedToolLink = ToolDirectoryEntry & {
  note?: string
}

/** Other tools in the same family — used for static related-tool links. */
export function relatedTools(id: ToolId): readonly RelatedToolLink[] {
  const current = TOOLS.find((tool) => tool.id === id)
  if (!current) return []

  const siblings = TOOLS.filter(
    (tool) => tool.family === current.family && tool.id !== id,
  )

  if (isPdfTool(id)) {
    const order = PDF_RELATED_ORDER[id]
    const notes = PDF_RELATED_NOTES[id]
    const byId = new Map(siblings.map((tool) => [tool.id, tool]))

    return order
      .map((relatedId) => {
        const tool = byId.get(relatedId)
        if (!tool) return null
        const note = notes?.[relatedId]
        return note ? { ...tool, note } : tool
      })
      .filter((tool): tool is RelatedToolLink => tool != null)
  }

  if (current.family === 'text') {
    const notes = TEXT_RELATED_NOTES[id as NonPdfToolId]
    return siblings.map((tool) => {
      const note = notes?.[tool.id as NonPdfToolId]
      return note ? { ...tool, note } : tool
    })
  }

  if (current.family === 'developer') {
    const notes = DEVELOPER_RELATED_NOTES[id as NonPdfToolId]
    return siblings.map((tool) => {
      const note = notes?.[tool.id as NonPdfToolId]
      return note ? { ...tool, note } : tool
    })
  }

  if (current.family === 'data') {
    const notes = DATA_RELATED_NOTES[id as NonPdfToolId]
    return siblings.map((tool) => {
      const note = notes?.[tool.id as NonPdfToolId]
      return note ? { ...tool, note } : tool
    })
  }

  return siblings
}

export const WORD_UNSCRAMBLER_META = {
  id: 'word-unscrambler' as const,
  family: 'words' as const,
  label: 'Word Unscrambler',
  ...STANDALONE_META['word-unscrambler'],
}
