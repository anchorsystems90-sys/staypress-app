export function IconChevronLeft() {
  return (
    <svg className="icon-btn__svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M12.25 4.75 7 10l5.25 5.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconChevronRight() {
  return (
    <svg className="icon-btn__svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.75 4.75 13 10l-5.25 5.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconRemove() {
  return (
    <svg className="icon-btn__svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconDoc() {
  return (
    <svg className="pdf-thumb__svg" viewBox="0 0 48 56" fill="none" aria-hidden="true">
      <path
        d="M8 4h20l12 12v32a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M28 4v12h12" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 28h20M14 36h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconDownload() {
  return (
    <svg className="icon-btn__svg" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 3.5v9m0 0 3.25-3.25M10 12.5 6.75 9.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 15.25h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

const HOME_ICON = {
  className: 'home__tool-svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true as const,
}

/** Photo-to-page: landscape image with a small document. */
export function IconToolImagesToPdf() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="10.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="6.4" cy="8.1" r="1.15" fill="currentColor" />
      <path
        d="M2.75 13.4 6.6 10.4l2.55 2.1 2.05-2.45 3.7 3.55"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 12.25h5.25L21.5 15.2V20a1.75 1.75 0 0 1-1.75 1.75h-6.5A1.75 1.75 0 0 1 11.5 20v-6a1.75 1.75 0 0 1 1.75-1.75Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 12.25V15.2h2.95"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Two offset pages. */
export function IconToolMergePdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M7 6.25h8.25A1.75 1.75 0 0 1 17 8v11.25H8.75A1.75 1.75 0 0 1 7 17.5V6.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 4.25h8.25A1.75 1.75 0 0 1 20 6v11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.25h4M10 15.5h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Page with a small image tile. */
export function IconToolPdfToImages() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5.5 3.5h8.25L18.5 8.25V19.5A1.75 1.75 0 0 1 16.75 21.25H5.5A1.75 1.75 0 0 1 3.75 19.5V5.25A1.75 1.75 0 0 1 5.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 3.5V8.25H18.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <rect
        x="6.75"
        y="11.5"
        width="8.5"
        height="6.25"
        rx="1.15"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.9 16.6 9.2 14.5l1.85 1.45 1.35-1.35 2.7 2.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Page with inward compression arrows. */
export function IconToolSlimPdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M6.5 4.25h8.25L19.5 9v10.25A1.75 1.75 0 0 1 17.75 21H6.5A1.75 1.75 0 0 1 4.75 19.25V6A1.75 1.75 0 0 1 6.5 4.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 4.25V9H19.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25 12 14.25 15 11.25M9 16.75 12 13.75 15 16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Letter tiles. */
export function IconToolWordUnscrambler() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="13"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5.35 15.35 7 8.9l1.65 6.45M5.75 13.35h2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.15 8.9v6.45M15.1 15.35h3.35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Stacked lines being tidied. */
export function IconToolTextCleaner() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.5 6.5h15M4.5 12h11M4.5 17.5h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17.2 14.2 19.6 16.6M19.6 14.2 17.2 16.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Word count — tally marks / lines. */
export function IconToolWordCounter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.5h4.5M5 12h7M5 16.5h5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8.25 18.75 16.5M18.75 8.25 15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Aa. */
export function IconToolCaseConverter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.6 18 8.1 8.5 11.6 18M5.7 15.15h5.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4 18v-6.4c0-1.7 1.15-2.7 2.7-2.7 1.55 0 2.7 1 2.7 2.7V18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14.4 14.35h5.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces. */
export function IconToolJsonFormatter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.25H7.4A2.15 2.15 0 0 0 5.25 7.4v2.35c0 .7-.55 1.25-1.25 1.25.7 0 1.25.55 1.25 1.25V16.6A2.15 2.15 0 0 0 7.4 18.75H9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5.25h1.6A2.15 2.15 0 0 1 18.75 7.4v2.35c0 .7.55 1.25 1.25 1.25-.7 0-1.25.55-1.25 1.25V16.6A2.15 2.15 0 0 1 16.6 18.75H15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Base64 — stacked bars suggesting encoded blocks. */
export function IconToolBase64() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.25h14M5 12h10M5 16.75h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.75 10.5 19.5 12l-2.75 1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Link / percent-encoding. */
export function IconToolUrlEncode() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9.5 14.5 7.75 16.25a3.25 3.25 0 0 1-4.6-4.6L5.5 9.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5 16.25 7.75a3.25 3.25 0 0 1 4.6 4.6L18.5 14.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 14.25 14.25 9.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Grid / spreadsheet columns. */
export function IconToolCsvColumnExtractor() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 9.25h17M3.5 14h17M9.25 4.5v15M14.75 4.5v15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Table to braces — CSV → JSON. */
export function IconToolCsvToJson() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.25 9.25h7.5M3.25 13.5h7.5M6.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.1 7.1c0-1.15.85-1.85 2-1.85h1.15M14.1 16.9c0 1.15.85 1.85 2 1.85h1.15M19.9 7.1c0-1.15-.85-1.85-2-1.85H16.75M19.9 16.9c0 1.15-.85 1.85-2 1.85H16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12.4 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces to table — JSON → CSV. */
export function IconToolJsonToCsv() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.1 7.1c0-1.15.85-1.85 2-1.85H7.25M4.1 16.9c0 1.15.85 1.85 2 1.85H7.25M9.9 7.1c0-1.15-.85-1.85-2-1.85H6.75M9.9 16.9c0 1.15-.85 1.85-2 1.85H6.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M10.9 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="13.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M13.25 9.25h7.5M13.25 13.5h7.5M16.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Photo-to-page: landscape image with a small document. */
export function IconToolImagesToPdf() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="10.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="6.4" cy="8.1" r="1.15" fill="currentColor" />
      <path
        d="M2.75 13.4 6.6 10.4l2.55 2.1 2.05-2.45 3.7 3.55"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 12.25h5.25L21.5 15.2V20a1.75 1.75 0 0 1-1.75 1.75h-6.5A1.75 1.75 0 0 1 11.5 20v-6a1.75 1.75 0 0 1 1.75-1.75Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 12.25V15.2h2.95"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Two offset pages. */
export function IconToolMergePdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M7 6.25h8.25A1.75 1.75 0 0 1 17 8v11.25H8.75A1.75 1.75 0 0 1 7 17.5V6.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 4.25h8.25A1.75 1.75 0 0 1 20 6v11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.25h4M10 15.5h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Page with a small image tile. */
export function IconToolPdfToImages() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5.5 3.5h8.25L18.5 8.25V19.5A1.75 1.75 0 0 1 16.75 21.25H5.5A1.75 1.75 0 0 1 3.75 19.5V5.25A1.75 1.75 0 0 1 5.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 3.5V8.25H18.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <rect
        x="6.75"
        y="11.5"
        width="8.5"
        height="6.25"
        rx="1.15"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.9 16.6 9.2 14.5l1.85 1.45 1.35-1.35 2.7 2.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Page with inward compression arrows. */
export function IconToolSlimPdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M6.5 4.25h8.25L19.5 9v10.25A1.75 1.75 0 0 1 17.75 21H6.5A1.75 1.75 0 0 1 4.75 19.25V6A1.75 1.75 0 0 1 6.5 4.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 4.25V9H19.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25 12 14.25 15 11.25M9 16.75 12 13.75 15 16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Letter tiles. */
export function IconToolWordUnscrambler() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="13"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5.35 15.35 7 8.9l1.65 6.45M5.75 13.35h2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.15 8.9v6.45M15.1 15.35h3.35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Stacked lines being tidied. */
export function IconToolTextCleaner() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.5 6.5h15M4.5 12h11M4.5 17.5h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17.2 14.2 19.6 16.6M19.6 14.2 17.2 16.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Word count — tally marks / lines. */
export function IconToolWordCounter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.5h4.5M5 12h7M5 16.5h5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8.25 18.75 16.5M18.75 8.25 15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Aa. */
export function IconToolCaseConverter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.6 18 8.1 8.5 11.6 18M5.7 15.15h5.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4 18v-6.4c0-1.7 1.15-2.7 2.7-2.7 1.55 0 2.7 1 2.7 2.7V18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14.4 14.35h5.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces. */
export function IconToolJsonFormatter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.25H7.4A2.15 2.15 0 0 0 5.25 7.4v2.35c0 .7-.55 1.25-1.25 1.25.7 0 1.25.55 1.25 1.25V16.6A2.15 2.15 0 0 0 7.4 18.75H9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5.25h1.6A2.15 2.15 0 0 1 18.75 7.4v2.35c0 .7.55 1.25 1.25 1.25-.7 0-1.25.55-1.25 1.25V16.6A2.15 2.15 0 0 1 16.6 18.75H15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Base64 — stacked bars suggesting encoded blocks. */
export function IconToolBase64() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.25h14M5 12h10M5 16.75h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.75 10.5 19.5 12l-2.75 1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Link / percent-encoding. */
export function IconToolUrlEncode() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9.5 14.5 7.75 16.25a3.25 3.25 0 0 1-4.6-4.6L5.5 9.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5 16.25 7.75a3.25 3.25 0 0 1 4.6 4.6L18.5 14.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 14.25 14.25 9.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Grid / spreadsheet columns. */
export function IconToolCsvColumnExtractor() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 9.25h17M3.5 14h17M9.25 4.5v15M14.75 4.5v15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Table to braces — CSV → JSON. */
export function IconToolCsvToJson() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.25 9.25h7.5M3.25 13.5h7.5M6.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.1 7.1c0-1.15.85-1.85 2-1.85h1.15M14.1 16.9c0 1.15.85 1.85 2 1.85h1.15M19.9 7.1c0-1.15-.85-1.85-2-1.85H16.75M19.9 16.9c0 1.15-.85 1.85-2 1.85H16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12.4 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces to table — JSON → CSV. */
export function IconToolJsonToCsv() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.1 7.1c0-1.15.85-1.85 2-1.85H7.25M4.1 16.9c0 1.15.85 1.85 2 1.85H7.25M9.9 7.1c0-1.15-.85-1.85-2-1.85H6.75M9.9 16.9c0 1.15-.85 1.85-2 1.85H6.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M10.9 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="13.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M13.25 9.25h7.5M13.25 13.5h7.5M16.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Key — password / credentials. */
export function IconToolPasswordGenerator() {
  return (
    <svg {...HOME_ICON}>
      <circle
        cx="8.25"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M11.5 12h7.25v2.4M15.75 12v2.15M18 12v2.15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Photo-to-page: landscape image with a small document. */
export function IconToolImagesToPdf() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="10.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="6.4" cy="8.1" r="1.15" fill="currentColor" />
      <path
        d="M2.75 13.4 6.6 10.4l2.55 2.1 2.05-2.45 3.7 3.55"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 12.25h5.25L21.5 15.2V20a1.75 1.75 0 0 1-1.75 1.75h-6.5A1.75 1.75 0 0 1 11.5 20v-6a1.75 1.75 0 0 1 1.75-1.75Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 12.25V15.2h2.95"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Two offset pages. */
export function IconToolMergePdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M7 6.25h8.25A1.75 1.75 0 0 1 17 8v11.25H8.75A1.75 1.75 0 0 1 7 17.5V6.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 4.25h8.25A1.75 1.75 0 0 1 20 6v11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.25h4M10 15.5h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Page with a small image tile. */
export function IconToolPdfToImages() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5.5 3.5h8.25L18.5 8.25V19.5A1.75 1.75 0 0 1 16.75 21.25H5.5A1.75 1.75 0 0 1 3.75 19.5V5.25A1.75 1.75 0 0 1 5.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 3.5V8.25H18.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <rect
        x="6.75"
        y="11.5"
        width="8.5"
        height="6.25"
        rx="1.15"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.9 16.6 9.2 14.5l1.85 1.45 1.35-1.35 2.7 2.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Page with inward compression arrows. */
export function IconToolSlimPdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M6.5 4.25h8.25L19.5 9v10.25A1.75 1.75 0 0 1 17.75 21H6.5A1.75 1.75 0 0 1 4.75 19.25V6A1.75 1.75 0 0 1 6.5 4.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 4.25V9H19.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25 12 14.25 15 11.25M9 16.75 12 13.75 15 16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Letter tiles. */
export function IconToolWordUnscrambler() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="13"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5.35 15.35 7 8.9l1.65 6.45M5.75 13.35h2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.15 8.9v6.45M15.1 15.35h3.35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Stacked lines being tidied. */
export function IconToolTextCleaner() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.5 6.5h15M4.5 12h11M4.5 17.5h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17.2 14.2 19.6 16.6M19.6 14.2 17.2 16.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Word count — tally marks / lines. */
export function IconToolWordCounter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.5h4.5M5 12h7M5 16.5h5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8.25 18.75 16.5M18.75 8.25 15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Aa. */
export function IconToolCaseConverter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.6 18 8.1 8.5 11.6 18M5.7 15.15h5.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4 18v-6.4c0-1.7 1.15-2.7 2.7-2.7 1.55 0 2.7 1 2.7 2.7V18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14.4 14.35h5.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces. */
export function IconToolJsonFormatter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.25H7.4A2.15 2.15 0 0 0 5.25 7.4v2.35c0 .7-.55 1.25-1.25 1.25.7 0 1.25.55 1.25 1.25V16.6A2.15 2.15 0 0 0 7.4 18.75H9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5.25h1.6A2.15 2.15 0 0 1 18.75 7.4v2.35c0 .7.55 1.25 1.25 1.25-.7 0-1.25.55-1.25 1.25V16.6A2.15 2.15 0 0 1 16.6 18.75H15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Base64 — stacked bars suggesting encoded blocks. */
export function IconToolBase64() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.25h14M5 12h10M5 16.75h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.75 10.5 19.5 12l-2.75 1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Link / percent-encoding. */
export function IconToolUrlEncode() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9.5 14.5 7.75 16.25a3.25 3.25 0 0 1-4.6-4.6L5.5 9.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5 16.25 7.75a3.25 3.25 0 0 1 4.6 4.6L18.5 14.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 14.25 14.25 9.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Grid / spreadsheet columns. */
export function IconToolCsvColumnExtractor() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 9.25h17M3.5 14h17M9.25 4.5v15M14.75 4.5v15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Table to braces — CSV → JSON. */
export function IconToolCsvToJson() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.25 9.25h7.5M3.25 13.5h7.5M6.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.1 7.1c0-1.15.85-1.85 2-1.85h1.15M14.1 16.9c0 1.15.85 1.85 2 1.85h1.15M19.9 7.1c0-1.15-.85-1.85-2-1.85H16.75M19.9 16.9c0 1.15-.85 1.85-2 1.85H16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12.4 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces to table — JSON → CSV. */
export function IconToolJsonToCsv() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.1 7.1c0-1.15.85-1.85 2-1.85H7.25M4.1 16.9c0 1.15.85 1.85 2 1.85H7.25M9.9 7.1c0-1.15-.85-1.85-2-1.85H6.75M9.9 16.9c0 1.15-.85 1.85-2 1.85H6.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M10.9 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="13.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M13.25 9.25h7.5M13.25 13.5h7.5M16.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Key — password / credentials. */
export function IconToolPasswordGenerator() {
  return (
    <svg {...HOME_ICON}>
      <circle
        cx="8.25"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M11.5 12h7.25v2.4M15.75 12v2.15M18 12v2.15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Stacked words — passphrase. */
export function IconToolPassphraseGenerator() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 8h9M5 12h14M5 16h11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Photo-to-page: landscape image with a small document. */
export function IconToolImagesToPdf() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="10.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="6.4" cy="8.1" r="1.15" fill="currentColor" />
      <path
        d="M2.75 13.4 6.6 10.4l2.55 2.1 2.05-2.45 3.7 3.55"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 12.25h5.25L21.5 15.2V20a1.75 1.75 0 0 1-1.75 1.75h-6.5A1.75 1.75 0 0 1 11.5 20v-6a1.75 1.75 0 0 1 1.75-1.75Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 12.25V15.2h2.95"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Two offset pages. */
export function IconToolMergePdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M7 6.25h8.25A1.75 1.75 0 0 1 17 8v11.25H8.75A1.75 1.75 0 0 1 7 17.5V6.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 4.25h8.25A1.75 1.75 0 0 1 20 6v11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.25h4M10 15.5h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Page with a small image tile. */
export function IconToolPdfToImages() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5.5 3.5h8.25L18.5 8.25V19.5A1.75 1.75 0 0 1 16.75 21.25H5.5A1.75 1.75 0 0 1 3.75 19.5V5.25A1.75 1.75 0 0 1 5.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 3.5V8.25H18.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <rect
        x="6.75"
        y="11.5"
        width="8.5"
        height="6.25"
        rx="1.15"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.9 16.6 9.2 14.5l1.85 1.45 1.35-1.35 2.7 2.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Page with inward compression arrows. */
export function IconToolSlimPdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M6.5 4.25h8.25L19.5 9v10.25A1.75 1.75 0 0 1 17.75 21H6.5A1.75 1.75 0 0 1 4.75 19.25V6A1.75 1.75 0 0 1 6.5 4.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 4.25V9H19.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25 12 14.25 15 11.25M9 16.75 12 13.75 15 16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Letter tiles. */
export function IconToolWordUnscrambler() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="13"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5.35 15.35 7 8.9l1.65 6.45M5.75 13.35h2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.15 8.9v6.45M15.1 15.35h3.35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Stacked lines being tidied. */
export function IconToolTextCleaner() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.5 6.5h15M4.5 12h11M4.5 17.5h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17.2 14.2 19.6 16.6M19.6 14.2 17.2 16.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Word count — tally marks / lines. */
export function IconToolWordCounter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.5h4.5M5 12h7M5 16.5h5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8.25 18.75 16.5M18.75 8.25 15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Aa. */
export function IconToolCaseConverter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.6 18 8.1 8.5 11.6 18M5.7 15.15h5.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4 18v-6.4c0-1.7 1.15-2.7 2.7-2.7 1.55 0 2.7 1 2.7 2.7V18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14.4 14.35h5.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces. */
export function IconToolJsonFormatter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.25H7.4A2.15 2.15 0 0 0 5.25 7.4v2.35c0 .7-.55 1.25-1.25 1.25.7 0 1.25.55 1.25 1.25V16.6A2.15 2.15 0 0 0 7.4 18.75H9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5.25h1.6A2.15 2.15 0 0 1 18.75 7.4v2.35c0 .7.55 1.25 1.25 1.25-.7 0-1.25.55-1.25 1.25V16.6A2.15 2.15 0 0 1 16.6 18.75H15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Base64 — stacked bars suggesting encoded blocks. */
export function IconToolBase64() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.25h14M5 12h10M5 16.75h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.75 10.5 19.5 12l-2.75 1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Link / percent-encoding. */
export function IconToolUrlEncode() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9.5 14.5 7.75 16.25a3.25 3.25 0 0 1-4.6-4.6L5.5 9.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5 16.25 7.75a3.25 3.25 0 0 1 4.6 4.6L18.5 14.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 14.25 14.25 9.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Grid / spreadsheet columns. */
export function IconToolCsvColumnExtractor() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 9.25h17M3.5 14h17M9.25 4.5v15M14.75 4.5v15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Table to braces — CSV → JSON. */
export function IconToolCsvToJson() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.25 9.25h7.5M3.25 13.5h7.5M6.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.1 7.1c0-1.15.85-1.85 2-1.85h1.15M14.1 16.9c0 1.15.85 1.85 2 1.85h1.15M19.9 7.1c0-1.15-.85-1.85-2-1.85H16.75M19.9 16.9c0 1.15-.85 1.85-2 1.85H16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12.4 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces to table — JSON → CSV. */
export function IconToolJsonToCsv() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.1 7.1c0-1.15.85-1.85 2-1.85H7.25M4.1 16.9c0 1.15.85 1.85 2 1.85H7.25M9.9 7.1c0-1.15-.85-1.85-2-1.85H6.75M9.9 16.9c0 1.15-.85 1.85-2 1.85H6.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M10.9 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="13.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M13.25 9.25h7.5M13.25 13.5h7.5M16.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Key — password / credentials. */
export function IconToolPasswordGenerator() {
  return (
    <svg {...HOME_ICON}>
      <circle
        cx="8.25"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M11.5 12h7.25v2.4M15.75 12v2.15M18 12v2.15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Stacked words — passphrase. */
export function IconToolPassphraseGenerator() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 8h9M5 12h14M5 16h11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Hash grid — UUID. */
export function IconToolUuidGenerator() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="4.5"
        y="7"
        width="15"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 7v10M12 7v10M16 7v10M4.5 10.5h15M4.5 13.5h15"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Photo-to-page: landscape image with a small document. */
export function IconToolImagesToPdf() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="10.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="6.4" cy="8.1" r="1.15" fill="currentColor" />
      <path
        d="M2.75 13.4 6.6 10.4l2.55 2.1 2.05-2.45 3.7 3.55"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 12.25h5.25L21.5 15.2V20a1.75 1.75 0 0 1-1.75 1.75h-6.5A1.75 1.75 0 0 1 11.5 20v-6a1.75 1.75 0 0 1 1.75-1.75Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 12.25V15.2h2.95"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Two offset pages. */
export function IconToolMergePdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M7 6.25h8.25A1.75 1.75 0 0 1 17 8v11.25H8.75A1.75 1.75 0 0 1 7 17.5V6.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 4.25h8.25A1.75 1.75 0 0 1 20 6v11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.25h4M10 15.5h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Page with a small image tile. */
export function IconToolPdfToImages() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5.5 3.5h8.25L18.5 8.25V19.5A1.75 1.75 0 0 1 16.75 21.25H5.5A1.75 1.75 0 0 1 3.75 19.5V5.25A1.75 1.75 0 0 1 5.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 3.5V8.25H18.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <rect
        x="6.75"
        y="11.5"
        width="8.5"
        height="6.25"
        rx="1.15"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.9 16.6 9.2 14.5l1.85 1.45 1.35-1.35 2.7 2.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Page with inward compression arrows. */
export function IconToolSlimPdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M6.5 4.25h8.25L19.5 9v10.25A1.75 1.75 0 0 1 17.75 21H6.5A1.75 1.75 0 0 1 4.75 19.25V6A1.75 1.75 0 0 1 6.5 4.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 4.25V9H19.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25 12 14.25 15 11.25M9 16.75 12 13.75 15 16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Letter tiles. */
export function IconToolWordUnscrambler() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="13"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5.35 15.35 7 8.9l1.65 6.45M5.75 13.35h2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.15 8.9v6.45M15.1 15.35h3.35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Stacked lines being tidied. */
export function IconToolTextCleaner() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.5 6.5h15M4.5 12h11M4.5 17.5h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17.2 14.2 19.6 16.6M19.6 14.2 17.2 16.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Word count — tally marks / lines. */
export function IconToolWordCounter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.5h4.5M5 12h7M5 16.5h5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8.25 18.75 16.5M18.75 8.25 15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Aa. */
export function IconToolCaseConverter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.6 18 8.1 8.5 11.6 18M5.7 15.15h5.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4 18v-6.4c0-1.7 1.15-2.7 2.7-2.7 1.55 0 2.7 1 2.7 2.7V18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14.4 14.35h5.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces. */
export function IconToolJsonFormatter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.25H7.4A2.15 2.15 0 0 0 5.25 7.4v2.35c0 .7-.55 1.25-1.25 1.25.7 0 1.25.55 1.25 1.25V16.6A2.15 2.15 0 0 0 7.4 18.75H9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5.25h1.6A2.15 2.15 0 0 1 18.75 7.4v2.35c0 .7.55 1.25 1.25 1.25-.7 0-1.25.55-1.25 1.25V16.6A2.15 2.15 0 0 1 16.6 18.75H15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Base64 — stacked bars suggesting encoded blocks. */
export function IconToolBase64() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.25h14M5 12h10M5 16.75h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.75 10.5 19.5 12l-2.75 1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Link / percent-encoding. */
export function IconToolUrlEncode() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9.5 14.5 7.75 16.25a3.25 3.25 0 0 1-4.6-4.6L5.5 9.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5 16.25 7.75a3.25 3.25 0 0 1 4.6 4.6L18.5 14.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 14.25 14.25 9.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Grid / spreadsheet columns. */
export function IconToolCsvColumnExtractor() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 9.25h17M3.5 14h17M9.25 4.5v15M14.75 4.5v15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Table to braces — CSV → JSON. */
export function IconToolCsvToJson() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.25 9.25h7.5M3.25 13.5h7.5M6.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.1 7.1c0-1.15.85-1.85 2-1.85h1.15M14.1 16.9c0 1.15.85 1.85 2 1.85h1.15M19.9 7.1c0-1.15-.85-1.85-2-1.85H16.75M19.9 16.9c0 1.15-.85 1.85-2 1.85H16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12.4 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces to table — JSON → CSV. */
export function IconToolJsonToCsv() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.1 7.1c0-1.15.85-1.85 2-1.85H7.25M4.1 16.9c0 1.15.85 1.85 2 1.85H7.25M9.9 7.1c0-1.15-.85-1.85-2-1.85H6.75M9.9 16.9c0 1.15-.85 1.85-2 1.85H6.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M10.9 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="13.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M13.25 9.25h7.5M13.25 13.5h7.5M16.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Key — password / credentials. */
export function IconToolPasswordGenerator() {
  return (
    <svg {...HOME_ICON}>
      <circle
        cx="8.25"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M11.5 12h7.25v2.4M15.75 12v2.15M18 12v2.15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Stacked words — passphrase. */
export function IconToolPassphraseGenerator() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 8h9M5 12h14M5 16h11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Hash grid — UUID. */
export function IconToolUuidGenerator() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="4.5"
        y="7"
        width="15"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 7v10M12 7v10M16 7v10M4.5 10.5h15M4.5 13.5h15"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Token chip — API key. */
export function IconToolApiKeyGenerator() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="4.25"
        y="8.25"
        width="15.5"
        height="7.5"
        rx="3.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="9" cy="12" r="1.35" fill="currentColor" />
      <path
        d="M12.25 12h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Photo-to-page: landscape image with a small document. */
export function IconToolImagesToPdf() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="10.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="6.4" cy="8.1" r="1.15" fill="currentColor" />
      <path
        d="M2.75 13.4 6.6 10.4l2.55 2.1 2.05-2.45 3.7 3.55"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 12.25h5.25L21.5 15.2V20a1.75 1.75 0 0 1-1.75 1.75h-6.5A1.75 1.75 0 0 1 11.5 20v-6a1.75 1.75 0 0 1 1.75-1.75Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 12.25V15.2h2.95"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Two offset pages. */
export function IconToolMergePdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M7 6.25h8.25A1.75 1.75 0 0 1 17 8v11.25H8.75A1.75 1.75 0 0 1 7 17.5V6.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 4.25h8.25A1.75 1.75 0 0 1 20 6v11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.25h4M10 15.5h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Page with a small image tile. */
export function IconToolPdfToImages() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5.5 3.5h8.25L18.5 8.25V19.5A1.75 1.75 0 0 1 16.75 21.25H5.5A1.75 1.75 0 0 1 3.75 19.5V5.25A1.75 1.75 0 0 1 5.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 3.5V8.25H18.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <rect
        x="6.75"
        y="11.5"
        width="8.5"
        height="6.25"
        rx="1.15"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.9 16.6 9.2 14.5l1.85 1.45 1.35-1.35 2.7 2.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Page with inward compression arrows. */
export function IconToolSlimPdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M6.5 4.25h8.25L19.5 9v10.25A1.75 1.75 0 0 1 17.75 21H6.5A1.75 1.75 0 0 1 4.75 19.25V6A1.75 1.75 0 0 1 6.5 4.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 4.25V9H19.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25 12 14.25 15 11.25M9 16.75 12 13.75 15 16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Letter tiles. */
export function IconToolWordUnscrambler() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="13"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5.35 15.35 7 8.9l1.65 6.45M5.75 13.35h2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.15 8.9v6.45M15.1 15.35h3.35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Stacked lines being tidied. */
export function IconToolTextCleaner() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.5 6.5h15M4.5 12h11M4.5 17.5h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17.2 14.2 19.6 16.6M19.6 14.2 17.2 16.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Word count — tally marks / lines. */
export function IconToolWordCounter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.5h4.5M5 12h7M5 16.5h5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8.25 18.75 16.5M18.75 8.25 15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Aa. */
export function IconToolCaseConverter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.6 18 8.1 8.5 11.6 18M5.7 15.15h5.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4 18v-6.4c0-1.7 1.15-2.7 2.7-2.7 1.55 0 2.7 1 2.7 2.7V18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14.4 14.35h5.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces. */
export function IconToolJsonFormatter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.25H7.4A2.15 2.15 0 0 0 5.25 7.4v2.35c0 .7-.55 1.25-1.25 1.25.7 0 1.25.55 1.25 1.25V16.6A2.15 2.15 0 0 0 7.4 18.75H9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5.25h1.6A2.15 2.15 0 0 1 18.75 7.4v2.35c0 .7.55 1.25 1.25 1.25-.7 0-1.25.55-1.25 1.25V16.6A2.15 2.15 0 0 1 16.6 18.75H15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Base64 — stacked bars suggesting encoded blocks. */
export function IconToolBase64() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.25h14M5 12h10M5 16.75h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.75 10.5 19.5 12l-2.75 1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Link / percent-encoding. */
export function IconToolUrlEncode() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9.5 14.5 7.75 16.25a3.25 3.25 0 0 1-4.6-4.6L5.5 9.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5 16.25 7.75a3.25 3.25 0 0 1 4.6 4.6L18.5 14.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 14.25 14.25 9.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Grid / spreadsheet columns. */
export function IconToolCsvColumnExtractor() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 9.25h17M3.5 14h17M9.25 4.5v15M14.75 4.5v15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Table to braces — CSV → JSON. */
export function IconToolCsvToJson() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.25 9.25h7.5M3.25 13.5h7.5M6.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.1 7.1c0-1.15.85-1.85 2-1.85h1.15M14.1 16.9c0 1.15.85 1.85 2 1.85h1.15M19.9 7.1c0-1.15-.85-1.85-2-1.85H16.75M19.9 16.9c0 1.15-.85 1.85-2 1.85H16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12.4 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces to table — JSON → CSV. */
export function IconToolJsonToCsv() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.1 7.1c0-1.15.85-1.85 2-1.85H7.25M4.1 16.9c0 1.15.85 1.85 2 1.85H7.25M9.9 7.1c0-1.15-.85-1.85-2-1.85H6.75M9.9 16.9c0 1.15-.85 1.85-2 1.85H6.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M10.9 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="13.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M13.25 9.25h7.5M13.25 13.5h7.5M16.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Key — password / credentials. */
export function IconToolPasswordGenerator() {
  return (
    <svg {...HOME_ICON}>
      <circle
        cx="8.25"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M11.5 12h7.25v2.4M15.75 12v2.15M18 12v2.15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Stacked words — passphrase. */
export function IconToolPassphraseGenerator() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 8h9M5 12h14M5 16h11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Hash grid — UUID. */
export function IconToolUuidGenerator() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="4.5"
        y="7"
        width="15"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 7v10M12 7v10M16 7v10M4.5 10.5h15M4.5 13.5h15"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Token chip — API key. */
export function IconToolApiKeyGenerator() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="4.25"
        y="8.25"
        width="15.5"
        height="7.5"
        rx="3.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="9" cy="12" r="1.35" fill="currentColor" />
      <path
        d="M12.25 12h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Pound / hash mark. */
export function IconToolHashGenerator() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.5 7.5 18.5M16.5 5.5 15 18.5M5 9.75h14M4.5 14.25h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Photo-to-page: landscape image with a small document. */
export function IconToolImagesToPdf() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="10.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="6.4" cy="8.1" r="1.15" fill="currentColor" />
      <path
        d="M2.75 13.4 6.6 10.4l2.55 2.1 2.05-2.45 3.7 3.55"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 12.25h5.25L21.5 15.2V20a1.75 1.75 0 0 1-1.75 1.75h-6.5A1.75 1.75 0 0 1 11.5 20v-6a1.75 1.75 0 0 1 1.75-1.75Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 12.25V15.2h2.95"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Two offset pages. */
export function IconToolMergePdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M7 6.25h8.25A1.75 1.75 0 0 1 17 8v11.25H8.75A1.75 1.75 0 0 1 7 17.5V6.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 4.25h8.25A1.75 1.75 0 0 1 20 6v11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.25h4M10 15.5h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Page with a small image tile. */
export function IconToolPdfToImages() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5.5 3.5h8.25L18.5 8.25V19.5A1.75 1.75 0 0 1 16.75 21.25H5.5A1.75 1.75 0 0 1 3.75 19.5V5.25A1.75 1.75 0 0 1 5.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 3.5V8.25H18.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <rect
        x="6.75"
        y="11.5"
        width="8.5"
        height="6.25"
        rx="1.15"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.9 16.6 9.2 14.5l1.85 1.45 1.35-1.35 2.7 2.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Page with inward compression arrows. */
export function IconToolSlimPdf() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M6.5 4.25h8.25L19.5 9v10.25A1.75 1.75 0 0 1 17.75 21H6.5A1.75 1.75 0 0 1 4.75 19.25V6A1.75 1.75 0 0 1 6.5 4.25Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 4.25V9H19.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25 12 14.25 15 11.25M9 16.75 12 13.75 15 16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Letter tiles. */
export function IconToolWordUnscrambler() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="13"
        y="6"
        width="8"
        height="12"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M5.35 15.35 7 8.9l1.65 6.45M5.75 13.35h2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.15 8.9v6.45M15.1 15.35h3.35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Stacked lines being tidied. */
export function IconToolTextCleaner() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.5 6.5h15M4.5 12h11M4.5 17.5h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17.2 14.2 19.6 16.6M19.6 14.2 17.2 16.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Word count — tally marks / lines. */
export function IconToolWordCounter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.5h4.5M5 12h7M5 16.5h5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8.25 18.75 16.5M18.75 8.25 15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Aa. */
export function IconToolCaseConverter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.6 18 8.1 8.5 11.6 18M5.7 15.15h5.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4 18v-6.4c0-1.7 1.15-2.7 2.7-2.7 1.55 0 2.7 1 2.7 2.7V18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14.4 14.35h5.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces. */
export function IconToolJsonFormatter() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.25H7.4A2.15 2.15 0 0 0 5.25 7.4v2.35c0 .7-.55 1.25-1.25 1.25.7 0 1.25.55 1.25 1.25V16.6A2.15 2.15 0 0 0 7.4 18.75H9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5.25h1.6A2.15 2.15 0 0 1 18.75 7.4v2.35c0 .7.55 1.25 1.25 1.25-.7 0-1.25.55-1.25 1.25V16.6A2.15 2.15 0 0 1 16.6 18.75H15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Base64 — stacked bars suggesting encoded blocks. */
export function IconToolBase64() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 7.25h14M5 12h10M5 16.75h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.75 10.5 19.5 12l-2.75 1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Link / percent-encoding. */
export function IconToolUrlEncode() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9.5 14.5 7.75 16.25a3.25 3.25 0 0 1-4.6-4.6L5.5 9.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5 16.25 7.75a3.25 3.25 0 0 1 4.6 4.6L18.5 14.7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 14.25 14.25 9.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Grid / spreadsheet columns. */
export function IconToolCsvColumnExtractor() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 9.25h17M3.5 14h17M9.25 4.5v15M14.75 4.5v15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Table to braces — CSV → JSON. */
export function IconToolCsvToJson() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="3.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.25 9.25h7.5M3.25 13.5h7.5M6.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.1 7.1c0-1.15.85-1.85 2-1.85h1.15M14.1 16.9c0 1.15.85 1.85 2 1.85h1.15M19.9 7.1c0-1.15-.85-1.85-2-1.85H16.75M19.9 16.9c0 1.15-.85 1.85-2 1.85H16.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12.4 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Braces to table — JSON → CSV. */
export function IconToolJsonToCsv() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M4.1 7.1c0-1.15.85-1.85 2-1.85H7.25M4.1 16.9c0 1.15.85 1.85 2 1.85H7.25M9.9 7.1c0-1.15-.85-1.85-2-1.85H6.75M9.9 16.9c0 1.15-.85 1.85-2 1.85H6.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M10.9 12h1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="13.25"
        y="5"
        width="7.5"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M13.25 9.25h7.5M13.25 13.5h7.5M16.25 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Key — password / credentials. */
export function IconToolPasswordGenerator() {
  return (
    <svg {...HOME_ICON}>
      <circle
        cx="8.25"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M11.5 12h7.25v2.4M15.75 12v2.15M18 12v2.15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Stacked words — passphrase. */
export function IconToolPassphraseGenerator() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M5 8h9M5 12h14M5 16h11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Hash grid — UUID. */
export function IconToolUuidGenerator() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="4.5"
        y="7"
        width="15"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 7v10M12 7v10M16 7v10M4.5 10.5h15M4.5 13.5h15"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Token chip — API key. */
export function IconToolApiKeyGenerator() {
  return (
    <svg {...HOME_ICON}>
      <rect
        x="4.25"
        y="8.25"
        width="15.5"
        height="7.5"
        rx="3.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="9" cy="12" r="1.35" fill="currentColor" />
      <path
        d="M12.25 12h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Pound / hash mark. */
export function IconToolHashGenerator() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.5 7.5 18.5M16.5 5.5 15 18.5M5 9.75h14M4.5 14.25h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Keyed hash — HMAC. */
export function IconToolHmacGenerator() {
  return (
    <svg {...HOME_ICON}>
      <path
        d="M9 5.5 7.5 18.5M16.5 5.5 15 18.5M5 9.75h14M4.5 14.25h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle
        cx="18.25"
        cy="6.5"
        r="1.6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

/** Clock + shield — OTP. */
export function IconToolOtpSecret() {
  return (
    <svg {...HOME_ICON}>
      <circle
        cx="12"
        cy="12"
        r="7.25"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M12 8.25V12l2.5 1.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
