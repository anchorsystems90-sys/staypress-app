import { describe, expect, it } from 'vitest'
import { decodeUrl, encodeUrl } from './urlEncode'

describe('encodeUrl', () => {
  it('encodes components with encodeURIComponent rules', () => {
    const result = encodeUrl('hello world&x=1', { style: 'component', plusAsSpace: true })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.text).toBe('hello%20world%26x%3D1')
  })

  it('keeps URL structure in uri mode', () => {
    const result = encodeUrl('https://example.com/a b?q=1', {
      style: 'uri',
      plusAsSpace: true,
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.text).toBe('https://example.com/a%20b?q=1')
  })
})

describe('decodeUrl', () => {
  it('round-trips component encoding', () => {
    const encoded = encodeUrl('café & tea', {
      style: 'component',
      plusAsSpace: true,
    })
    expect(encoded.ok).toBe(true)
    if (!encoded.ok) return
    const decoded = decodeUrl(encoded.text, {
      style: 'component',
      plusAsSpace: true,
    })
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) return
    expect(decoded.text).toBe('café & tea')
  })

  it('treats + as space when enabled', () => {
    const decoded = decodeUrl('hello+world', {
      style: 'component',
      plusAsSpace: true,
    })
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) return
    expect(decoded.text).toBe('hello world')
  })

  it('keeps + literal when plusAsSpace is off', () => {
    const decoded = decodeUrl('hello+world', {
      style: 'component',
      plusAsSpace: false,
    })
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) return
    expect(decoded.text).toBe('hello+world')
  })

  it('rejects malformed percent sequences', () => {
    const decoded = decodeUrl('bad%ZZ', {
      style: 'component',
      plusAsSpace: true,
    })
    expect(decoded.ok).toBe(false)
  })
})
