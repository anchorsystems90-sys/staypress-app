import { describe, expect, it } from 'vitest'
import { generateUuid, generateUuids, uuidFromBytes } from './generate'

describe('uuidFromBytes', () => {
  it('sets version 4 and variant bits', () => {
    const bytes = new Uint8Array(16).fill(0)
    const id = uuidFromBytes(bytes)
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    )
  })
})

describe('generateUuid', () => {
  it('respects uppercase and hyphen options', () => {
    const fill = (buf: Uint8Array) => buf.fill(0xab)
    const withHyphens = generateUuid(
      { uppercase: true, hyphens: true },
      fill,
    )
    const bare = generateUuid({ uppercase: false, hyphens: false }, fill)
    expect(withHyphens).toMatch(/^[0-9A-F-]{36}$/)
    expect(bare).toHaveLength(32)
    expect(bare.includes('-')).toBe(false)
  })
})

describe('generateUuids', () => {
  it('returns the requested count', () => {
    const result = generateUuids({ count: 5, uppercase: false, hyphens: true })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.uuids).toHaveLength(5)
    expect(new Set(result.uuids).size).toBe(5)
  })
})
