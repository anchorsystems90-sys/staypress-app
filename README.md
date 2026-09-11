# Bento Tools

**Useful tools. No signup. No nonsense.** Browser utilities that run on your device.

Bento Tools is a free, open-source suite from **[Anchor Systems](https://anchorsystems.dev/)**. The first families are private PDF tools, Word Unscrambler, text utilities, and a JSON formatter. Everything that touches your files, letters, or pasted text runs client-side.

`/` is the Bento Tools directory. Each utility has its own URL.

---

## Why Bento Tools

| | |
|---|---|
| **Private where it matters** | File conversion happens in your browser. Files are not uploaded for processing. |
| **Focused** | One immediate problem → one simple tool → instant result. |
| **Practical** | Built for phone photos, documents, letter jumbles, and local workflows. |

---

## Features (now)

### Images → PDF (`/images-to-pdf`)

- Drag-and-drop or choose **JPG, PNG, WebP, GIF, HEIC**
- HEIC photos converted locally for preview + export
- Oversize images downscaled on export (caps memory on phones)
- Reorder pages · page size fit / A4 / US Letter · full-screen preview

### Merge PDFs (`/merge`)

- Drop multiple PDFs · see page counts
- Reorder files · download one merged PDF
- **Arrange pages (advanced):** preview every page, reorder or remove pages, then merge
- Clear errors for password-protected / invalid files

### PDF → images (`/extract`)

- One PDF in · each page rendered in the browser (pdf.js)
- Export as **JPG** (quality) or **PNG**
- Renders automatically on upload (and when format/quality changes)
- Download any single page · multi-page **ZIP** for all pages
- Soft warning above 40 pages · hard cap at 150 pages

### Slim PDF (`/slim`)

- Honest in-browser rebuild — not Adobe-class compression
- **Rebuild lightly** — object streams / page copy (minimal quality risk)
- **Balanced / Smaller** — pages re-encoded as JPEGs for clearer size wins
- Before/after size + % change · clear feedback when gains are tiny

### Word Unscrambler (`/word-unscrambler`)

- Type letters and find valid English words you can make from them
- Filter by length · copy the result list
- Word list and matching stay in the browser

### Text Cleaner (`/text-cleaner`)

- Paste messy text and tidy it in the browser
- Trim, collapse spaces, tabs → spaces, strip HTML, drop blank or duplicate lines
- Copy or download the cleaned result

### Case Converter (`/case-converter`)

- UPPERCASE, lowercase, Title Case, sentence case
- camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE
- Copy or download — nothing is uploaded

### JSON Formatter (`/json-formatter`)

- Pretty-print, minify, and validate JSON locally
- Parse errors stay on the page; invalid JSON is not rewritten
- Copy or download a `.json` file

### Shared

- Mobile sticky download actions on PDF tools
- SEO routes: `/` (directory), `/images-to-pdf`, `/merge`, `/extract`, `/slim`, `/word-unscrambler`, `/text-cleaner`, `/case-converter`, `/json-formatter` (`/images` 301s to `/images-to-pdf`; legacy `?mode=` still works for PDF tools)
- Per-tool title + meta; build emits HTML shells so crawlers see the right tags
- Soft credit to Anchor Systems

### Roadmap

PDF split / protect remain optional.  
Product context: [BENTO_TOOLS_CONTEXT.md](BENTO_TOOLS_CONTEXT.md)  
PDF toolkit plan (historical): [docs/TOOLKIT_IMPLEMENTATION_PLAN.md](docs/TOOLKIT_IMPLEMENTATION_PLAN.md)  
SEO: [docs/SEO_IMPLEMENTATION_PLAN.md](docs/SEO_IMPLEMENTATION_PLAN.md)

---

## Quick start

**Requirements:** Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server (Vite) |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Tech stack

- [React](https://react.dev/) 19 + TypeScript
- [Vite](https://vite.dev/) 6
- [pdf-lib](https://pdf-lib.js.org/) — create & merge PDFs in the browser
- [pdf.js](https://mozilla.github.io/pdf.js/) (`pdfjs-dist`) — render pages for PDF → images / slim
- [JSZip](https://stuk.github.io/jszip/) — multi-page image downloads
- [heic2any](https://github.com/alexcorvi/heic2any) — client-side HEIC conversion

Static host only — no application backend required for tools.

---

## Deploy

| | |
|---|---|
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |

Config included for **Vercel** (`vercel.json`), **Netlify** (`netlify.toml`), and Cloudflare Pages headers (`public/_headers`).

### Production SEO (required for absolute URLs)

Set on the host’s **Production** environment (not Preview), then rebuild:

```bash
VITE_SITE_URL=https://your-canonical-domain.com
```

That makes the build emit:

| Artifact | Purpose |
|----------|---------|
| Absolute `canonical` + `og:url` on tool paths + `/privacy` + `/guides/heic-to-pdf` | Correct indexing + shares |
| Absolute `og:image` / `twitter:image` → `/og.png` (1200×630) | Social cards |
| `sitemap.xml` | Submit in Google Search Console |
| `robots.txt` `Sitemap:` line | Points crawlers at the sitemap |

**Ops checklist (once domain is final):**

1. Pick one canonical host (apex or `www`); 301 the other  
2. `VITE_SITE_URL` on Production only  
3. Deploy and view-source each tool path — absolute URLs present  
4. [Google Search Console](https://search.google.com/search-console) → verify property → submit `https://your-domain/sitemap.xml`  
5. Optional: re-scrape OG on [opengraph.xyz](https://www.opengraph.xyz/) or Facebook Debugger  

Full SEO roadmap: [docs/SEO_IMPLEMENTATION_PLAN.md](docs/SEO_IMPLEMENTATION_PLAN.md).

Local/preview builds without `VITE_SITE_URL` still work; meta images stay root-relative (`/og.png`).

### Feedback form (email via Resend)

The footer **Feedback** dialog posts to `/api/feedback` (Vercel serverless) and emails bug / feature notes via [Resend](https://resend.com/). Set these in the Vercel project (Production + Preview):

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | API key from Resend |
| `FEEDBACK_TO_EMAIL` | Inbox that should receive reports (e.g. you@anchorsystems.dev) |
| `FEEDBACK_FROM_EMAIL` | Optional. Default: `Bento Tools <onboarding@resend.dev>`. Use a verified domain sender in production (e.g. `Bento Tools <feedback@yourdomain.com>`). |

Local testing needs the API route (`vercel dev`) or a deployed preview — plain `npm run dev` serves the UI only.

Tools still never upload your files or letters; only the text the user types in the form is sent.

### Post-deploy smoke checklist

- [ ] Images mode: multi-image → PDF
- [ ] HEIC (iPhone) or clear error if unsupported
- [ ] Merge mode: 2+ PDFs → one file, reorder works
- [ ] Extract: auto render · per-page download · ZIP
- [ ] Slim: preset · before/after sizes
- [ ] Word Unscrambler: letters → words · copy
- [ ] Text Cleaner / Case Converter / JSON Formatter: paste → copy locally
- [ ] Privacy line + no unexpected uploads of user files
- [ ] `/`, `/images-to-pdf`, `/merge`, `/extract`, `/slim`, `/word-unscrambler`, `/text-cleaner`, `/case-converter`, `/json-formatter`, `/privacy`, `/guides/heic-to-pdf` load correctly
- [ ] `/images` 301s to `/images-to-pdf`
- [ ] Production: absolute canonical + `og:image` when `VITE_SITE_URL` set
- [ ] `/og.png` loads; social debugger shows Bento Tools card
- [ ] `sitemap.xml` includes tools + privacy + Search Console
- [ ] Old `?mode=merge` redirects/normalizes to `/merge`
- [ ] Feedback form sends email (Resend env set on Vercel)

---

## Project layout

```
api/
  feedback.ts             # Vercel: email bug / feature feedback via Resend
src/
  App.tsx                 # Shell, homepage, PDF mode switch, footer
  toolCatalog.ts          # Directory metadata + PDF family vs standalone tools
  pages/
    HomePage.tsx
    PrivacyPage.tsx
  modes/                  # PDF family
    images/ImagesMode.tsx
    merge/MergeMode.tsx
    extract/ExtractMode.tsx
    compress/CompressMode.tsx
  tools/
    word-unscrambler/     # Lazy-loaded standalone tools
    text-cleaner/
    case-converter/
    json-formatter/
  components/             # Stage, ModeSwitcher, Viewer, Icons, FeedbackDialog, SeoIdleContent
  lib/
    images.ts             # HEIC + rasterize / downscale
    download.ts
    pdf/
      imagesToPdf.ts
      merge.ts
      extract.ts
      compress.ts
      common.ts
docs/
  TOOLKIT_IMPLEMENTATION_PLAN.md
```

---

## Privacy

Bento Tools does **not** upload your images, PDFs, letters, or pasted text for processing. Generation, merge, extract, slim, word matching, text cleanup, case conversion, and JSON formatting run entirely in the browser.

---

## License

[MIT](LICENSE) © [Anchor Systems](https://anchorsystems.dev/)

You can use, modify, and redistribute Bento Tools freely. The privacy promise is easy to audit: no server for conversion — read the source.

---

## Credits

**Bento Tools** — an open-source product from [**Anchor Systems**](https://anchorsystems.dev/).
