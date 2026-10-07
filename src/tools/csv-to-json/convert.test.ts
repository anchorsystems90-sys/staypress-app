import { describe, expect, it } from 'vitest'
import {
  coerceCsvValue,
  csvToJson,
  jsonToCsv,
} from './convert'

describe('csvToJson', () => {
  it('converts headered CSV into an array of objects', () => {
    const result = csvToJson('name,score\nAda,98\nGrace,95', {
      hasHeader: true,
      shape: 'objects',
      pretty: false,
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(JSON.parse(result.text)).toEqual([
      { name: 'Ada', score: 98 },
      { name: 'Grace', score: 95 },
    ])
    expect(result.rowCount).toBe(2)
    expect(result.columnCount).toBe(2)
  })

  it('can emit arrays including the header row', () => {
    const result = csvToJson('a,b\n1,2', {
      hasHeader: true,
      shape: 'arrays',
      pretty: false,
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(JSON.parse(result.text)).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })

  it('keeps phone-like leading zeros as strings', () => {
    expect(coerceCsvValue('0123')).toBe('0123')
    expect(coerceCsvValue('42')).toBe(42)
    expect(coerceCsvValue('true')).toBe(true)
    expect(coerceCsvValue('')).toBe(null)
  })
})

describe('jsonToCsv', () => {
  it('converts an array of objects to CSV', () => {
    const result = jsonToCsv(
      JSON.stringify([
        { name: 'Ada', city: 'London' },
        { name: 'Grace', city: 'New York', score: 95 },
      ]),
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.text).toBe(
      'name,city,score\nAda,London,\nGrace,New York,95',
    )
    expect(result.rowCount).toBe(2)
    expect(result.columnCount).toBe(3)
  })

  it('converts an array of arrays to CSV', () => {
    const result = jsonToCsv(
      JSON.stringify([
        ['name', 'city'],
        ['Ada', 'London'],
      ]),
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.text).toBe('name,city\nAda,London')
  })

  it('rejects non-array JSON roots', () => {
    const result = jsonToCsv('{"name":"Ada"}')
    expect(result.ok).toBe(false)
  })

  it('stringifies nested values', () => {
    const result = jsonToCsv(
      JSON.stringify([{ name: 'Ada', meta: { ok: true } }]),
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.text).toBe('name,meta\nAda,"{""ok"":true}"')
  })

  it('round-trips object CSV through JSON and back', () => {
    const csv = 'name,score\nAda,98'
    const asJson = csvToJson(csv, {
      hasHeader: true,
      shape: 'objects',
      pretty: false,
    })
    expect(asJson.ok).toBe(true)
    if (!asJson.ok) return
    const back = jsonToCsv(asJson.text)
    expect(back.ok).toBe(true)
    if (!back.ok) return
    expect(back.text).toBe(csv)
  })
})
