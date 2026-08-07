import { pathForMode } from '../seoData'
import type { AppMode } from '../types'

type Props = {
  onOpenMode: (mode: AppMode) => void
}

const LINKS: { mode: AppMode; label: string }[] = [
  { mode: 'images', label: 'Images → PDF' },
  { mode: 'merge', label: 'Merge PDFs' },
  { mode: 'extract', label: 'PDF → images' },
  { mode: 'slim', label: 'Slim PDF' },
]

/** Privacy / about essay — honest client-side processing + optional network use. */
export function PrivacyPage({ onOpenMode }: Props) {
  return (
    <article className="content-page">
      <header className="content-page__header">
        <h1 className="content-page__title">Privacy &amp; about</h1>
        <p className="content-page__lede">
          Staypress is a free, open-source set of PDF tools that run in your
          browser. Conversions, merges, extracts, and slimming are designed so
          your files are not uploaded to process them.
        </p>
      </header>

      <section className="content-page__section" aria-labelledby="what-stays">
        <h2 id="what-stays" className="content-page__h2">
          What stays on your device
        </h2>
        <p>
          When you add images or PDFs, they are read and processed with
          in-browser libraries (including pdf-lib and pdf.js). Previews and
          downloads are generated locally. Staypress does not send your
          documents to a server for conversion, merge, extract, or compress.
        </p>
        <p>
          You only share the resulting file when <em>you</em> download it and
          choose where it goes next.
        </p>
      </section>

      <section className="content-page__section" aria-labelledby="what-network">
        <h2 id="what-network" className="content-page__h2">
          What may use the network
        </h2>
        <p>A few things still talk to the internet, on purpose and separately from your files:</p>
        <ul className="content-page__list">
          <li>
            <strong>Loading the app</strong> — HTML, JavaScript, CSS, fonts, and
            library workers so Staypress can run.
          </li>
          <li>
            <strong>Optional analytics</strong> — page-level usage metrics (via
            Vercel Analytics) to understand which tools people open. That does
            not include your PDF or image contents.
          </li>
          <li>
            <strong>Feedback form</strong> — only if you send a message. The
            text of bug reports, feature requests, or a hello is emailed to the
            team. Your working files are not attached.
          </li>
        </ul>
      </section>

      <section className="content-page__section" aria-labelledby="accounts">
        <h2 id="accounts" className="content-page__h2">
          No accounts
        </h2>
        <p>
          Staypress does not require sign-in. There is no Staypress cloud
          document storage and no server-side conversion queue for your uploads.
        </p>
      </section>

      <section className="content-page__section" aria-labelledby="tools">
        <h2 id="tools" className="content-page__h2">
          The tools
        </h2>
        <p>
          Everything shares the same privacy story. Jump back into a job:
        </p>
        <ul className="content-page__tools">
          {LINKS.map(({ mode, label }) => (
            <li key={mode}>
              <a
                className="content-page__tool-link"
                href={pathForMode(mode)}
                onClick={(e) => {
                  e.preventDefault()
                  onOpenMode(mode)
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="content-page__section" aria-labelledby="who">
        <h2 id="who" className="content-page__h2">
          Who builds Staypress
        </h2>
        <p>
          Staypress is an open-source product from{' '}
          <a
            href="https://anchorsystems.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anchor Systems
          </a>
          . Source is on GitHub so you can audit how conversion works and what
          the app sends over the network.
        </p>
      </section>

      <p className="content-page__note">
        This page describes the current product. If something in the app ever
        changes how files are handled, we will update this page to match.
      </p>
    </article>
  )
}
