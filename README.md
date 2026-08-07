# Staypress

**Private PDF tools in your browser.** No account. No upload. Files stay put.

Staypress is a free, open-source, browser-based PDF toolkit: **images → PDF**, **merge**, **PDF → images**, and **slim**. Everything runs client-side.

A free product from **[Anchor Systems](https://anchorsystems.dev/)** — technology delivery that ships.

---

## Why Staypress

| | |
|---|---|
| **Private** | Conversion happens in your browser. Files are not uploaded for processing. |
| **Focused** | A tight toolkit — not a convert-everything mega-app. |
| **Practical** | Built for phone photos, documents, and local PDF workflows. |

---

## Features (now)

### Images → PDF

- Drag-and-drop or choose **JPG, PNG, WebP, GIF, HEIC**
- HEIC photos converted locally for preview + export
- Oversize images downscaled on export (caps memory on phones)
- Reorder pages · page size fit / A4 / US Letter · full-screen preview

### Merge PDFs

- Drop multiple PDFs · see page counts
- Reorder files · download one merged PDF
- **Arrange pages (advanced):** preview every page, reorder or remove pages, then merge
- Clear errors for password-protected / invalid files

### PDF → images

- One PDF in · each page rendered in the browser (pdf.js)
- Export as **JPG** (quality) or **PNG**
- Renders automatically on upload (and when format/quality changes)
- Download any single page · multi-page **ZIP** for all pages
- Soft warning above 40 pages · hard cap at 150 pages

### Slim PDF

- Honest in-browser rebuild — not Adobe-class compression
- **Rebuild lightly** — object streams / page copy (minimal quality risk)
- **Balanced / Smaller** — pages re-encoded as JPEGs for clearer size wins
- Before/after size + % change · clear feedback when gains are tiny

### Shared

- Mobile sticky download actions
- SEO routes: `/` (images → PDF), `/merge`, `/extract`, `/slim` (legacy `?mode=` still works)
- Per-mode title + meta; build emits HTML shells so crawlers see the right tags
- Soft credit to Anchor Systems

### Roadmap

Split / protect and other polish remain optional.  
Full plan: [docs/TOOLKIT_IMPLEMENTATION_PLAN.md](docs/TOOLKIT_IMPLEMENTATION_PLAN.md)

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

Static host only — no application backend required.

---

## Deploy

| | |
|---|---|
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |

Config included for **Vercel** (`vercel.json`), **Netlify** (`netlify.toml`), and Cloudflare Pages headers (`public/_headers`).

Optional env for absolute canonical / Open Graph URLs and `sitemap.xml`:

```bash
VITE_SITE_URL=https://your-domain.com npm run build
```

### Feedback form (email via Resend)

The footer **Feedback** dialog posts to `/api/feedback` (Vercel serverless) and emails bug / feature notes via [Resend](https://resend.com/). Set these in the Vercel project (Production + Preview):

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | API key from Resend |
| `FEEDBACK_TO_EMAIL` | Inbox that should receive reports (e.g. you@anchorsystems.dev) |
| `FEEDBACK_FROM_EMAIL` | Optional. Default: `Staypress <onboarding@resend.dev>`. Use a verified domain sender in production (e.g. `Staypress <feedback@yourdomain.com>`). |

Local testing needs the API route (`vercel dev`) or a deployed preview — plain `npm run dev` serves the UI only.

PDF conversion still never uploads your files; only the text the user types in the form is sent.

### Post-deploy smoke checklist

- [ ] Images mode: multi-image → PDF
- [ ] HEIC (iPhone) or clear error if unsupported
- [ ] Merge mode: 2+ PDFs → one file, reorder works
- [ ] Extract: auto render · per-page download · ZIP
- [ ] Slim: preset · before/after sizes
- [ ] Privacy line + no unexpected uploads of user files
- [ ] `/`, `/merge`, `/extract`, `/slim` load the right tool (and view-source meta matches)
- [ ] Old `?mode=merge` redirects/normalizes to `/merge`
- [ ] Feedback form sends email (Resend env set on Vercel)

---

## Project layout

```
api/
  feedback.ts             # Vercel: email bug / feature feedback via Resend
src/
  App.tsx                 # Shell, mode switch, footer
  modes/
    images/ImagesMode.tsx
    merge/MergeMode.tsx
    extract/ExtractMode.tsx
    compress/CompressMode.tsx
  components/             # Stage, ModeSwitcher, Viewer, Icons, FeedbackDialog
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

Staypress does **not** upload your images or PDFs for conversion. Generation, merge, extract, and slim run entirely in the browser.

---

## License

[MIT](LICENSE) © [Anchor Systems](https://anchorsystems.dev/)

You can use, modify, and redistribute Staypress freely. The privacy promise is easy to audit: no server for conversion — read the source.

---

## Credits

**Staypress** — an open-source tool from [**Anchor Systems**](https://anchorsystems.dev/).
