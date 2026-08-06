# Imprint

**Private PDF tools in your browser.** No account. No upload. No server.

Imprint is a free, browser-based toolkit starting with **images → PDF** and **merge PDFs**. Everything runs client-side.

A free product from **[Anchor Systems](https://anchorsystems.dev/)** — technology delivery that ships.

---

## Why Imprint

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

### Shared

- Mobile sticky download actions
- Deep links: `?mode=merge`, `?mode=extract` (images is default)
- Soft credit to Anchor Systems

### Roadmap

Slim PDF (compress) is planned next.  
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
- [pdf.js](https://mozilla.github.io/pdf.js/) (`pdfjs-dist`) — render pages for PDF → images
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

### Post-deploy smoke checklist

- [ ] Images mode: multi-image → PDF
- [ ] HEIC (iPhone) or clear error if unsupported
- [ ] Merge mode: 2+ PDFs → one file, reorder works
- [ ] Password PDF shows a clear error
- [ ] Privacy line + no unexpected uploads of user files

---

## Project layout

```
src/
  App.tsx                 # Shell, mode switch, footer
  modes/
    images/ImagesMode.tsx
    merge/MergeMode.tsx
    extract/ExtractMode.tsx
  components/             # Stage, ModeSwitcher, Viewer, Icons
  lib/
    images.ts             # HEIC + rasterize / downscale
    download.ts
    pdf/
      imagesToPdf.ts
      merge.ts
      extract.ts
      common.ts
docs/
  TOOLKIT_IMPLEMENTATION_PLAN.md
```

---

## Privacy

Imprint does **not** upload your images or PDFs for conversion. Generation and merge run entirely in the browser.

---

## License

Private / unlicensed source unless a `LICENSE` file is added to this repository. Contact [Anchor Systems](https://anchorsystems.dev/) for use outside personal evaluation if unclear.

---

## Credits

**Imprint** — a free tool from [**Anchor Systems**](https://anchorsystems.dev/).
