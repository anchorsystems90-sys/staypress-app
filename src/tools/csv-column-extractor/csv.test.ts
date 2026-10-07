import { describe, expect, it } from 'vitest'
import {
  buildCsvTable,
  detectDelimiter,
  escapeCsvCell,
  extractColumns,
  inspectCsv,
  parseCsv,
  serializeCsv,
} from './csv'

describe('parseCsv', () => {
  it('parses simple comma-separated rows', () => {
    const result = parseCsv('a,b,c\n1,2,3')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.rows).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ])
  })

  it('handles quoted commas and escaped quotes', () => {
    const result = parseCsv('name,note\n"Lovelace, Ada","She said ""hello"""')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.rows).toEqual([
      ['name', 'note'],
      ['Lovelace, Ada', 'She said "hello"'],
    ])
  })

  it('keeps newlines inside quoted fields', () => {
    const result = parseCsv('id,bio\n1,"line one\nline two"')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.rows).toEqual([
      ['id', 'bio'],
      ['1', 'line one\nline two'],
    ])
  })

  it('rejects an unclosed quote', () => {
    const result = parseCsv('a,"b')
    expect(result.ok).toBe(false)
  })

  it('strips a UTF-8 BOM', () => {
    const result = parseCsv('\uFEFFa,b\n1,2')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.rows[0]).toEqual(['a', 'b'])
  })
})

describe('detectDelimiter', () => {
  it('prefers commas when they win the first line', () => {
    expect(detectDelimiter('a,b,c\n1;2;3')).toBe(',')
  })

  it('detects semicolons', () => {
    expect(detectDelimiter('a;b;c\n1;2;3')).toBe(';')
  })

  it('detects tabs', () => {
    expect(detectDelimiter('a\tb\tc\n1\t2\t3')).toBe('\t')
  })
})

describe('buildCsvTable + extractColumns', () => {
  it('uses the first row as headers', () => {
    const table = buildCsvTable(
      [
        ['name', 'city'],
        ['Ada', 'London'],
      ],
      ',',
      true,
    )
    expect(table.headers).toEqual(['name', 'city'])
    expect(table.rows).toEqual([['Ada', 'London']])
  })

  it('synthesizes column labels without a header row', () => {
    const table = buildCsvTable(
      [
        ['Ada', 'London'],
        ['Grace', 'New York'],
      ],
      ',',
      false,
    )
    expect(table.headers).toEqual(['Column 1', 'Column 2'])
    expect(table.rows).toHaveLength(2)
  })

  it('extracts selected columns in the given order', () => {
    const inspected = inspectCsv(
      'name,email,city\nAda,ada@example.com,London\nGrace,grace@example.com,NYC',
    )
    expect(inspected.ok).toBe(true)
    if (!inspected.ok || !inspected.table) return

    const rows = extractColumns(inspected.table, [2, 0], true)
    expect(rows).toEqual([
      ['city', 'name'],
      ['London', 'Ada'],
      ['NYC', 'Grace'],
    ])
    expect(serializeCsv(rows)).toBe('city,name\nLondon,Ada\nNYC,Grace')
  })

  it('pads short rows to the table width', () => {
    const table = buildCsvTable(
      [
        ['a', 'b', 'c'],
        ['1'],
      ],
      ',',
      true,
    )
    expect(table.rows[0]).toEqual(['1', '', ''])
  })
})

describe('escapeCsvCell / serializeCsv', () => {
  it('quotes cells that need it', () => {
    expect(escapeCsvCell('plain')).toBe('plain')
    expect(escapeCsvCell('a,b')).toBe('"a,b"')
    expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""')
  })
})
