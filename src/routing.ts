import {
  contentPageFromPathname,
  pathForMode,
  viewFromPathname,
  type AppView,
  type ContentPageId,
} from './seo'
import { CONTENT_PAGE_SEO, modeFromPathname } from './seoData'
import type { AppMode } from './types'
import { parseAppMode } from './types'

export type { AppView }

/**
 * Resolve app view from the current URL.
 * Prefer path routes (`/merge`, `/privacy`); fall back to legacy `?mode=` query.
 */
export function readViewFromUrl(): AppView {
  if (typeof window === 'undefined') return { kind: 'tool', mode: 'images' }

  const page = contentPageFromPathname(window.location.pathname)
  if (page) return { kind: 'page', page }

  const params = new URLSearchParams(window.location.search)
  const queryMode = params.get('mode')
  if (queryMode != null && queryMode !== '') {
    return { kind: 'tool', mode: parseAppMode(queryMode) }
  }

  return { kind: 'tool', mode: modeFromPathname(window.location.pathname) }
}

/** @deprecated Prefer readViewFromUrl. */
export function readModeFromUrl(): AppMode {
  const view = readViewFromUrl()
  return view.kind === 'tool' ? view.mode : 'images'
}

function navigate(pathname: string, method: 'push' | 'replace') {
  const url = new URL(window.location.href)
  url.pathname = pathname
  url.searchParams.delete('mode')
  const next = `${url.pathname}${url.search}${url.hash}`
  if (method === 'replace') {
    window.history.replaceState({}, '', next)
  } else {
    window.history.pushState({}, '', next)
  }
}

/** Navigate to a mode path. Clears legacy `?mode=` so links stay clean. */
export function writeModeToUrl(mode: AppMode, method: 'push' | 'replace' = 'push') {
  navigate(pathForMode(mode), method)
}

/** Navigate to a content page path (e.g. /privacy). */
export function writePageToUrl(
  page: ContentPageId,
  method: 'push' | 'replace' = 'push',
) {
  navigate(CONTENT_PAGE_SEO[page].path, method)
}

/** One-time cleanup for tool and content URLs. */
export function normalizeViewUrl(view: AppView) {
  if (view.kind === 'page') {
    const target = CONTENT_PAGE_SEO[view.page].path
    const current = window.location.pathname.replace(/\/+$/, '') || '/'
    if (current !== target || window.location.search.includes('mode=')) {
      writePageToUrl(view.page, 'replace')
    }
    return
  }

  normalizeModeUrl(view.mode)
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

export { viewFromPathname }
