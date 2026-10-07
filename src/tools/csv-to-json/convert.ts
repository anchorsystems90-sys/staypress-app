import {
  SAMPLE_CSV,
  inspectCsv,
  serializeCsv,
  type CsvDelimiter,
} from '../csv-column-extractor/csv'

export type JsonShape = 'objects' | 'arrays'

export type ConvertResult =
  | {
      ok: true
      text: string
      rowCount: number
      columnCount: number
      delimiter?: CsvDelimiter
    }
  | {
      ok: false
      error: string
      empty?: boolean
    }

export const SAMPLE_JSON = `[
  {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "city": "London",
    "score": 98
  },
  {
    "name": "Grace Hopper",
    "email": "grace@example.com",
    "city": "New York",
    "score": 95
  }
]`

export { SAMPLE_CSV }

export type CsvToJsonOptions = {
  hasHeader: boolean
  shape: JsonShape
  pretty: boolean
}

export type JsonToCsvOptions = {
  delimiter: CsvDelimiter
}

export const DEFAULT_CSV_TO_JSON: CsvToJsonOptions = {
  hasHeader: true,
  shape: 'objects',
  pretty: true,
}

export const DEFAULT_JSON_TO_CSV: JsonToCsvOptions = {
  delimiter: ',',
}

function cellFromJsonValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return JSON.stringify(value)
}

/** Best-effort number/boolean coercion for CSV cells when converting to JSON. */
export function coerceCsvValue(raw: string): string | number | boolean | null {
  const value = raw.trim()
  if (value === '') return null
  if (value === 'true') return true
  if (value === 'false') return false
  // Keep leading-zero / phone-like values as strings.
  if (/^0\d+/.test(value)) return value
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const n = Number(value)
    if (Number.isFinite(n)) return n
  }
  return raw
}

export function csvToJson(
  input: string,
  options: CsvToJsonOptions = DEFAULT_CSV_TO_JSON,
): ConvertResult {
  if (!input.trim()) {
    return { ok: false, empty: true, error: 'Paste CSV to convert it to JSON.' }
  }

  const inspected = inspectCsv(input, { hasHeader: options.hasHeader })
  if (!inspected.ok || !inspected.table) {
    return {
      ok: false,
      error: inspected.ok ? 'Could not read that CSV.' : inspected.error,
    }
  }

  const { table } = inspected
  let data: unknown

  if (options.shape === 'arrays') {
    data = options.hasHeader
      ? [table.headers, ...table.rows]
      : table.rows
  } else {
    data = table.rows.map((row) => {
      const obj: Record<string, string | number | boolean | null> = {}
      for (let i = 0; i < table.columnCount; i++) {
        const key = table.headers[i] || `Column ${i + 1}`
        obj[key] = coerceCsvValue(row[i] ?? '')
      }
      return obj
    })
  }

  const text = options.pretty
    ? `${JSON.stringify(data, null, 2)}\n`
    : JSON.stringify(data)

  return {
    ok: true,
    text,
    rowCount: table.rows.length,
    columnCount: table.columnCount,
    delimiter: table.delimiter,
  }
}

function collectObjectHeaders(rows: Record<string, unknown>[]): string[] {
  const headers: string[] = []
  const seen = new Set<string>()
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (seen.has(key)) continue
      seen.add(key)
      headers.push(key)
    }
  }
  return headers
}

export function jsonToCsv(
  input: string,
  options: JsonToCsvOptions = DEFAULT_JSON_TO_CSV,
): ConvertResult {
  if (!input.trim()) {
    return { ok: false, empty: true, error: 'Paste JSON to convert it to CSV.' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Invalid JSON.'
    return { ok: false, error: `Invalid JSON — ${message}` }
  }

  if (!Array.isArray(parsed)) {
    return {
      ok: false,
      error: 'JSON must be an array of objects or an array of arrays.',
    }
  }

  if (parsed.length === 0) {
    return {
      ok: true,
      text: '',
      rowCount: 0,
      columnCount: 0,
      delimiter: options.delimiter,
    }
  }

  const first = parsed[0]
  let rows: string[][]
  let columnCount: number
  let dataRowCount: number

  if (Array.isArray(first)) {
    const width = parsed.reduce((max: number, row) => {
      if (!Array.isArray(row)) return max
      return Math.max(max, row.length)
    }, 0)

    for (const row of parsed) {
      if (!Array.isArray(row)) {
        return {
          ok: false,
          error: 'When using arrays, every item must be an array row.',
        }
      }
    }

    rows = (parsed as unknown[][]).map((row) => {
      const next = row.map(cellFromJsonValue)
      while (next.length < width) next.push('')
      return next.slice(0, width)
    })
    columnCount = width
    dataRowCount = rows.length
  } else if (first != null && typeof first === 'object') {
    for (const row of parsed) {
      if (row == null || typeof row !== 'object' || Array.isArray(row)) {
        return {
          ok: false,
          error: 'When using objects, every item must be a plain object.',
        }
      }
    }

    const objects = parsed as Record<string, unknown>[]
    const headers = collectObjectHeaders(objects)
    if (headers.length === 0) {
      return {
        ok: false,
        error: 'Those objects have no keys to turn into CSV columns.',
      }
    }

    rows = [
      headers,
      ...objects.map((row) =>
        headers.map((key) => cellFromJsonValue(row[key])),
      ),
    ]
    columnCount = headers.length
    dataRowCount = objects.length
  } else {
    return {
      ok: false,
      error: 'JSON must be an array of objects or an array of arrays.',
    }
  }

  return {
    ok: true,
    text: serializeCsv(rows, options.delimiter),
    rowCount: dataRowCount,
    columnCount,
    delimiter: options.delimiter,
  }
}
