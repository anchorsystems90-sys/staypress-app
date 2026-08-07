/** SEO-only mode ids — mirrors AppMode, kept free of DOM types so Vite can import this. */
export type SeoMode = 'images' | 'merge' | 'extract' | 'slim'

export type ModeSeo = {
  /** URL path for this tool (images is home). */
  path: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
}

/**
 * Keyword-aware titles / descriptions for crawlers and share cards.
 * Keep each page about one job; privacy is the differentiator in every blurb.
 */
export const MODE_SEO: Record<SeoMode, ModeSeo> = {
  images: {
    path: '/',
    title: 'Images to PDF — Private, no upload | Staypress',
    description:
      'Convert JPG, PNG, WebP, GIF, and HEIC to PDF in your browser. Free, no account, and files never leave your device.',
    ogTitle: 'Images to PDF — private, no upload',
    ogDescription:
      'Drop photos and get a PDF. Staypress runs entirely on your device — nothing is uploaded.',
  },
  merge: {
    path: '/merge',
    title: 'Merge PDFs privately — no upload | Staypress',
    description:
      'Combine multiple PDFs into one file in your browser. Reorder pages, free, no account — files never leave your device.',
    ogTitle: 'Merge PDFs privately — no upload',
    ogDescription:
      'Combine PDFs locally. Staypress merges on your device — nothing is uploaded.',
  },
  extract: {
    path: '/extract',
    title: 'PDF to images (JPG/PNG) — private | Staypress',
    description:
      'Turn each PDF page into a JPG or PNG in your browser. Free ZIP download, no upload — files stay on your device.',
    ogTitle: 'PDF to images — private, no upload',
    ogDescription:
      'Export PDF pages as JPG or PNG locally. Staypress never uploads your file.',
  },
  slim: {
    path: '/slim',
    title: 'Compress PDF in browser — free & private | Staypress',
    description:
      'Shrink a PDF in your browser with honest, local rebuild options. Free, no account — nothing is uploaded for compression.',
    ogTitle: 'Compress PDF privately — no upload',
    ogDescription:
      'Rebuild a smaller PDF on your device. Staypress does not upload your file.',
  },
}

/** Modes that get their own static HTML shell at build (home is index.html). */
export const SEO_SHELL_MODES: SeoMode[] = ['merge', 'extract', 'slim']

export function pathForMode(mode: SeoMode): string {
  return MODE_SEO[mode].path
}

export function modeFromPathname(pathname: string): SeoMode {
  const raw = pathname.split('?')[0] ?? '/'
  const normalized = raw.replace(/\/+$/, '') || '/'

  if (normalized === '/merge') return 'merge'
  if (normalized === '/extract') return 'extract'
  if (normalized === '/slim' || normalized === '/compress') return 'slim'
  if (normalized === '/images') return 'images'
  return 'images'
}

function absoluteUrl(path: string, origin: string): string {
  if (path === '/') return `${origin}/`
  return `${origin}${path}`
}

/**
 * Rewrite built index.html head tags for a given mode.
 * Used at build time so crawlers that skip JS still see the right meta.
 */
export function injectModeSeoIntoHtml(
  html: string,
  mode: SeoMode,
  siteOrigin?: string,
): string {
  const seo = MODE_SEO[mode]
  const origin = (siteOrigin ?? '').replace(/\/+$/, '')
  const pageUrl = origin ? absoluteUrl(seo.path, origin) : seo.path

  let out = html
  out = out.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${escapeHtml(seo.title)}</title>`,
  )
  out = replaceMetaContent(out, 'name', 'description', seo.description)
  out = replaceMetaContent(out, 'property', 'og:title', seo.ogTitle)
  out = replaceMetaContent(out, 'property', 'og:description', seo.ogDescription)
  out = replaceMetaContent(out, 'name', 'twitter:title', seo.ogTitle)
  out = replaceMetaContent(out, 'name', 'twitter:description', seo.ogDescription)

  if (origin) {
    out = upsertMetaProperty(out, 'og:url', pageUrl)
    out = upsertCanonical(out, pageUrl)
  }

  return out
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(value: string): string {
  return escapeHtml(value)
}

function replaceMetaContent(
  html: string,
  attr: 'name' | 'property',
  key: string,
  content: string,
): string {
  const re = new RegExp(
    `(<meta\\s+[^>]*${attr}=["']${key}["'][^>]*content=["'])([^"']*)(["'][^>]*>)`,
    'i',
  )
  if (re.test(html)) {
    return html.replace(re, `$1${escapeAttr(content)}$3`)
  }
  const reFlip = new RegExp(
    `(<meta\\s+[^>]*content=["'])([^"']*)(["'][^>]*${attr}=["']${key}["'][^>]*>)`,
    'i',
  )
  if (reFlip.test(html)) {
    return html.replace(reFlip, `$1${escapeAttr(content)}$3`)
  }
  return html
}

function upsertMetaProperty(html: string, property: string, content: string): string {
  const re = new RegExp(
    `<meta\\s+[^>]*property=["']${property}["'][^>]*>`,
    'i',
  )
  const tag = `<meta property="${property}" content="${escapeAttr(content)}" />`
  if (re.test(html)) {
    return html.replace(re, tag)
  }
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function upsertCanonical(html: string, href: string): string {
  const re = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i
  const tag = `<link rel="canonical" href="${escapeAttr(href)}" />`
  if (re.test(html)) {
    return html.replace(re, tag)
  }
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

export function absoluteModeUrl(mode: SeoMode, origin: string): string {
  return absoluteUrl(MODE_SEO[mode].path, origin)
}
