import { randomBytes } from '../../lib/cryptoRandom'

export type UuidOptions = {
  count: number
  uppercase: boolean
  hyphens: boolean
}

export type UuidResult =
  | { ok: true; uuids: string[] }
  | { ok: false; error: string }

export const MIN_COUNT = 1
export const MAX_COUNT = 50

export const DEFAULT_UUID_OPTIONS: UuidOptions = {
  count: 1,
  uppercase: false,
  hyphens: true,
}

/** RFC 4122 version 4 UUID from 16 random bytes. */
export function uuidFromBytes(bytes: Uint8Array): string {
  if (bytes.length < 16) throw new Error('Need 16 bytes for a UUID.')
  const b = bytes.slice(0, 16)
  b[6] = (b[6]! & 0x0f) | 0x40
  b[8] = (b[8]! & 0x3f) | 0x80
  const hex = [...b].map((n) => n.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function generateUuid(
  options: Pick<UuidOptions, 'uppercase' | 'hyphens'> = DEFAULT_UUID_OPTIONS,
  fill?: (buf: Uint8Array) => void,
): string {
  let id: string
  if (!fill && typeof crypto.randomUUID === 'function') {
    id = crypto.randomUUID()
  } else {
    id = uuidFromBytes(randomBytes(16, fill))
  }
  if (!options.hyphens) id = id.replace(/-/g, '')
  return options.uppercase ? id.toUpperCase() : id.toLowerCase()
}

export function generateUuids(
  options: UuidOptions,
  fill?: (buf: Uint8Array) => void,
): UuidResult {
  const count = Math.min(
    MAX_COUNT,
    Math.max(MIN_COUNT, Math.floor(options.count) || MIN_COUNT),
  )
  try {
    const uuids = Array.from({ length: count }, () =>
      generateUuid(options, fill),
    )
    return { ok: true, uuids }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Could not generate UUIDs.',
    }
  }
}
