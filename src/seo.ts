import type { AppMode } from './types'
import {
  absoluteContentPageUrl,
  absoluteModeUrl,
  buildContentPageJsonLd,
  buildModeJsonLd,
  contentPageFromPathname,
  CONTENT_PAGE_SEO,
  modeFromPathname,
  MODE_SEO,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_TYPE,
  OG_IMAGE_WIDTH,
  resolveAssetUrl,
  serializeJsonLd,
  type ContentPageId,
} from './seoData'

export type {
  ContentPageId,
  ContentPageSeo,
  ModeFaq,
  ModePageContent,
  ModeSeo,
  SeoMode,
} from './seoData'
export {
  MODE_SEO,
  MODE_PAGE_CONTENT,
  CONTENT_PAGE_SEO,
  CONTENT_PAGE_SHELLS,
  SEO_SHELL_MODES,
  pathForMode,
  modeFromPathname,
  contentPageFromPathname,
  injectModeSeoIntoHtml,
  injectContentPageSeoIntoHtml,
  absoluteModeUrl,
  absoluteContentPageUrl,
  resolveAssetUrl,
  buildModeJsonLd,
  buildContentPageJsonLd,
  serializeJsonLd,
  OG_IMAGE_PATH,
  OG_IMAGE_ALT,
} from './seoData'

export type AppView =
  | { kind: 'tool'; mode: AppMode }
  | { kind: 'page'; page: ContentPageId }

const JSON_LD_ID = 'staypress-jsonld'

function setMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
): void {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  )
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function writeJsonLd(data: unknown): void {
  let el = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = JSON_LD_ID
    document.head.appendChild(el)
  }
  el.textContent = serializeJsonLd(data)
}

function applySocialSeo(input: {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  url: string
  origin: string
}): void {
  const imageUrl = resolveAssetUrl(OG_IMAGE_PATH, input.origin)

  document.title = input.title
  setMeta('name', 'description', input.description)
  setMeta('property', 'og:title', input.ogTitle)
  setMeta('property', 'og:description', input.ogDescription)
  setMeta('property', 'og:url', input.url)
  setMeta('property', 'og:image', imageUrl)
  setMeta('property', 'og:image:type', OG_IMAGE_TYPE)
  setMeta('property', 'og:image:width', String(OG_IMAGE_WIDTH))
  setMeta('property', 'og:image:height', String(OG_IMAGE_HEIGHT))
  setMeta('property', 'og:image:alt', OG_IMAGE_ALT)
  setMeta('name', 'twitter:title', input.ogTitle)
  setMeta('name', 'twitter:description', input.ogDescription)
  setMeta('name', 'twitter:image', imageUrl)
  setCanonical(input.url)
}

export function viewFromPathname(pathname: string): AppView {
  const page = contentPageFromPathname(pathname)
  if (page) return { kind: 'page', page }
  return { kind: 'tool', mode: modeFromPathname(pathname) }
}

/** Update document title, social meta, and JSON-LD for the active tool mode. */
export function applyModeSeo(mode: AppMode, origin = window.location.origin): void {
  const seo = MODE_SEO[mode]
  applySocialSeo({
    title: seo.title,
    description: seo.description,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    url: absoluteModeUrl(mode, origin),
    origin,
  })
  writeJsonLd(buildModeJsonLd(mode, origin))
}

/** Update document title, social meta, and JSON-LD for a content page. */
export function applyContentPageSeo(
  page: ContentPageId,
  origin = window.location.origin,
): void {
  const seo = CONTENT_PAGE_SEO[page]
  applySocialSeo({
    title: seo.title,
    description: seo.description,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    url: absoluteContentPageUrl(page, origin),
    origin,
  })
  writeJsonLd(buildContentPageJsonLd(page, origin))
}

/** Apply the right SEO package for a tool or content view. */
export function applyViewSeo(
  view: AppView,
  origin = window.location.origin,
): void {
  if (view.kind === 'page') {
    applyContentPageSeo(view.page, origin)
    return
  }
  applyModeSeo(view.mode, origin)
}
