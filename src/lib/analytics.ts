import { track } from '@vercel/analytics'
import type { AppMode } from '../types'

/** Fired when a tool completes a downloadable result (anonymous — no file data). */
export function trackToolUsed(
  mode: AppMode,
  props?: {
    /** Secondary dimension, e.g. extract `page` / `zip`, merge `arrange`, slim preset */
    detail?: string
    pages?: number
    files?: number
  },
) {
  try {
    const properties: Record<string, string | number> = { mode }
    if (props?.detail != null) properties.detail = props.detail
    if (props?.pages != null) properties.pages = props.pages
    if (props?.files != null) properties.files = props.files
    track('tool_used', properties)
  } catch {
    // Analytics must never break the download path.
  }
}
