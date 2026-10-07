/** Delimiters we can auto-detect for pasted / uploaded CSV. */
export type CsvDelimiter = ',' | ';' | '\t'

export type ParseCsvResult =
  | {
      ok: true
      rows: string[][]
      delimiter: CsvDelimiter
    }
  | {
      ok: false
      error: string
    }

export type CsvTable = {
  headers: string[]
  /** Data rows only (header row excluded when present). */
  rows: string[][]
  columnCount: number
  delimiter: CsvDelimiter
}

export const SAMPLE_CSV = `name,email,city,score
Ada Lovelace,ada@example.com,London,98
Grace Hopper,grace@example.com,New York,95
Alan Turing,alan@example.com,Manchester,97
Katherine Johnson,katherine@example.com,White Sulphur Springs,99`

const DELIMITERS: CsvDelimiter[] = [',', ';', '\t']

/** Escape a cell for RFC 4180-style CSV output. */
export function escapeCsvCell(value: string, delimiter: CsvDelimiter = ','): string {
  const needsQuotes =
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r') ||
    value.includes(delimiter)
  if (!needsQuotes) return value
  return `"${value.replace(/"/g, '""')}"`
}

/** Serialize rows to CSV text (no trailing blank line). */
export function serializeCsv(
  rows: string[][],
  delimiter: CsvDelimiter = ',',
): string {
  return rows
    .map((row) => row.map((cell) => escapeCsvCell(cell, delimiter)).join(delimiter))
    .join('\n')
}

/**
 * Parse CSV text with quoted fields, escaped quotes, and newlines in quotes.
 * Returns rows as string[][]; does not interpret a header row.
 */
export function parseCsv(
  input: string,
  delimiter: CsvDelimiter = ',',
): ParseCsvResult {
  const text = input.replace(/^\uFEFF/, '')
  if (!text.trim()) {
    return { ok: false, error: 'Paste or choose a CSV file to get started.' }
  }

  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false
  let i = 0

  const pushCell = () => {
    row.push(cell)
    cell = ''
  }
  const pushRow = () => {
    // Skip a completely empty trailing line after the final newline.
    if (row.length === 1 && row[0] === '' && rows.length > 0) {
      row = []
      return
    }
    rows.push(row)
    row = []
  }

  while (i < text.length) {
    const ch = text[i]!

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      cell += ch
      i += 1
      continue
    }

    if (ch === '"') {
      inQuotes = true
      i += 1
      continue
    }

    if (ch === delimiter) {
      pushCell()
      i += 1
      continue
    }

    if (ch === '\r' || ch === '\n') {
      pushCell()
      pushRow()
      if (ch === '\r' && text[i + 1] === '\n') i += 1
      i += 1
      continue
    }

    cell += ch
    i += 1
  }

  if (inQuotes) {
    return {
      ok: false,
      error: 'CSV looks unfinished — a quoted field never closed.',
    }
  }

  // Final cell/row when file does not end with a newline.
  if (cell.length > 0 || row.length > 0 || text.endsWith(delimiter)) {
    pushCell()
    pushRow()
  }

  if (rows.length === 0) {
    return { ok: false, error: 'No rows found in that CSV.' }
  }

  return { ok: true, rows, delimiter }
}

/** Count delimiter occurrences outside of quotes on a single logical line. */
function countDelimiters(line: string, delimiter: CsvDelimiter): number {
  let count = 0
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        i += 1
        continue
      }
      inQuotes = !inQuotes
      continue
    }
    if (!inQuotes && ch === delimiter) count += 1
  }
  return count
}

/** First physical line, respecting that quotes may span — use raw first line for sniffing. */
function firstPhysicalLine(text: string): string {
  const normalized = text.replace(/^\uFEFF/, '')
  let inQuotes = false
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i]!
    if (ch === '"') {
      if (inQuotes && normalized[i + 1] === '"') {
        i += 1
        continue
      }
      inQuotes = !inQuotes
      continue
    }
    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      return normalized.slice(0, i)
    }
  }
  return normalized
}

/** Pick comma / semicolon / tab from the first line’s field counts. */
export function detectDelimiter(input: string): CsvDelimiter {
  const line = firstPhysicalLine(input)
  if (!line.trim()) return ','

  let best: CsvDelimiter = ','
  let bestCount = -1
  for (const delimiter of DELIMITERS) {
    const count = countDelimiters(line, delimiter)
    if (count > bestCount) {
      best = delimiter
      bestCount = count
    }
  }
  return bestCount > 0 ? best : ','
}

function columnLabel(index: number, headerCell: string | undefined, hasHeader: boolean): string {
  const trimmed = headerCell?.trim() ?? ''
  if (hasHeader && trimmed) return trimmed
  return `Column ${index + 1}`
}

/**
 * Build a table view from parsed rows.
 * When hasHeader is true, row 0 becomes headers; otherwise synthetic Column N labels.
 */
export function buildCsvTable(
  rows: string[][],
  delimiter: CsvDelimiter,
  hasHeader: boolean,
): CsvTable {
  const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0)
  const headerSource = hasHeader ? (rows[0] ?? []) : []
  const headers = Array.from({ length: columnCount }, (_, index) =>
    columnLabel(index, headerSource[index], hasHeader),
  )
  const dataRows = (hasHeader ? rows.slice(1) : rows).map((row) => {
    const next = row.slice(0, columnCount)
    while (next.length < columnCount) next.push('')
    return next
  })

  return {
    headers,
    rows: dataRows,
    columnCount,
    delimiter,
  }
}

/** Parse input and build a table in one step. */
export function inspectCsv(
  input: string,
  options: { hasHeader?: boolean; delimiter?: CsvDelimiter } = {},
): ParseCsvResult & { table?: CsvTable } {
  const delimiter = options.delimiter ?? detectDelimiter(input)
  const parsed = parseCsv(input, delimiter)
  if (!parsed.ok) return parsed
  const hasHeader = options.hasHeader ?? true
  return {
    ...parsed,
    table: buildCsvTable(parsed.rows, parsed.delimiter, hasHeader),
  }
}

/**
 * Keep only selected column indexes (in the order given).
 * Returns header + data rows ready to serialize.
 */
export function extractColumns(
  table: CsvTable,
  selectedIndexes: readonly number[],
  includeHeader: boolean,
): string[][] {
  const indexes = selectedIndexes.filter(
    (index) => index >= 0 && index < table.columnCount,
  )
  if (indexes.length === 0) return []

  const out: string[][] = []
  if (includeHeader) {
    out.push(indexes.map((index) => table.headers[index] ?? `Column ${index + 1}`))
  }
  for (const row of table.rows) {
    out.push(indexes.map((index) => row[index] ?? ''))
  }
  return out
}

export function csvStats(table: CsvTable, selectedCount: number) {
  return {
    rows: table.rows.length,
    columns: table.columnCount,
    selected: selectedCount,
  }
}
