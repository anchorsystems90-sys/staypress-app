import {
  contentPageFromPathname,
  pathForMode,
  viewFromPathname,
  type AppView,
  type ContentPageId,
} from './seo'
import { CONTENT_PAGE_SEO, HOME_PATH, toolFromPathname } from './seoData'
import type { ToolId } from './toolCatalog'
import { isPdfTool } from './toolCatalog'
import type { AppMode } from './types'
import { parseAppMode } from './types'

export type { AppView }

/**
 * Resolve app view from the current URL.
 * Prefer path routes; fall back to legacy `?mode=` query for PDF tools.
 */
export function readViewFromUrl(): AppView {
  if (typeof window === 'undefined') return { kind: 'home' }

  const page = contentPageFromPathname(window.location.pathname)
  if (page) return { kind: 'page', page }

  const params = new URLSearchParams(window.location.search)
  const queryMode = params.get('mode')
  if (queryMode != null && queryMode !== '') {
    return { kind: 'tool', id: parseAppMode(queryMode) }
  }

  return viewFromPathname(window.location.pathname)
}

/** @deprecated Prefer readViewFromUrl. */
export function readModeFromUrl(): AppMode {
  const view = readViewFromUrl()
  if (view.kind === 'tool' && isPdfTool(view.id)) return view.id
  return 'images'
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

export function writeHomeToUrl(method: 'push' | 'replace' = 'push') {
  navigate(HOME_PATH, method)
}

export function writeToolToUrl(id: ToolId, method: 'push' | 'replace' = 'push') {
  navigate(pathForMode(id), method)
}

/** Navigate to a PDF mode path. Clears legacy `?mode=` so links stay clean. */
export function writeModeToUrl(mode: AppMode, method: 'push' | 'replace' = 'push') {
  writeToolToUrl(mode, method)
}

/** Navigate to a content page path (e.g. /privacy). */
export function writePageToUrl(
  page: ContentPageId,
  method: 'push' | 'replace' = 'push',
) {
  navigate(CONTENT_PAGE_SEO[page].path, method)
}

/** One-time cleanup for home, tool, and content URLs. */
export function normalizeViewUrl(view: AppView) {
  if (view.kind === 'page') {
    const target = CONTENT_PAGE_SEO[view.page].path
    const current = window.location.pathname.replace(/\/+$/, '') || '/'
    if (current !== target || window.location.search.includes('mode=')) {
      writePageToUrl(view.page, 'replace')
    }
    return
  }

  if (view.kind === 'home') {
    const current = window.location.pathname.replace(/\/+$/, '') || '/'
    if (current !== HOME_PATH || window.location.search.includes('mode=')) {
      writeHomeToUrl('replace')
    }
    return
  }

  if (isPdfTool(view.id)) {
    normalizeModeUrl(view.id)
    return
  }

  const target = pathForMode(view.id)
  const current = window.location.pathname.replace(/\/+$/, '') || '/'
  if (current !== target || window.location.search.includes('mode=')) {
    writeToolToUrl(view.id, 'replace')
  }
}

/** One-time cleanup: `?mode=merge` → `/merge`, `/images` → `/images-to-pdf`. */
export function normalizeModeUrl(mode: AppMode) {
  const path = pathForMode(mode)
  const url = new URL(window.location.href)
  const hasLegacyQuery = url.searchParams.has('mode')
  const needsPath = url.pathname.replace(/\/+$/, '') || '/'
  const pathMismatch = needsPath !== path

  if (hasLegacyQuery || pathMismatch || url.pathname !== path) {
    writeModeToUrl(mode, 'replace')
  }
}

export { viewFromPathname, toolFromPathname }
