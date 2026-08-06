# Imprint — Images to PDF

Browser-based tool that combines images into a single PDF. **Files never leave your device.**

## Features

- Drag-and-drop or tap to upload JPG, PNG, WebP, and GIF
- Reorder pages by dragging thumbnails or using arrows
- Page size: fit image, A4, or US Letter
- Client-side PDF generation (no server upload)
- Mobile sticky download bar

## Local development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

`npm run build` outputs static files in `dist/` ready for any static host.

## Deploy (Phase 1)

Any static host works. Build command: `npm run build`. Publish directory: `dist`.

### Cloudflare Pages

1. Push this repo to GitHub (or upload `dist`).
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages**.
3. Connect the repo (or direct upload).
4. Settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 20 (or default)
5. Deploy. You’ll get a `*.pages.dev` URL.

### Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset should detect **Vite**.
3. Leave defaults (`npm run build` → `dist`).
4. Deploy. You’ll get a `*.vercel.app` URL.

### Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → import repo  
   **or** drag-and-drop the `dist` folder after `npm run build`.
2. If connecting a repo: build command `npm run build`, publish `dist`  
   (`netlify.toml` in this repo already sets this).
3. Deploy. You’ll get a `*.netlify.app` URL.

### Custom domain (when ready)

1. Buy a domain (Namecheap, Cloudflare Registrar, Google Domains transfer, etc.).
2. In your host’s dashboard → **Custom domains** → add domain.
3. Follow their DNS instructions (usually a CNAME or nameserver change).
4. In `index.html`, uncomment and set `canonical` + `og:url` to your domain.

### After go-live smoke test

On a real phone and desktop:

- [ ] Open the public URL over HTTPS
- [ ] Add multiple photos (camera roll on mobile)
- [ ] Reorder with arrows; expand viewer
- [ ] Download PDF and open it
- [ ] Confirm the privacy line is visible
- [ ] Share the link once and check the title/preview look sane

## Privacy

Imprint does not upload your images. PDF generation runs in the browser with [pdf-lib](https://pdf-lib.js.org/). There is no server-side processing of files.
