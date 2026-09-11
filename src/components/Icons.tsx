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
