import type { AppMode } from './types'
import {
  absoluteModeUrl,
  MODE_SEO,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_TYPE,
  OG_IMAGE_WIDTH,
  resolveAssetUrl,
} from './seoData'

export type { ModeSeo, SeoMode } from './seoData'
export {
  MODE_SEO,
  SEO_SHELL_MODES,
  pathForMode,
  modeFromPathname,
  injectModeSeoIntoHtml,
  absoluteModeUrl,
  resolveAssetUrl,
  OG_IMAGE_PATH,
  OG_IMAGE_ALT,
} from './seoData'

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

/** Update document title + social meta for the active mode (client-side). */
export function applyModeSeo(mode: AppMode, origin = window.location.origin): void {
  const seo = MODE_SEO[mode]
  const url = absoluteModeUrl(mode, origin)
  const imageUrl = resolveAssetUrl(OG_IMAGE_PATH, origin)

  document.title = seo.title
  setMeta('name', 'description', seo.description)
  setMeta('property', 'og:title', seo.ogTitle)
  setMeta('property', 'og:description', seo.ogDescription)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', imageUrl)
  setMeta('property', 'og:image:type', OG_IMAGE_TYPE)
  setMeta('property', 'og:image:width', String(OG_IMAGE_WIDTH))
  setMeta('property', 'og:image:height', String(OG_IMAGE_HEIGHT))
  setMeta('property', 'og:image:alt', OG_IMAGE_ALT)
  setMeta('name', 'twitter:title', seo.ogTitle)
  setMeta('name', 'twitter:description', seo.ogDescription)
  setMeta('name', 'twitter:image', imageUrl)
  setCanonical(url)
}
