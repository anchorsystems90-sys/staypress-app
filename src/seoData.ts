/** SEO-only mode ids — mirrors AppMode, kept free of DOM types so Vite can import this. */
export type SeoMode = 'images' | 'merge' | 'extract' | 'slim'

/** Default share-card image (1200×630 PNG in /public). */
export const OG_IMAGE_PATH = '/og.png'
export const OG_IMAGE_TYPE = 'image/png'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_ALT =
  'Staypress — private PDF tools that run in your browser with no upload'

export type ModeSeo = {
  /** URL path for this tool (images is home). */
  path: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
}

export type ModeFaq = {
  question: string
  answer: string
}

/** Idle-only on-page copy for crawlers + humans (below the tool stage). */
export type ModePageContent = {
  h1: string
  intro: string
  faqs: ModeFaq[]
  /** Schema.org WebApplication name for this tool surface. */
  appName: string
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

export const MODE_PAGE_CONTENT: Record<SeoMode, ModePageContent> = {
  images: {
    appName: 'Staypress — Images to PDF',
    h1: 'Convert images to PDF privately',
    intro:
      'Drop JPG, PNG, WebP, GIF, or HEIC photos and build a PDF in the browser. Free, no account, and files are never uploaded for conversion.',
    faqs: [
      {
        question: 'Are my photos uploaded to a server?',
        answer:
          'No. Staypress converts images to PDF entirely in your browser. Your photos stay on this device unless you choose to download the finished PDF.',
      },
      {
        question: 'Which image formats are supported?',
        answer:
          'JPG, PNG, WebP, GIF, and HEIC (including many iPhone photos). HEIC is converted locally before preview and export.',
      },
      {
        question: 'Can I reorder pages before download?',
        answer:
          'Yes. After you add images you can reorder them, preview pages, and then download a single PDF.',
      },
      {
        question: 'Is Staypress free?',
        answer:
          'Yes. The Images → PDF tool is free to use with no account required.',
      },
    ],
  },
  merge: {
    appName: 'Staypress — Merge PDFs',
    h1: 'Merge PDFs in your browser',
    intro:
      'Combine multiple PDF files into one local merge. Reorder files or pages, free of charge — nothing is uploaded to process your documents.',
    faqs: [
      {
        question: 'Do merged PDFs leave my device?',
        answer:
          'No. Merging runs in your browser with pdf-lib. Staypress does not upload your PDFs for the merge.',
      },
      {
        question: 'Can I change the order of files?',
        answer:
          'Yes. Add several PDFs, drag to reorder, and download one combined file. Advanced mode also lets you arrange or remove individual pages.',
      },
      {
        question: 'What about password-protected PDFs?',
        answer:
          'Encrypted or passworded PDFs are not supported yet. You’ll get a clear error so you know why a file could not be added.',
      },
      {
        question: 'Is there a limit on how many PDFs I can merge?',
        answer:
          'Practical limits come from your device memory, not a cloud quota. Very large batches may be slower on phones.',
      },
    ],
  },
  extract: {
    appName: 'Staypress — PDF to images',
    h1: 'Export PDF pages as images',
    intro:
      'Turn each page of a PDF into a JPG or PNG without uploading the file. Download pages one by one or grab a ZIP of the full set.',
    faqs: [
      {
        question: 'Is my PDF uploaded when I extract images?',
        answer:
          'No. Pages are rendered in the browser with pdf.js. Your PDF stays on this device.',
      },
      {
        question: 'Can I choose JPG or PNG?',
        answer:
          'Yes. Pick format (and JPG quality) before download. Each page can download alone, or take a multi-page ZIP.',
      },
      {
        question: 'How many pages can I export?',
        answer:
          'There is a soft warning above 40 pages and a hard cap at 150 pages so browsers stay responsive.',
      },
      {
        question: 'Does extract work offline after the page loads?',
        answer:
          'Once Staypress and its libraries are loaded, conversion does not need your files uploaded; a connection is only needed to load the app assets.',
      },
    ],
  },
  slim: {
    appName: 'Staypress — Slim PDF',
    h1: 'Compress a PDF without uploading',
    intro:
      'Rebuild a smaller PDF on your device with honest presets. See before/after size — when gains are tiny, Staypress tells you plainly.',
    faqs: [
      {
        question: 'Is this the same as Adobe Acrobat compression?',
        answer:
          'No. Staypress does a local rebuild (light repack or JPEG re-encode of pages). Results vary by file; some already-efficient PDFs barely shrink.',
      },
      {
        question: 'Does Slim upload my document?',
        answer:
          'No. Compression runs in the browser. Nothing is sent to a server for “cloud compress.”',
      },
      {
        question: 'Which preset should I pick?',
        answer:
          'Rebuild lightly keeps more original structure with less quality risk. Balanced and Smaller re-encode pages as JPEGs for clearer size wins when you can trade a bit of quality.',
      },
      {
        question: 'Will every PDF get smaller?',
        answer:
          'Not always. If the file is already compact, you’ll see little gain and Staypress will say so rather than exaggerate.',
      },
    ],
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
  const base = origin.replace(/\/+$/, '')
  if (path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

/** Absolute asset URL when origin is known; otherwise a root-relative path. */
export function resolveAssetUrl(assetPath: string, siteOrigin?: string): string {
  const path = assetPath.startsWith('/') ? assetPath : `/${assetPath}`
  const origin = (siteOrigin ?? '').replace(/\/+$/, '')
  return origin ? `${origin}${path}` : path
}

export function absoluteModeUrl(mode: SeoMode, origin: string): string {
  return absoluteUrl(MODE_SEO[mode].path, origin)
}

/** JSON-LD graph: WebApplication + FAQPage (FAQs are visible on idle tool pages). */
export function buildModeJsonLd(
  mode: SeoMode,
  siteOrigin?: string,
): Record<string, unknown> {
  const seo = MODE_SEO[mode]
  const page = MODE_PAGE_CONTENT[mode]
  const origin = (siteOrigin ?? '').replace(/\/+$/, '')
  const url = origin ? absoluteUrl(seo.path, origin) : seo.path
  const image = resolveAssetUrl(OG_IMAGE_PATH, origin || undefined)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: page.appName,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements:
          'Requires JavaScript. PDF and image processing runs client-side in the browser.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: seo.description,
        url,
        image,
        isAccessibleForFree: true,
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  }
}

/** Safe to embed inside a <script type="application/ld+json"> tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * Rewrite built index.html head tags for a given mode.
 * Used at build time so crawlers that skip JS still see the right meta.
 * Pass siteOrigin (VITE_SITE_URL) for absolute canonical, og:url, and og:image.
 */
export function injectModeSeoIntoHtml(
  html: string,
  mode: SeoMode,
  siteOrigin?: string,
): string {
  const seo = MODE_SEO[mode]
  const origin = (siteOrigin ?? '').replace(/\/+$/, '')
  const pageUrl = origin ? absoluteUrl(seo.path, origin) : seo.path
  const imageUrl = resolveAssetUrl(OG_IMAGE_PATH, origin || undefined)
  const jsonLd = serializeJsonLd(buildModeJsonLd(mode, origin || undefined))

  let out = html
  out = out.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${escapeHtml(seo.title)}</title>`,
  )
  out = replaceMetaContent(out, 'name', 'description', seo.description)
  out = replaceMetaContent(out, 'property', 'og:title', seo.ogTitle)
  out = replaceMetaContent(out, 'property', 'og:description', seo.ogDescription)
  out = replaceMetaContent(out, 'property', 'og:image', imageUrl)
  out = replaceMetaContent(out, 'property', 'og:image:type', OG_IMAGE_TYPE)
  out = replaceMetaContent(
    out,
    'property',
    'og:image:width',
    String(OG_IMAGE_WIDTH),
  )
  out = replaceMetaContent(
    out,
    'property',
    'og:image:height',
    String(OG_IMAGE_HEIGHT),
  )
  out = upsertMetaProperty(out, 'og:image:alt', OG_IMAGE_ALT)
  out = replaceMetaContent(out, 'name', 'twitter:title', seo.ogTitle)
  out = replaceMetaContent(out, 'name', 'twitter:description', seo.ogDescription)
  out = replaceMetaContent(out, 'name', 'twitter:image', imageUrl)
  out = upsertJsonLdScript(out, jsonLd)

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

const JSON_LD_SCRIPT_RE =
  /<script\b[^>]*\bid=["']staypress-jsonld["'][^>]*>[\s\S]*?<\/script>/i

function upsertJsonLdScript(html: string, json: string): string {
  const tag = `<script type="application/ld+json" id="staypress-jsonld">${json}</script>`
  if (JSON_LD_SCRIPT_RE.test(html)) {
    return html.replace(JSON_LD_SCRIPT_RE, tag)
  }
  return html.replace('</head>', `    ${tag}\n  </head>`)
}
