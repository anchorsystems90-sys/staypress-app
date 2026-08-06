export function friendlyToolError(err: unknown, fallback: string): string {
  if (err instanceof DOMException && err.name === 'QuotaExceededError') {
    return 'That batch is too large for this device. Try fewer or smaller files.'
  }

  const message = err instanceof Error ? err.message : ''

  if (/memory|quota|allocation|too large|canvas/i.test(message)) {
    return 'That batch is too large for this device. Try fewer or smaller files.'
  }

  if (/password|encrypted|Encryption/i.test(message)) {
    return 'That PDF is password-protected. Remove the password and try again.'
  }

  if (/Invalid PDF|Failed to parse|broken|corrupt/i.test(message)) {
    return 'That file doesn’t look like a valid PDF. Try another file.'
  }

  if (/HEIC|heic|HEIF|heif/i.test(message)) {
    return 'Could not convert that HEIC photo. Try exporting it as JPG first.'
  }

  if (message) return message
  return fallback
}
