import { modeFromPathname, pathForMode } from './seo'
import type { AppMode } from './types'
import { parseAppMode } from './types'

/**
 * Resolve mode from the current URL.
 * Prefer path routes (`/merge`); fall back to legacy `?mode=` query links.
 */
export function readModeFromUrl(): AppMode {
  if (typeof window === 'undefined') return 'images'

  const params = new URLSearchParams(window.location.search)
  const queryMode = params.get('mode')
  if (queryMode != null && queryMode !== '') {
    return parseAppMode(queryMode)
  }

  return modeFromPathname(window.location.pathname)
}

/** Navigate to a mode path. Clears legacy `?mode=` so links stay clean. */
export function writeModeToUrl(mode: AppMode, method: 'push' | 'replace' = 'push') {
  const path = pathForMode(mode)
  const url = new URL(window.location.href)
  url.pathname = path
  url.searchParams.delete('mode')
  const next = `${url.pathname}${url.search}${url.hash}`
  if (method === 'replace') {
    window.history.replaceState({ mode }, '', next)
  } else {
    window.history.pushState({ mode }, '', next)
  }
}

/** One-time cleanup: `?mode=merge` → `/merge`, `/images` → `/`. */
export function normalizeModeUrl(mode: AppMode) {
  const path = pathForMode(mode)
  const url = new URL(window.location.href)
  const hasLegacyQuery = url.searchParams.has('mode')
  const needsPath = url.pathname.replace(/\/+$/, '') || '/'
  const target = path === '/' ? '/' : path
  const current = needsPath === '/images' ? '/images' : needsPath
  const pathMismatch = current !== target && !(target === '/' && current === '/')

  if (hasLegacyQuery || pathMismatch || url.pathname !== target) {
    writeModeToUrl(mode, 'replace')
  }
}
