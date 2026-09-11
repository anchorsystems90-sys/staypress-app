import { pathForMode } from '../seoData'
import type { AppMode } from '../types'

type Props = {
  onOpenMode: (mode: AppMode) => void
  onOpenPrivacy: () => void
}

/**
 * Long-tail guide: HEIC / iPhone photos → PDF without uploading.
 * Practical steps tied to Images → PDF tool + privacy claims.
 */
export function HeicToPdfGuidePage({ onOpenMode, onOpenPrivacy }: Props) {
  return (
    <article className="content-page">
      <header className="content-page__header">
        <h1 className="content-page__title">Convert HEIC to PDF privately</h1>
        <p className="content-page__lede">
          iPhone photos often arrive as HEIC. You can turn them into a shareable
          PDF without sending the images to a convert farm. Bento Tools does the
          work in your browser — free, with no account.
        </p>
      </header>

      <section className="content-page__section" aria-labelledby="why-heic">
        <h2 id="why-heic" className="content-page__h2">
          Why HEIC shows up
        </h2>
        <p>
          Apple devices commonly capture stills as HEIC (or HEIF) to save space
          while keeping quality. Many email clients, Windows PCs, and forms
          still expect JPG or a multipage PDF. Converting yourself — on the
          same device — keeps travel, medical, and work photos out of someone
          else’s upload queue.
        </p>
      </section>

      <section className="content-page__section" aria-labelledby="how-private">
        <h2 id="how-private" className="content-page__h2">
          How Bento Tools keeps it private
        </h2>
        <p>
          The{' '}
          <a
            href={pathForMode('images')}
            onClick={(e) => {
              e.preventDefault()
              onOpenMode('images')
            }}
          >
            Images → PDF
          </a>{' '}
          tool runs conversion in the browser (including client-side HEIC
          handling when the format is supported). Your photos are not uploaded
          for the conversion step. You download the PDF when you are ready; the
          server never needs the file to build it.
        </p>
        <p>
          For the full story of what stays local and what can still use the
          network (loading the app, optional analytics, voluntary feedback
          text), see{' '}
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault()
              onOpenPrivacy()
            }}
          >
            Privacy &amp; about
          </a>
          .
        </p>
      </section>

      <section className="content-page__section" aria-labelledby="steps">
        <h2 id="steps" className="content-page__h2">
          Steps: HEIC photos → one PDF
        </h2>
        <ol className="content-page__list content-page__list--ordered">
          <li>
            Open{' '}
            <a
              href={pathForMode('images')}
              onClick={(e) => {
                e.preventDefault()
                onOpenMode('images')
              }}
            >
              Images → PDF
            </a>{' '}
            on Bento Tools.
          </li>
          <li>
            Drop or choose HEIC files (JPG, PNG, WebP, and GIF work too if you
            are mixing formats).
          </li>
          <li>
            Reorder pages if needed, check the full-screen preview, and pick a
            page size (fit / A4 / US Letter).
          </li>
          <li>Download the PDF. It is built on this device, then saved by you.</li>
        </ol>
      </section>

      <section className="content-page__section" aria-labelledby="tips">
        <h2 id="tips" className="content-page__h2">
          Tips that avoid headaches
        </h2>
        <ul className="content-page__list">
          <li>
            <strong>Large photos</strong> — Bento Tools may downscale oversized
            images on export so phones do not run out of memory. That is still
            local processing.
          </li>
          <li>
            <strong>Unsupported HEIC edge cases</strong> — some exotic variants
            fail in the browser. You’ll get a clear error rather than a silent
            cloud retry.
          </li>
          <li>
            <strong>Order matters</strong> — arrange images before download if
            receipts or document photos need a fixed sequence.
          </li>
        </ul>
      </section>

      <section className="content-page__section" aria-labelledby="related">
        <h2 id="related" className="content-page__h2">
          Related tools
        </h2>
        <p>
          After you have a PDF, you can keep working locally — merge more files,
          export pages as images, or slim a heavy export:
        </p>
        <ul className="content-page__tools">
          <li>
            <a
              className="content-page__tool-link"
              href={pathForMode('images')}
              onClick={(e) => {
                e.preventDefault()
                onOpenMode('images')
              }}
            >
              Images → PDF
            </a>
          </li>
          <li>
            <a
              className="content-page__tool-link"
              href={pathForMode('merge')}
              onClick={(e) => {
                e.preventDefault()
                onOpenMode('merge')
              }}
            >
              Merge PDFs
            </a>
          </li>
          <li>
            <a
              className="content-page__tool-link"
              href={pathForMode('extract')}
              onClick={(e) => {
                e.preventDefault()
                onOpenMode('extract')
              }}
            >
              PDF → images
            </a>
          </li>
          <li>
            <a
              className="content-page__tool-link"
              href={pathForMode('slim')}
              onClick={(e) => {
                e.preventDefault()
                onOpenMode('slim')
              }}
            >
              Slim PDF
            </a>
          </li>
        </ul>
      </section>

      <p className="content-page__note">
        This guide matches Bento Tools as it ships today. The product promise stays
        the same: conversion for this job runs on your device, not as an upload
        to process your photos.
      </p>
    </article>
  )
}
