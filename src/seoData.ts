/** Site-level product name (chrome, titles, JSON-LD). */
export const SITE_NAME = 'Bento Tools'

export const GITHUB_REPO = 'https://github.com/anchorsystems90-sys/staypress-app'

export const DEFAULT_FOOTER_PRIVACY =
  'No account. No upload. Everything runs on this device.'

/** SEO-only tool ids — PDF modes plus standalone tools. Kept free of DOM types so Vite can import this. */
export type SeoMode =
  | 'images'
  | 'merge'
  | 'extract'
  | 'slim'
  | 'word-unscrambler'
  | 'text-cleaner'
  | 'case-converter'
  | 'json-formatter'

/** Default share-card image (1200×630 PNG in /public). */
export const OG_IMAGE_PATH = '/og.png'
export const OG_IMAGE_TYPE = 'image/png'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_ALT =
  'Bento Tools — useful browser tools. No signup. Files stay on your device where the tool runs locally.'

export const HOME_PATH = '/'

export const HOME_SEO = {
  path: HOME_PATH,
  title: 'Bento Tools — simple tools in your browser',
  description:
    'Simple tools that work in your browser. Convert images to PDF, clean and convert text, format JSON, unscramble words — free, no account.',
  ogTitle: 'Bento Tools',
  ogDescription: 'Simple tools that work in your browser. No signup. No nonsense.',
}

export type ModeSeo = {
  /** URL path for this tool. */
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
    path: '/images-to-pdf',
    title: 'Images to PDF — Private, no upload | Bento Tools',
    description:
      'Convert JPG, PNG, WebP, GIF, and HEIC to PDF in your browser. Free, no account, and files never leave your device.',
    ogTitle: 'Images to PDF — private, no upload',
    ogDescription:
      'Drop photos and get a PDF. Bento Tools runs entirely on your device — nothing is uploaded.',
  },
  merge: {
    path: '/merge',
    title: 'Merge PDFs privately — no upload | Bento Tools',
    description:
      'Combine multiple PDFs into one file in your browser. Reorder pages, free, no account — files never leave your device.',
    ogTitle: 'Merge PDFs privately — no upload',
    ogDescription:
      'Combine PDFs locally. Bento Tools merges on your device — nothing is uploaded.',
  },
  extract: {
    path: '/extract',
    title: 'PDF to Images — Convert Pages to JPG or PNG | Bento Tools',
    description:
      'Convert PDF pages to JPG or PNG in your browser. Download individual pages or a ZIP — free, private, no upload.',
    ogTitle: 'PDF to images — convert pages locally',
    ogDescription:
      'Turn each PDF page into a JPG or PNG on your device. Bento Tools never uploads your file.',
  },
  slim: {
    path: '/slim',
    title: 'Compress PDF in Your Browser — Private, No Upload | Bento Tools',
    description:
      'Compress a PDF in your browser with honest local rebuild options. Reduce file size without uploading — free, private, results vary by file.',
    ogTitle: 'Compress PDF in your browser — no upload',
    ogDescription:
      'Browser-based PDF compression on your device. Bento Tools does not upload your file.',
  },
  'word-unscrambler': {
    path: '/word-unscrambler',
    title: 'Word Unscrambler — find words from letters | Bento Tools',
    description:
      'Unscramble letters into valid English words in your browser. Use ? blanks and starts/contains/ends filters — free, private, no upload.',
    ogTitle: 'Word Unscrambler — find words from letters',
    ogDescription:
      'Unscramble letters with optional blanks and filters. Bento Tools runs the search on your device.',
  },
  'text-cleaner': {
    path: '/text-cleaner',
    title: 'Text Cleaner — tidy messy text in your browser | Bento Tools',
    description:
      'Remove extra spaces, blank lines, HTML, and duplicate lines in your browser. Free, no account — your text never leaves this device.',
    ogTitle: 'Text Cleaner — tidy messy text locally',
    ogDescription:
      'Paste messy text and clean it on this device. Bento Tools does not upload what you paste.',
  },
  'case-converter': {
    path: '/case-converter',
    title: 'Case Converter — UPPER, title, camelCase & more | Bento Tools',
    description:
      'Convert text to uppercase, lowercase, Title Case, sentence case, camelCase, snake_case, and kebab-case in your browser. Free, no upload.',
    ogTitle: 'Case Converter — change case locally',
    ogDescription:
      'Switch case styles instantly on this device. Bento Tools never uploads your text.',
  },
  'json-formatter': {
    path: '/json-formatter',
    title: 'JSON Formatter — pretty-print & minify locally | Bento Tools',
    description:
      'Format, minify, and validate JSON in your browser. Free, no account — your data never leaves this device.',
    ogTitle: 'JSON Formatter — pretty-print locally',
    ogDescription:
      'Pretty-print or minify JSON on this device. Bento Tools does not upload your data.',
  },
}

export const MODE_PAGE_CONTENT: Record<SeoMode, ModePageContent> = {
  images: {
    appName: 'Bento Tools — Images to PDF',
    h1: 'Convert images to PDF privately',
    intro:
      'Drop JPG, PNG, WebP, GIF, or HEIC photos and build a PDF in the browser. Free, no account, and files are never uploaded for conversion.',
    faqs: [
      {
        question: 'Are my photos uploaded to a server?',
        answer:
          'No. Bento Tools converts images to PDF entirely in your browser. Your photos stay on this device unless you choose to download the finished PDF.',
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
        question: 'Is Bento Tools free?',
        answer:
          'Yes. The Images → PDF tool is free to use with no account required.',
      },
    ],
  },
  merge: {
    appName: 'Bento Tools — Merge PDFs',
    h1: 'Merge PDFs in your browser',
    intro:
      'Combine multiple PDF files into one local merge. Reorder files or pages, free of charge — nothing is uploaded to process your documents.',
    faqs: [
      {
        question: 'Do merged PDFs leave my device?',
        answer:
          'No. Merging runs in your browser with pdf-lib. Bento Tools does not upload your PDFs for the merge.',
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
    appName: 'Bento Tools — PDF to images',
    h1: 'Convert PDF pages to images',
    intro:
      'Turn each page of a PDF into a JPG or PNG image in your browser. Export pages one by one, or download a ZIP of every page — nothing is uploaded to convert the file.',
    faqs: [
      {
        question: 'Does converting a PDF to images upload my file?',
        answer:
          'No. Pages are rendered locally with pdf.js. The PDF stays on this device.',
      },
      {
        question: 'Can I export PDF pages as JPG or PNG?',
        answer:
          'Yes. Choose JPG or PNG (and JPG quality). Download one page, or a ZIP of all pages.',
      },
      {
        question: 'Does this extract pictures embedded inside the PDF?',
        answer:
          'No. It converts each PDF page into an image of that page — useful for screenshots, slides, or sharing pages as JPG/PNG.',
      },
      {
        question: 'How many pages can I convert?',
        answer:
          'There is a soft warning above 40 pages and a hard cap at 150 pages so browsers stay responsive.',
      },
      {
        question: 'Does it work offline after the page loads?',
        answer:
          'Once Bento Tools and its libraries are loaded, conversion does not need your files uploaded; a connection is only needed to load the app assets.',
      },
    ],
  },
  slim: {
    appName: 'Bento Tools — Slim PDF',
    h1: 'Compress a PDF in your browser',
    intro:
      'Reduce PDF size with a browser-based rebuild on this device. Pick how aggressive to go, compare before and after, and download the result — nothing is uploaded. Some already-efficient PDFs only shrink a little.',
    faqs: [
      {
        question: 'Is this a browser-based PDF compressor?',
        answer:
          'Yes. Compression runs locally in your browser. It is not a cloud upload compressor, and it is not the same as Adobe Acrobat’s advanced desktop or server engines.',
      },
      {
        question: 'Does Slim upload my document?',
        answer:
          'No. Nothing is sent to a server for “cloud compress.” Your PDF stays on this device.',
      },
      {
        question: 'Which preset should I pick?',
        answer:
          'Rebuild lightly keeps more original structure with less quality risk. Balanced and Smaller re-encode pages as JPEGs for clearer size wins when you can trade a bit of quality.',
      },
      {
        question: 'Will every PDF get smaller?',
        answer:
          'Not always. If the file is already compact, you’ll see little gain and Bento Tools will say so rather than exaggerate.',
      },
    ],
  },
  'word-unscrambler': {
    appName: 'Bento Tools — Word Unscrambler',
    h1: 'Unscramble letters into words',
    intro:
      'Type a jumble of letters and get valid English words you can make from them. Use ? for an unknown letter, and optionally filter by starts with, contains, or ends with — free, no account, all in your browser.',
    faqs: [
      {
        question: 'Are my letters sent to a server?',
        answer:
          'No. Word Unscrambler matches letters against a word list in your browser. Nothing you type is uploaded to find results.',
      },
      {
        question: 'Does it find partial words or only exact anagrams?',
        answer:
          'It finds every dictionary word that can be spelled with the letters you entered, including shorter words that do not use every letter.',
      },
      {
        question: 'What does ? mean?',
        answer:
          'Each ? is one blank tile — an unknown letter. You can use up to two blanks. For example, c?t can match cat, cot, or cut.',
      },
      {
        question: 'Can I filter the results?',
        answer:
          'Yes. Choose a word length, and open More filters for starts with, contains, and ends with. Filters only keep words you can still build from your letters (and blanks).',
      },
      {
        question: 'Is the Word Unscrambler free?',
        answer:
          'Yes. It is a free Bento Tools utility with no account required.',
      },
    ],
  },
  'text-cleaner': {
    appName: 'Bento Tools — Text Cleaner',
    h1: 'Clean messy text in your browser',
    intro:
      'Paste copied text and tidy it locally: extra spaces, blank lines, HTML tags, tabs, and duplicate lines. Free, no account — nothing is uploaded to process it.',
    faqs: [
      {
        question: 'Is the text I paste uploaded?',
        answer:
          'No. Cleaning runs in this browser tab. Bento Tools does not send your text to a server to transform it.',
      },
      {
        question: 'What can Text Cleaner do?',
        answer:
          'You can trim lines, collapse extra spaces, turn tabs into spaces, strip simple HTML, drop blank or duplicate lines, and remove special characters. Turn options on or off as you need them.',
      },
      {
        question: 'Does it change my original clipboard?',
        answer:
          'Not until you copy or download the result. The original paste stays in the input box.',
      },
      {
        question: 'Is Text Cleaner free?',
        answer:
          'Yes. It is a free Bento Tools utility with no account required.',
      },
    ],
  },
  'case-converter': {
    appName: 'Bento Tools — Case Converter',
    h1: 'Convert text case in your browser',
    intro:
      'Switch between UPPERCASE, lowercase, Title Case, sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE. The conversion stays on this device.',
    faqs: [
      {
        question: 'Does Case Converter upload my text?',
        answer:
          'No. Case changes run in your browser. Nothing you type is sent away to convert it.',
      },
      {
        question: 'What is the difference between Title Case and PascalCase?',
        answer:
          'Title Case keeps spaces and capitalizes each word. PascalCase, camelCase, snake_case, and kebab-case rebuild identifier-style names from the words in your text.',
      },
      {
        question: 'Can I copy the result?',
        answer:
          'Yes. Copy puts the converted text on your clipboard. Download saves a .txt file.',
      },
      {
        question: 'Is Case Converter free?',
        answer:
          'Yes. It is a free Bento Tools utility with no account required.',
      },
    ],
  },
  'json-formatter': {
    appName: 'Bento Tools — JSON Formatter',
    h1: 'Format JSON without uploading',
    intro:
      'Pretty-print, minify, and validate JSON locally. If the text is invalid, you get a parse error instead of a silent rewrite. Free, no account.',
    faqs: [
      {
        question: 'Is my JSON sent to a server?',
        answer:
          'No. Formatting and validation use the JSON parser in your browser. The payload stays on this device.',
      },
      {
        question: 'What happens if the JSON is invalid?',
        answer:
          'The formatter shows the parse error and leaves your text as it is. Fix the issue, then format or minify again.',
      },
      {
        question: 'Does it sort object keys?',
        answer:
          'No. Pretty-print and minify keep key order as the browser parsed it.',
      },
      {
        question: 'Is the JSON Formatter free?',
        answer:
          'Yes. It is a free Bento Tools utility with no account required.',
      },
    ],
  },
}

/** Indexable tool routes (home is `/`). */
export const SEO_SHELL_MODES = Object.keys(MODE_SEO) as SeoMode[]

export function pathForMode(mode: SeoMode): string {
  return MODE_SEO[mode].path
}

const PATH_ALIASES: Record<string, SeoMode> = {
  '/images': 'images',
  '/compress': 'slim',
}

export function toolFromPathname(pathname: string): SeoMode | null {
  const raw = pathname.split('?')[0] ?? '/'
  const normalized = raw.replace(/\/+$/, '') || '/'

  const aliased = PATH_ALIASES[normalized]
  if (aliased) return aliased

  for (const id of SEO_SHELL_MODES) {
    if (MODE_SEO[id].path === normalized) return id
  }
  return null
}

/** @deprecated Prefer toolFromPathname. Unknown paths are not Images. */
export function modeFromPathname(pathname: string): SeoMode {
  return toolFromPathname(pathname) ?? 'images'
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

export function absoluteHomeUrl(origin: string): string {
  return absoluteUrl(HOME_PATH, origin)
}

export function absoluteModeUrl(mode: SeoMode, origin: string): string {
  return absoluteUrl(MODE_SEO[mode].path, origin)
}

export function buildHomeJsonLd(siteOrigin?: string): Record<string, unknown> {
  const origin = (siteOrigin ?? '').replace(/\/+$/, '')
  const url = origin ? absoluteUrl(HOME_PATH, origin) : HOME_PATH
  const image = resolveAssetUrl(OG_IMAGE_PATH, origin || undefined)
  const modes = Object.keys(MODE_SEO) as SeoMode[]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url,
        description: HOME_SEO.description,
        image,
      },
      {
        '@type': 'ItemList',
        name: `${SITE_NAME} tools`,
        itemListElement: modes.map((mode, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: MODE_PAGE_CONTENT[mode].appName,
          url: origin ? absoluteModeUrl(mode, origin) : MODE_SEO[mode].path,
        })),
      },
    ],
  }
}

/** Site content pages (not tool modes). */
export type ContentPageId = 'privacy' | 'heic-to-pdf'

export type ContentPageSeo = {
  path: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  /** Short header line above the article (below mode switch). */
  tagline: string
  footerLabel: string
}

export const CONTENT_PAGE_SEO: Record<ContentPageId, ContentPageSeo> = {
  privacy: {
    path: '/privacy',
    title: 'Privacy & about — Bento Tools',
    description:
      'How Bento Tools keeps files and letters on your device. What never leaves the browser, what optional network features exist, and who builds the product.',
    ogTitle: 'Privacy & about — Bento Tools',
    ogDescription:
      'Browser tools that run on your device. Files are not uploaded for conversion — learn what that means and what optional services still contact the network.',
    tagline: 'How private processing works — and what still uses the network.',
    footerLabel: 'Privacy',
  },
  'heic-to-pdf': {
    path: '/guides/heic-to-pdf',
    title: 'Convert HEIC to PDF in the browser — no upload | Bento Tools',
    description:
      'Turn iPhone HEIC photos into a PDF on your device. Free Bento Tools guide: private, no account, nothing uploaded for conversion.',
    ogTitle: 'Convert HEIC to PDF privately — no upload',
    ogDescription:
      'iPhone HEIC photos → one PDF in the browser. Bento Tools keeps files on your device — no cloud convert step.',
    tagline: 'iPhone photos to PDF — privately, in the browser.',
    footerLabel: 'Guide',
  },
}

/** Indexable content pages. */
export const CONTENT_PAGE_SHELLS: ContentPageId[] = ['privacy', 'heic-to-pdf']

export function contentPageFromPathname(pathname: string): ContentPageId | null {
  const raw = pathname.split('?')[0] ?? '/'
  const normalized = raw.replace(/\/+$/, '') || '/'
  if (normalized === '/privacy') return 'privacy'
  if (normalized === '/guides/heic-to-pdf') return 'heic-to-pdf'
  return null
}

export function absoluteContentPageUrl(
  page: ContentPageId,
  origin: string,
): string {
  return absoluteUrl(CONTENT_PAGE_SEO[page].path, origin)
}

export function buildContentPageJsonLd(
  page: ContentPageId,
  siteOrigin?: string,
): Record<string, unknown> {
  const seo = CONTENT_PAGE_SEO[page]
  const origin = (siteOrigin ?? '').replace(/\/+$/, '')
  const url = origin ? absoluteUrl(seo.path, origin) : seo.path
  const image = resolveAssetUrl(OG_IMAGE_PATH, origin || undefined)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.ogTitle,
    description: seo.description,
    url,
    image,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: origin ? absoluteUrl('/', origin) : '/',
    },
    about: {
      '@type': 'WebApplication',
      name: SITE_NAME,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  }
}

/** JSON-LD graph: WebApplication + FAQPage (FAQs are visible on tool pages). */
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
          'Requires JavaScript. Processing runs client-side in the browser.',
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

/** Canonical paths for sitemap.xml (no aliases or redirects). */
export function canonicalSitemapPaths(): string[] {
  return [
    HOME_PATH,
    ...SEO_SHELL_MODES.map((mode) => MODE_SEO[mode].path),
    ...CONTENT_PAGE_SHELLS.map((page) => CONTENT_PAGE_SEO[page].path),
  ]
}
