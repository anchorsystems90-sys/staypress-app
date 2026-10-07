import { describe, expect, it } from 'vitest'
import {
  decodeBase64,
  encodeBase64,
  normalizeBase64Input,
} from './base64'

describe('encodeBase64 / decodeBase64', () => {
  it('round-trips plain ASCII', () => {
    const encoded = encodeBase64('hello world')
    expect(encoded.ok).toBe(true)
    if (!encoded.ok) return
    expect(encoded.text).toBe('aGVsbG8gd29ybGQ=')
    const decoded = decodeBase64(encoded.text)
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) return
    expect(decoded.text).toBe('hello world')
  })

  it('round-trips unicode text', () => {
    const input = 'café — 日本語'
    const encoded = encodeBase64(input)
    expect(encoded.ok).toBe(true)
    if (!encoded.ok) return
    const decoded = decodeBase64(encoded.text)
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) return
    expect(decoded.text).toBe(input)
  })

  it('supports URL-safe encoding', () => {
    // ">>?" encodes to something with +/ in standard Base64
    const encoded = encodeBase64('subjects?_d', { urlSafe: true })
    expect(encoded.ok).toBe(true)
    if (!encoded.ok) return
    expect(encoded.text.includes('+')).toBe(false)
    expect(encoded.text.includes('/')).toBe(false)
    expect(encoded.text.includes('=')).toBe(false)
    const decoded = decodeBase64(encoded.text)
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) return
    expect(decoded.text).toBe('subjects?_d')
  })

  it('decodes URL-safe and whitespace-padded input', () => {
    const encoded = encodeBase64('hello world')
    expect(encoded.ok).toBe(true)
    if (!encoded.ok) return
    const spaced = `${encoded.text.slice(0, 8)}\n${encoded.text.slice(8)}`
    const decoded = decodeBase64(spaced)
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) return
    expect(decoded.text).toBe('hello world')
  })

  it('rejects invalid Base64', () => {
    const result = decodeBase64('%%%not-base64%%%')
    expect(result.ok).toBe(false)
  })
})

describe('normalizeBase64Input', () => {
  it('restores padding and URL-safe characters', () => {
    expect(normalizeBase64Input('YWJj')).toBe('YWJj')
    expect(normalizeBase64Input('YWI')).toBe('YWI=')
    expect(normalizeBase64Input('YQ')).toBe('YQ==')
    expect(normalizeBase64Input('ab-_')).toBe('ab+/')
  })
})
