import type { AppMode } from './types'
import { absoluteModeUrl, MODE_SEO } from './seoData'

export type { ModeSeo, SeoMode } from './seoData'
export {
  MODE_SEO,
  SEO_SHELL_MODES,
  pathForMode,
  modeFromPathname,
  injectModeSeoIntoHtml,
  absoluteModeUrl,
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

  document.title = seo.title
  setMeta('name', 'description', seo.description)
  setMeta('property', 'og:title', seo.ogTitle)
  setMeta('property', 'og:description', seo.ogDescription)
  setMeta('property', 'og:url', url)
  setMeta('name', 'twitter:title', seo.ogTitle)
  setMeta('name', 'twitter:description', seo.ogDescription)
  setCanonical(url)
}
