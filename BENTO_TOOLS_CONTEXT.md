# Bento Tools — Project Context

## Purpose of this file

This document captures the product context and decisions from the planning conversation that preceded work in Cursor.

Use it as persistent context when making product, UX, architecture, SEO, and implementation decisions for **Bento Tools**.

Do not treat every idea below as an approved feature. Candidate tools are a backlog for evaluation. Preserve the existing working application and prefer incremental changes over unnecessary rewrites.

---

## 1. Product

**Name:** Bento Tools  
**Domain:** bentotools.app

Bento Tools is intended to become a suite of small, focused web utilities.

The core concept is:

> One immediate problem → one simple tool → instant result.

Each utility should feel like a small self-contained "bento" within the larger Bento Tools product.

The existing application is not a disposable prototype. It should become the foundation of the broader suite.

---

## 2. Existing Tool

The first tool has already been built in this Cursor project:

**Images to PDF**

Current positioning includes the idea:

> Private, no upload.

The existing implementation should be inspected before proposing architectural changes. Reuse working components and patterns where sensible rather than rebuilding the application from scratch.

---

## 3. Product Direction

Bento Tools should evolve from a single utility into a coherent collection of browser-based tools.

The site should NOT feel like a random collection of SEO landing pages.

The Bento name lends itself naturally to a grid/interface containing small, self-contained utilities.

A possible high-level positioning is:

> Useful tools. No signup. No nonsense.

Privacy can become an important differentiator:

> Useful tools that run in your browser. Your files stay on your device.

However, privacy/no-upload claims must only be made for tools where they are technically true.

Whenever practical, prefer client-side processing so user data does not need to leave the browser.

---

## 4. Core Product Principles

### Simple

A user should be able to arrive from Google, understand the tool immediately, use it, and leave.

Avoid unnecessary onboarding, accounts, dashboards, configuration, or workflow complexity.

### Fast

Tools should load quickly and provide immediate feedback.

### Focused

Each page solves one clearly defined problem.

### Private where possible

Prefer local/browser processing when technically reasonable.

Do not upload user files merely because server-side processing is easier.

### Consistent

Tools should share the same Bento Tools design language and interaction patterns.

### Incremental

Do not attempt to build 20 tools before launching improvements.

Add tools individually, observe usage/search performance, and use that information to determine what to build next.

---

## 5. Tool Categories

Potential categories include:

### File / Document Tools

- Images to PDF — EXISTING
- PDF to Images
- Merge PDFs
- Split PDF
- Extract PDF pages

### Image Tools

- Image compressor
- Image resizer
- JPG / PNG / WebP converter
- Image cropper
- Image to Base64

### Word Tools

- Word Unscrambler
- Word Finder / Anagram Solver
- Wordle Solver
- Crossword pattern solver

### Text Tools

- Text Cleaner
- Case Converter
- Duplicate Line Remover
- Word / Character Counter
- Line Sorter
- Find and Replace
- Text Diff
- Whitespace Remover

### CSV / Data Tools

- CSV Column Extractor
- CSV Deduplicator
- CSV Filter
- CSV Splitter
- CSV Merger
- CSV Column Reorder
- CSV to JSON
- JSON to CSV

### Developer Tools

- JSON Formatter
- JSON Validator
- Base64 Encoder / Decoder
- URL Encoder / Decoder
- Regex Tester
- JWT Decoder
- UUID Generator
- Hash Generator

### Security Utility

- Password Generator

Again: this is a candidate backlog, not an instruction to implement everything.

---

## 6. Near-Term Tool Candidates

The discussion identified several attractive small utilities.

### Word Unscrambler

Input letters and return valid words that can be constructed from them.

Possible future features:

- word length
- starts with
- ends with
- contains
- blank/wildcard letters
- dictionary/game-specific word lists

This could eventually lead naturally into Word Finder and other word-game utilities.

### Text Cleaner

Paste messy text and apply transformations such as:

- remove duplicate spaces
- remove blank lines
- trim whitespace
- normalize line endings
- remove duplicate lines
- remove special characters
- remove HTML
- convert tabs/spaces

### Case Converter

Convert text between:

- UPPERCASE
- lowercase
- Title Case
- Sentence case
- camelCase
- PascalCase
- snake_case
- kebab-case
- CONSTANT_CASE

### JSON Formatter

Core actions:

- format
- validate
- minify
- copy

Potential later extensions:

- JSON to CSV
- JSON to YAML

### CSV Column Extractor

Allow a user to provide a CSV, select one or more columns, and export the result.

This is particularly interesting because it can grow into a larger family of CSV utilities.

---

## 7. Suggested Initial Suite

Rather than launching dozens of tools at once, a reasonable early suite discussed was:

1. Images to PDF — already exists
2. Word Unscrambler
3. Text Cleaner
4. Case Converter
5. JSON Formatter
6. CSV Column Extractor

This mix tests several audiences:

- consumer / word-game traffic
- general productivity traffic
- developer traffic
- data/CSV traffic

Actual usage and search performance should guide subsequent development.

---

## 8. Site Information Architecture

A possible URL structure:

    bentotools.app/
    bentotools.app/images-to-pdf
    bentotools.app/word-unscrambler
    bentotools.app/word-finder
    bentotools.app/text-cleaner
    bentotools.app/case-converter
    bentotools.app/duplicate-line-remover
    bentotools.app/csv-column-extractor
    bentotools.app/json-formatter
    bentotools.app/base64
    bentotools.app/url-encoder
    ...

Prefer descriptive URLs for discoverability and SEO.

The homepage should eventually function as a discoverable tool directory rather than merely the interface for Images to PDF.

Possible category navigation:

- Files
- Images
- Words
- Text
- Data
- Developer

Do not force this structure if inspection of the current codebase suggests a cleaner implementation.

---

## 9. Architecture Direction

Before restructuring anything, inspect the current project.

The architectural goal is to make new tools inexpensive to add while keeping each tool isolated.

Conceptually, the project may evolve toward something resembling:

    src/
      tools/
        images-to-pdf/
        word-unscrambler/
        text-cleaner/
        case-converter/
        json-formatter/
        ...

      components/
        ToolLayout
        ToolCard
        FileDropzone
        CopyButton
        DownloadButton
        ...

Exact directories depend on the framework and current implementation.

Do NOT mechanically refactor the project to match this example.

First determine:

1. framework and routing approach
2. existing component structure
3. styling approach
4. existing Images-to-PDF implementation
5. deployment constraints
6. what abstractions are actually repeated

Only abstract components once there is meaningful reuse.

---

## 10. Common Tool UX

Where applicable, utilities should converge on a familiar interaction model:

**Input → Options → Result**

Common actions may include:

- Clear
- Copy
- Download
- Reset
- Process / Convert

The exact controls should depend on the tool rather than forcing every utility into an identical interface.

The objective is familiarity, not rigid uniformity.

---

## 11. SEO Strategy

Bento Tools has potential as a search-driven utility property.

Each utility should have its own indexable page targeting the specific problem it solves.

Examples:

- `/word-unscrambler`
- `/case-converter`
- `/json-formatter`
- `/csv-column-extractor`

Do not create thin pages solely to capture keywords.

Each tool page should be genuinely useful and can include concise supporting content explaining:

- what the tool does
- how to use it
- privacy behavior
- relevant examples
- related Bento Tools

Internal linking between related tools should help both users and discovery.

---

## 12. Business / Monetization Thinking

The initial objective does NOT need to be immediate monetization.

A better early question is:

> Can Bento Tools attract repeat users and organic search traffic?

Possible later monetization paths include:

- advertising
- donations/support
- affiliate opportunities where genuinely relevant
- premium limits/features
- batch processing
- larger files
- saved configurations
- APIs
- paid specialized tools

Avoid introducing accounts, subscriptions, or server infrastructure before there is a demonstrated reason.

---

## 13. Relationship to WP Data Transformer

A separate product concept under consideration is **WP Data Transformer**.

Its positioning is roughly:

> Preparing messy CSV data for WordPress/WooCommerce imports without Excel expertise, scripts, or developer help.

Bento Tools' free CSV utilities could eventually create a natural path toward that more specialized product.

Example:

    Bento Tools
        ↓
    Free CSV utilities
        ↓
    Users with more complicated import-preparation needs
        ↓
    WP Data Transformer

However, Bento Tools should remain useful as an independent product and should NOT be designed merely as an advertisement for WP Data Transformer.

---

## 14. Development Philosophy

Prefer:

- small releases
- simple implementations
- browser-native APIs
- client-side processing
- reusable UI primitives where repetition exists
- good accessibility
- responsive design
- fast page loads
- minimal dependencies
- clear SEO metadata
- good error handling

Avoid:

- premature microservices
- unnecessary databases
- authentication without a user need
- backend processing when browser processing is sufficient
- dependency-heavy implementations for trivial transformations
- speculative abstractions
- building the entire backlog before shipping

---

## 15. Important Instruction for Cursor

Before implementing the next utility:

**Inspect the existing codebase and explain how Bento Tools is currently structured.**

Then identify the smallest architectural changes, if any, required to support multiple utilities cleanly.

Do not immediately rewrite the working Images-to-PDF tool.

Preserve existing behavior unless a change is explicitly approved.

For significant architectural changes:

1. describe the problem
2. propose the change
3. explain the trade-offs
4. identify affected files
5. wait for approval before performing a large refactor

Small, obvious changes can be implemented normally.

---

## 16. Current Product Question

The immediate direction being explored is:

> What should the next single-purpose Bento Tool be after Images to PDF?

Word Unscrambler was one of the ideas that led to the broader realization that `bentotools.app` could support a suite of utilities.

Do not assume Word Unscrambler has been selected as the next implementation.

The next tool should be chosen based on a combination of:

- implementation effort
- usefulness
- search demand
- competition
- ability to process locally
- fit with Bento Tools
- potential for adjacent tools
- opportunity to learn from real usage

---

## 17. Working Rule

When proposing a feature, ask:

> Does this make Bento Tools more useful, or are we adding complexity because we can?

Bias toward usefulness.

The long-term opportunity is not one complicated application.

It is a growing collection of **small tools that do one job extremely well**.
