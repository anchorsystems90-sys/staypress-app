# Imprint — Private PDF Toolkit Implementation Plan

> **Product stance:** A tight private PDF toolkit. Not infinite formats, not a cloud convert farm.  
> **Positioning:** Files never leave the device · craft over feature count · soft credit to [Anchor Systems](https://anchorsystems.dev/).  
> **Last updated:** 2026-08-06

---

## 1. Product goal

Turn Imprint into a **small set of private, browser-only PDF tools** that share one brand story: *files never leave the device*.

| What | Description |
|------|-------------|
| **Shipped core (today)** | Images → PDF (page size, reorder, privacy) |
| **Toolkit target** | Images → PDF · Merge · PDF → images · Compress · optional Split / Protect |
| **Non-goals** | Office → PDF, OCR, eSign, accounts, server processing, “every format,” mega-tool SEO clones |

**Success for the product phase:** People find Imprint useful, complete a job, remember the privacy claim, and optionally click through to Anchor Systems. Monetization is deferred until usage is real.

---

## 2. Why this shape (not a convert-everything app)

| Approach | Score for Imprint |
|----------|-------------------|
| Small suite of related PDF jobs, all client-side | **High** — clear story, shareable, brand-consistent |
| More input image types (HEIC, better mobile photos) | **High** — same product, fewer hard fails |
| Full iLovePDF-style suite (20 tools) | **Low** — build cost, no moat vs free giants |
| Server conversion for “all formats” | **Low** — kills privacy hook + hosting liability |

**Principle:** Expand the private PDF *lane*, not arbitrary formats.

---

## 3. Product shape (UX)

Stay on **one SPA**. Mode switch only — no separate marketing landing + app route (unless Phase 4 SEO demands it).

```
┌─────────────────────────────────────────────┐
│  Imprint                          [mode ▾]  │
│  Private · nothing leaves this device       │
├─────────────────────────────────────────────┤
│                                             │
│           Mode-specific workspace           │
│           (drop · queue · options · save)   │
│                                             │
├─────────────────────────────────────────────┤
│  Privacy line                               │
│  A free tool from Anchor Systems →          │
└─────────────────────────────────────────────┘
```

### 3.1 Modes

| Mode ID | Name (UI) | Job | Primary input | Output |
|---------|-----------|-----|---------------|--------|
| `images` | Images → PDF | Photos / screenshots → one PDF | Images | `.pdf` |
| `merge` | Merge PDFs | Combine files in order | PDFs | `.pdf` |
| `extract` | PDF → images | One page = one image | One PDF | `.zip` (or single image) |
| `compress` | Slim PDF | Smaller file, still local | One PDF | `.pdf` |
| `split` | Split PDF *(later)* | Page range or every page | One PDF | `.pdf`(s) |
| `protect` | Protect PDF *(later)* | Password encryption | One PDF | `.pdf` |

**UI rules**

- At most **3–4 modes visible** until post-launch feedback.
- Mode control: segmented control or compact select — **not** a grid of 12 tool cards.
- Each mode keeps: one stage, one primary CTA, privacy language unchanged.
- Empty states stay showcase-quality (brand first, not dashboard chrome).

### 3.2 Mode copy (sparse)

| Mode | Stage title | Hint |
|------|-------------|------|
| Images | Drop images here | Private · JPG, PNG, WebP, HEIC… |
| Merge | Drop PDFs here | Private · combine in order |
| Extract | Drop a PDF here | Private · each page becomes an image |
| Compress | Drop a PDF here | Private · rebuild a smaller file |

---

## 4. Architecture

### 4.1 Current baseline

- Vite + React + TypeScript
- `pdf-lib` for PDF creation
- Client-side only (`src/lib/pdf.ts`, `src/App.tsx`)
- Lazy-loaded PDF generation on download
- Static deploy (no backend)

### 4.2 Target structure

```
src/
  types.ts                      # modes, shared queue types
  App.tsx                       # shell: brand, mode switch, footer
  App.css                       # shell + shared workspace styles
  modes/
    images/
      ImagesMode.tsx            # current flow extracted
    merge/
      MergeMode.tsx
    extract/
      ExtractMode.tsx
    compress/
      CompressMode.tsx
  lib/
    download.ts                 # downloadPdf, downloadBlob, downloadZip
    images.ts                   # HEIC path, canvas encode, revoke helpers
    pdf/
      common.ts                 # loadPdf, pageCount, friendly errors
      imagesToPdf.ts            # existing images → PDF
      merge.ts
      extract.ts
      compress.ts
  components/
    Stage.tsx                   # drop / browse shell (accept, titles, onFiles)
    PageGrid.tsx                # reorder UI (images + merge)
    Toolbar.tsx
    StickyCta.tsx
    ModeSwitcher.tsx
  index.css
  main.tsx
```

### 4.3 Design principles

1. **Lazy-load** heavy deps per mode (`pdf-lib`, heic helper, pdf.js, jszip).
2. **Shared Stage + privacy** copy; only workspace body changes by mode.
3. **Human errors** for memory, corrupt PDF, unsupported or passworded files.
4. **No server** while privacy is the brand non-negotiable.
5. **Mode in UI state first**; optional `?mode=merge` later for shareable deep links / SEO.

### 4.4 Shared types (sketch)

```ts
export type AppMode = 'images' | 'merge' | 'extract' | 'compress'

export type QueueItem = {
  id: string
  file: File
  name: string
  url?: string        // preview when useful
  pageCount?: number  // PDFs
}

export type PageSize = 'fit' | 'a4' | 'letter' // images mode
```

---

## 5. Phased delivery

### Phase 0 — Foundation

**Why:** Mode work stays cheap; UI stays consistent.

| Task | Detail |
|------|--------|
| Mode shell | `AppMode`, `ModeSwitcher`, idle copy not locked to “images only” |
| Split libs | `download.ts`, `imagesToPdf.ts`, `pdf/common.ts` |
| Extract ImagesMode | Move queue / generate / viewer into mode component |
| Shared Stage | Props: `accept`, titles, hints, `onFiles`, `compact` |
| Optional query | Ready for `?mode=images` later |
| Regression | Full existing images → PDF path unchanged |

**Exit criteria**

- [ ] Behavior matches today’s shipping product
- [ ] Structure allows a second mode without rewriting App
- [ ] `npm run build` clean; chunking still sane

**Estimate:** 0.5–1 day

---

### Phase 1 — Toolkit v1: Stronger images + Merge

Ship the first *suite*. Deploy after this phase.

#### 1A — Better Images → PDF

| Item | Approach | Notes |
|------|----------|--------|
| HEIC / HEIF | Detect type/extension; decode via `heic2any` or browser `createImageBitmap` when available | Dynamic import; fail with clear message |
| Accept + hints | Update file input `accept` and stage copy | JPG, PNG, WebP, GIF, HEIC |
| Optional downscale | Cap max dimension before embed | Reduces mobile OOM |
| Progress labels | “Converting HEIC…” / “Making PDF…” | Extend busy state |

#### 1B — Merge PDFs

| Item | Approach |
|------|----------|
| Input | Multi-PDF drop; reorder list (name + page count) |
| Engine | `PDFDocument.load` → `copyPages` → assemble (`pdf-lib`) |
| Passworded PDFs | Clear error: not supported yet (protect mode later) |
| Output | `imprint-merged-YYYY-MM-DD.pdf` |
| Large batches | Sequential load; memory-friendly errors |

**Exit criteria**

- [ ] Switch modes without full reload
- [ ] Merge 2–10 PDFs, reorder, download
- [ ] HEIC works or fails gracefully on iOS Safari
- [ ] Privacy footer + Anchor CTA correct
- [ ] Network tab: no file uploads during convert

**Estimate:** 2–3 days  
**Deploy:** After Phase 1 smoke tests on desktop + phone

---

### Phase 2 — PDF → images (Extract)

Completes the private document loop.

| Item | Approach |
|------|----------|
| Render | `pdfjs-dist` → canvas per page |
| Format | JPG (default) or PNG; quality control for JPG |
| Bundle | Multi-page → ZIP via `jszip`; single page → one image |
| Performance | Sequential render; soft limit / range for long docs |
| Loading | Lazy import pdf.js worker only in Extract mode |

**Risks**

- Bundle size → code-split
- Mobile memory on long PDFs → page range or cap + message

**Exit criteria**

- [x] ~10-page PDF → zip of page images on desktop _(code path; manual smoke left)_
- [ ] Mid-range phone path works or clearly errors _(manual)_
- [x] Images + Merge regression green _(build)_

**Estimate:** 2–3 days

---

### Phase 3 — Slim PDF (Compress)

| Option | Approach | Recommendation |
|--------|----------|----------------|
| A | Best-effort re-encode of image-heavy PDFs | Prefer for “scans / photos PDF” cases |
| B | Honest v1: rebuild with object streams + optional re-embed quality | **Start here** |
| C | WASM Ghostscript-class tools | Only if B is weak and demand is real |

**Messaging:** “Reduce size” / “Slim PDF” — never claim Adobe-level magic.

**Exit criteria**

- [x] Size often drops on photo/scan PDFs _(Balanced / Smaller paths)_
- [x] Already-compact files: clear “little to gain” style feedback when appropriate

**Estimate:** 1–2 days for honest v1

---

### Phase 4 — Optional polish (only after feedback)

| Feature | When to add |
|---------|-------------|
| Split (range / every page) | Users ask to pull page ranges |
| Password protect | pdf-lib encryption; privacy-adjacent request |
| `?mode=` SEO / share links | After deploy + basic analytics |
| Web Worker for heavy jobs | UI freezes on real user files |
| PWA install prompt | Real mobile return traffic |

Do **not** start Phase 4 before Toolkit v1 is public and used.

---

## 6. Dependencies

| Package | Phase | Purpose | Load |
|---------|-------|---------|------|
| `pdf-lib` | existing + 1–3 | Create, merge, protect, rebuild | Lazy on generate |
| HEIC helper (`heic2any` or equivalent) | 1A | Phone photo decode | Lazy on HEIC only |
| `pdfjs-dist` | 2 | Render pages to canvas | Lazy in Extract |
| `jszip` | 2 | Multi-image download | Lazy in Extract |
| (none new preferred for compress v1) | 3 | pdf-lib + canvas | — |

Prefer dynamic `import()` so the default Images path stays as light as practical.

---

## 7. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Memory on mobile | Sequential processing, optional downscale, page caps, clear errors |
| HEIC browser differences | Feature-detect; user-facing fallback message |
| pdf.js worker + Vite paths | Prove worker URL in Extract spike before full UI |
| Scope creep | Cap public modes at 2 until post Phase-1 deploy; 3 after Extract |
| Competing on SEO feature lists | Always lead with **private / no upload** per mode |
| Password PDFs | Explicit unsupported message until Protect mode |

---

## 8. Testing plan

### 8.1 Manual matrix (each phase)

| Surface | Checks |
|---------|--------|
| Chrome desktop | Happy path each mode |
| Safari iOS | Photos library, HEIC, multi-image, sticky CTA |
| Android Chrome | Photos, merge, download |
| Privacy | DevTools network: no user file uploads |
| Regression | Prior modes still work |

### 8.2 Sample fixtures (keep locally, don’t commit private docs)

- 3 JPEGs, 1 PNG, 1 WebP  
- 1 HEIC from iPhone  
- 2–3 multi-page PDFs for merge  
- 1 large image batch (mobile stress)  
- 1 password PDF (expect failure message)

### 8.3 Automation

- Phase 0–1: build + manual is enough  
- Later: pure unit tests for merge page order / range parsing if logic gets non-trivial  

---

## 9. Roadmap (calendar)

| Week | Focus | User-visible result |
|------|--------|---------------------|
| **W1** | Phase 0 + 1A + 1B | Mode switch · better images · Merge |
| **W2** | Polish Phase 1 · deploy Toolkit v1 | Public suite of 2 modes |
| **W3** | Phase 2 Extract | 3 modes |
| **W4** | Phase 3 Compress · tune by feedback | 4 modes if justified |

**Ship after W1–W2.** Do not wait for the full suite to go live.

---

## 10. Success metrics (lightweight)

| Signal | How |
|--------|-----|
| Completion | Drop → download success rate (qualitative or later analytics events) |
| Mode mix | Which modes get used (`mode` events or query hits) |
| Friction reports | HEIC fails, mobile OOM, password PDFs |
| Soft brand conversion | Clicks to [anchorsystems.dev](https://anchorsystems.dev/) |
| Sharing | Unprompted reuse / “sent a friend the link” |

Defer ARPU / subscription metrics until monetization decisions exist.

---

## 11. Decision checklist (pre Phase 1 coding)

- [x] Toolkit = private PDF lane only (not infinite formats)
- [ ] **v1 ship modes locked:** `images` + `merge` (recommended)
- [ ] Extract = v2; compress = v3
- [ ] **No server** for processing while privacy is brand
- [ ] One URL; mode in state (query string optional later)
- [ ] Deploy after Phase 1, not after Phase 4

---

## 12. Implementation checklist

Copy into issues or a PR description as needed.

### Phase 0 — Foundation

- [x] Introduce `AppMode` + mode switcher shell
- [x] Extract `ImagesMode` from `App.tsx`
- [x] Split `lib/download.ts`, `lib/pdf/imagesToPdf.ts`, `lib/pdf/common.ts`
- [x] Shared `Stage` component
- [x] Shared queue / revoke URL helpers
- [x] Build + smoke: images → PDF unchanged

### Phase 1A — Images harder

- [x] HEIC detect + decode path (lazy)
- [x] Accept / copy updates
- [x] Optional max-dimension downscale
- [x] Better busy / error messaging
- [ ] iOS Safari smoke _(manual)_

### Phase 1B — Merge

- [x] `MergeMode` + PDF multi-accept
- [x] Page count preview per file
- [x] Reorder UI (reuse PageGrid patterns)
- [x] `lib/pdf/merge.ts` via `copyPages`
- [x] Password / corrupt error handling
- [ ] Desktop + mobile smoke _(manual)_
- [ ] **Deploy Toolkit v1**

### Phase 2 — Extract

- [x] Spike pdf.js + Vite worker
- [x] `ExtractMode` UI
- [x] Per-page canvas render
- [x] JPG/PNG option + zip package
- [x] Long-doc / memory messaging
- [ ] Regression on images + merge _(manual smoke)_

### Phase 3 — Compress

- [x] Label + expectations copy
- [x] Honest size-reduction pipeline (Option B: repack + raster rebuild)
- [x] Before/after size feedback
- [ ] Smoke + honesty review of marketing language _(manual)_

### Phase 4 — Later

- [ ] Split
- [ ] Protect
- [ ] `?mode=` deep links
- [ ] Workers / PWA if usage warrants

---

## 13. Out of scope (explicit)

Do not pull these into the plan without a new product decision:

- Microsoft Office / Google Docs conversion  
- OCR / searchable PDF as a headline feature  
- Electronic signature or annotation product  
- Multi-tenant accounts, orgs, billing (until monetize phase)  
- Server-side file storage or “magic convert any type”  
- Feature parity checklist vs Smallpdf / iLovePDF  

---

## 14. Relationship to Anchor Systems

Imprint remains a **free utility**. Branding stays soft:

- Footer: “A free tool from Anchor Systems” + CTA to [anchorsystems.dev](https://anchorsystems.dev/)
- Do not put agency sales in the hero
- Toolkit quality is the marketing asset: *this is how we ship*

Optional later: list Imprint under “Shipped products” on the Anchor site after public deploy.

---

## 15. Bottom line

| Do | Don’t |
|----|--------|
| Phase 0 then Images+Merge as Toolkit v1 | Wait for 6 tools before launch |
| Stay client-side and sparse in UI | Mirror cloud PDF mega-menus |
| Expand private PDF jobs only | Chase arbitrary formats |
| Deploy and learn | Over-build Phase 4 early |

**Next execution step:** implement **Phase 0 + Phase 1** in the repo, then deploy.

---

## Document history

| Date | Note |
|------|------|
| 2026-08-06 | Initial full plan from product discussion (private toolkit, phased modes) |
