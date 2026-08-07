# Staypress — SEO Implementation Plan

> **Goal:** Make Staypress correctly indexed, privacy long-tail competitive, and share-card ready — without turning the product into a keyword farm.  
> **Positioning remains:** Files stay on the device · craft over feature count · soft credit to Anchor Systems.  
> **Scope:** Organic discovery hygiene + content depth that supports the tool UI. Not “rank #1 for merge pdf.”  
> **Last updated:** 2026-08-07

---

## 1. Success criteria

| Outcome | How we know |
|---------|-------------|
| Every tool URL is indexable with unique title/description | View-source on `/`, `/merge`, `/extract`, `/slim` matches mode |
| Absolute canonical + sitemap on production | `VITE_SITE_URL` build; Search Console shows sitemap OK |
| Share cards show brand image | Facebook Debugger / Twitter card validator show absolute PNG |
| Crawlable intent content on each tool | Visible H1 + intro + FAQs present in DOM (and ideally first paint) |
| Machines understand product type | JSON-LD validates in Rich Results / Schema markup tester |
| Privacy long-tail page(s) exist | 1–2 useful articles live and linked from footer |
| Discovery pipeline started | GSC property verified; baseline queries tracked |

**Non-goals**

- Win head terms (“merge pdf free”, “compress pdf online”) in months 1–6  
- Separate marketing site that splits brand from the tool  
- Thin doorway pages for every keyword variant  
- Buying links or spam directories  

---

## 2. Current baseline (audit snapshot)

| Area | Status | Notes |
|------|--------|--------|
| Path routes per mode | Done | `/`, `/merge`, `/extract`, `/slim` |
| Mode titles + meta | Done | `src/seoData.ts` |
| Static HTML shells at build | Done | Vite plugin `modeSeoShells` |
| Runtime meta updates | Done | `applyModeSeo` |
| Canonical + sitemap | Done in code | Requires Production `VITE_SITE_URL` |
| robots.txt | Done in code | Sitemap line injected when `VITE_SITE_URL` set |
| OG / Twitter image | Done | `public/og.png` 1200×630; absolute when origin known |
| Semantic H1 + body copy | Missing | Brand + tagline only; thin for crawlers |
| FAQ content | Missing | — |
| JSON-LD | Missing | — |
| Editorial / long-tail pages | Missing | — |
| Search Console + offsite | Ops, not code | Manual after domain live |

---

## 3. Workstreams

```
A  Deploy / indexing foundations     (ops + build config)
B  Share cards & visual assets       (media + meta)
C  On-page structure per mode        (UI + seoData)
D  Structured data                   (JSON-LD)
E  Long-tail content                 (1–2 pages)
F  Launch & measure                  (GSC, PH, links)
```

Do **A → B → C → D** before **E**. Do **F** alongside A as soon as the domain is live.

---

## 4. Phase A — Deploy & indexing foundations

**Why first:** Bad domain / missing sitemap = every other SEO fix underperforms.

### A1. Production site URL

- [x] Code/docs expect one `VITE_SITE_URL` for absolute SEO artifacts
- [ ] Confirm canonical production domain (e.g. `https://staypress.com` or current Vercel URL — pick **one** forever)
- [ ] Prefer apex or www only; 301 the other
- [ ] Set Vercel env: `VITE_SITE_URL=https://your-production-domain` for **Production only** (see A3)

### A2. Build-time SEO artifacts

- [x] Build with `VITE_SITE_URL` emits absolute canonical, og:url, og:image, sitemap, robots Sitemap line
- [ ] Smoke: open view-source on each path after deploy; confirm absolute URLs

### A3. Indexing policy for previews

- [x] Documented: set `VITE_SITE_URL` on Production only (do not bake preview hosts into sitemap)
- [ ] Production only gets Search Console property  

### A4. Google Search Console (ops)

- [ ] Verify property (DNS or HTML file)
- [ ] Submit `https://domain/sitemap.xml`
- [ ] Request indexing for `/`, `/merge`, `/extract`, `/slim`
- [ ] Record baseline: impressions = 0 until crawl; revisit in 2–4 weeks  

### A5. Acceptance

- [x] Local/CI build with `VITE_SITE_URL` proves absolute canonical + image + sitemap
- [ ] Production source shows absolute canonical  
- [ ] Sitemap fetches 200 and lists four URLs  
- [ ] GSC: property verified, sitemap “Success”

---

## 5. Phase B — Share cards & assets

### B1. OG image (required)

- [x] Create **1200×630 PNG** (`public/og.png`) brand-forward: Staypress + privacy claim  
- [x] Optional source SVG at `public/og.svg` for edits  
- [x] Meta uses PNG (not SVG)  

### B2. Meta hardening

- [x] In `index.html` + `injectModeSeoIntoHtml` / `applyModeSeo`:  
  - `og:image` + `twitter:image` absolute when origin / `VITE_SITE_URL` known  
  - `og:image:alt`, type, dimensions  
- [x] Keep `twitter:card` = `summary_large_image`  

### B3. Acceptance

- [ ] Facebook Sharing Debugger / opengraph.xyz show correct image on **production** URL  

---

## 6. Phase C — On-page structure per mode

**Principle:** One composition, brand first — SEO text lives **below the fold** or as a quiet idle section so the hero stays product-first.

### C1. Content model (extend `MODE_SEO` or parallel `MODE_SEO_CONTENT`)

Per mode, store in data (not hardcode across files):

| Field | Rules |
|-------|--------|
| `h1` | One clear job phrase + privacy if natural (≈ 4–10 words) |
| `intro` | 1–2 sentences: job + free + no upload |
| `faqs` | 3–5 Q&As; plain language; no keyword stuffing |

**Draft targets (edit for voice):**

| Mode | H1 draft |
|------|----------|
| Images | Convert images to PDF privately |
| Merge | Merge PDFs in your browser |
| Extract | Export PDF pages as images |
| Slim | Compress a PDF without uploading |

### C2. UI placement

- [ ] Idle (empty) state: after tagline/privacy short line, or below stage before footer  
  - **H1** (visually secondary to brand mark; still real `<h1>`)  
  - **Intro** paragraph  
  - **FAQ** block (simple disclosure list or static Q&A — no card farm)  
- [ ] Ready / working state: hide or collapse SEO block so focus stays on the tool  
- [ ] Styles: muted type, short measure, matches paper/ink tokens — not a second landing page  

### C3. Accessibility / semantics

- [ ] Single `<h1>` per view  
- [ ] FAQ questions as `<h2>` or `dt`/`button` with proper regions  
- [ ] Don’t put the only keyword content only in images  

### C4. Optional: inject FAQ text into static shells

- [ ] Evaluate whether build-time injection of a minimal noscript / static snippet helps non-JS crawlers  
- [ ] If yes: small static block in HTML shells for crawl; react hydration owns interactive UI  
- [ ] If no / costly: rely on Google executing JS + good internal signals first  

**v1 decision default:** React idle content is enough; revisit static body injection only if GSC shows thin/JS issues.

### C5. Acceptance

- Each mode idle: one H1, intro, ≥3 FAQs  
- Ready state not cluttered  
- No visual competition with brand in first viewport  

---

## 7. Phase D — Structured data (JSON-LD)

### D1. Types

Per mode (or one WebApplication + software features):

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Staypress — Merge PDFs",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "…",
  "url": "https://…/merge",
  "browserRequirements": "Requires JavaScript. Processing is client-side."
}
```

Also optional `FAQPage` if FAQs are visible on the same URL (only if markup matches visible content).

### D2. Implementation

- [ ] Add JSON-LD generation in `seo.ts` / shared module  
- [ ] Inject/update `<script type="application/ld+json">` on mode change  
- [ ] Prefer also writing shell-injected JSON-LD at build for the four paths  

### D3. Acceptance

- [ Google Rich Results Test ](https://search.google.com/test/rich-results) / schema validator: no critical errors  
- Markup matches visible claims (free, client-side)  

---

## 8. Phase E — Long-tail content (after C+D)

### E1. Pages (recommend 2, not 10)

| Path (suggested) | Intent | Format |
|------------------|--------|--------|
| `/about` or `/privacy` | Trust + “no upload” proof | Short essay: architecture, what leaves device (feedback form only) |
| `/guides/heic-to-pdf` or `/guides/private-pdf-tools` | Long-tail utility | 600–1200 words, internal link to tool modes |

### E2. Product rules for content

- [ ] Real answers; no AI filler walls  
- [ ] Same design system; no second brand  
- [ ] Footer link: Guide · Privacy (or both under one “About”)  
- [ ] Keep routing coherent with Vite SPA shells if needed  

### E3. Acceptance

- Pages indexable unique titles  
- Each tool mode linked from relevant guide section  
- No cloaking / no pure doorway pages  

---

## 9. Phase F — Launch & authority (ops + product marketing)

Not code-blocked; track as checklist.

### F1. Launch surfaces

- [ ] Product Hunt (or similar) live with consistent name + privacy claim  
- [ ] GitHub public repo README matches product promises  
- [ ] Anchor Systems site soft mention / portfolio link  

### F2. Link acquisition (ethical)

- [ ] Privacy / open-source communities — only where genuine  
- [ ] Reply to “local alternative to CloudConvert” style threads with value first  
- [ ] Skip paid link schemes  

### F3. Measurement cadence

| When | Action |
|------|--------|
| Week 0 | GSC + Analytics live; note domain set date |
| Week 2 | Impressions / coverage errors |
| Month 1 | Which queries appear; which long-tail if any |
| Month 2–3 | If zero long-tail → boost Phase E content or tighten titles |

---

## 10. Implementation order (engineering ticks)

Use as the execution sequence when coding starts:

| Tick | Work | Owner | Depends | Status |
|------|------|--------|---------|--------|
| 1 | Confirm domain; set `VITE_SITE_URL` on Vercel Production | Ops | — | **You** |
| 2 | Deploy and verify view-source + sitemap | Ops | 1 | **You** |
| 3 | Search Console verify + submit sitemap | Ops | 2 | **You** |
| 4 | Create `public/og.png` (1200×630) | Design/code | — | **Done** |
| 5 | Absolute OG/Twitter image in HTML + inject + client SEO | Code | 4 | **Done** |
| 6 | Extend SEO content model (h1, intro, faqs) in `seoData` | Code | — |
| 7 | `SeoIdleContent` (or similar) in App for idle-only H1/intro/FAQ | Code | 6 |
| 8 | Styles for SEO block (quiet, on-brand) | Code | 7 |
| 9 | JSON-LD inject client + optional build shell | Code | 6 |
| 10 | Validate rich results + social debuggers on prod | QA | 5, 9 |
| 11 | Privacy / about short page | Code + copy | 7 |
| 12 | One long-tail guide page | Code + copy | 11 |
| 13 | Footer links to content; internal links | Code | 11–12 |
| 14 | Post-launch link + content review (30 days) | Ops | 3 |

**Suggested ship grouping**

| Ship | Ticks | Ship when |
|------|-------|-----------|
| **SEO Foundation** | 1–5 | Domain stable |
| **On-page + schema** | 6–10 | Same PR OK |
| **Content depth** | 11–13 | After foundation |
| **Iterate** | 14 | Continuously |

---

## 11. File touch map (expected)

| Area | Files / places |
|------|----------------|
| SEO copy + model | `src/seoData.ts` (extend), maybe `src/seoContent.ts` |
| Client SEO apply | `src/seo.ts` (JSON-LD, absolute images) |
| Shell injection | `src/seoData.ts` `injectModeSeoIntoHtml`, `vite.config.ts` |
| Document base | `index.html` |
| App shell | `src/App.tsx`, `src/App.css` |
| New UI | `src/components/SeoIdleContent.tsx` (name flexible) |
| Assets | `public/og.png`, remove/fix `og.svg` refs |
| Content routes | `src/routing.ts`, new pages/components, `vercel.json` rewrites if needed |
| Docs | This plan; light README “SEO” note under Deploy |

Avoid rewriting the toolkit modes for SEO except for optional props passed from App.

---

## 12. Copy QA checklist (every page)

- [ ] Privacy claim true (feedback form is the only networked user text)  
- [ ] No “encrypted on our servers” style false promises  
- [ ] Title ≤ ~60 chars when possible; description ≤ ~155  
- [ ] H1 unique per mode  
- [ ] Brand name “Staypress” consistent  
- [ ] No keyword stuffing in FAQs  

---

## 13. Risks & decisions

| Risk | Mitigation |
|------|------------|
| SEO block kills empty-state elegance | Idle-only, below fold / after stage, small type |
| SPA still thin for some crawlers | Shells for head; revisit body injection if GSC flags |
| Guide pages become second product | Cap at 2 until traffic justifies more |
| `VITE_SITE_URL` only on local builds | Document in README; enforce in Vercel Production env |
| Over-chasing head terms | Measure long-tail only for first 90 days |

**Open product decision (resolve in Ship On-page):**  
Exact placement — **below stage** vs **between tagline and stage**. Default recommendation: **below stage, above footer**, so first viewport stays brand + tool.

---

## 14. Definition of done (plan complete)

All of the following true:

1. Production domain locked; `VITE_SITE_URL` set; sitemap in GSC  
2. Absolute OG PNG works in at least one social debugger  
3. Four modes: unique title, H1, intro, ≥3 FAQs on idle  
4. JSON-LD present and valid per mode  
5. At least **privacy/about** page live; guide optional but scheduled  
6. This plan checkboxes updated as items ship  

When engineering starts, work **Ship: SEO Foundation** first (ticks 1–5), then **On-page + schema** (6–10), without mixing long essay routes into the first PR unless trivial.

---

## 15. Reference: meta patterns already in codebase

- `MODE_SEO` + `injectModeSeoIntoHtml` — keep as source of truth for titles/descriptions  
- `applyModeSeo(mode)` — extend, don’t duplicate  
- Mode shells: `SEO_SHELL_MODES` in vite closeBundle  
- Privacy differentiator must remain in titles/descriptions as today  

---

*Next action when ready to implement: execute Ship “SEO Foundation” (ticks 1–5), then On-page + schema (6–10).*
