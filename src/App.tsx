import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { FeedbackDialog } from './components/FeedbackDialog'
import { ModeSwitcher } from './components/ModeSwitcher'
import { SeoIdleContent } from './components/SeoIdleContent'
import { CompressMode } from './modes/compress/CompressMode'
import { ExtractMode } from './modes/extract/ExtractMode'
import { ImagesMode } from './modes/images/ImagesMode'
import { MergeMode } from './modes/merge/MergeMode'
import { HomePage } from './pages/HomePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { HeicToPdfGuidePage } from './pages/HeicToPdfGuidePage'
import {
  normalizeViewUrl,
  readViewFromUrl,
  writeHomeToUrl,
  writePageToUrl,
  writeToolToUrl,
  type AppView,
} from './routing'
import { applyViewSeo, CONTENT_PAGE_SEO, SITE_NAME, viewFromPathname } from './seo'
import { isPdfTool, WORD_UNSCRAMBLER_META, type ToolId } from './toolCatalog'
import type { AppMode } from './types'
import { MODE_META } from './types'
import './App.css'

const WordUnscrambler = lazy(
  () => import('./tools/word-unscrambler/WordUnscrambler'),
)

const GITHUB_REPO = 'https://github.com/anchorsystems90-sys/staypress-app'

export default function App() {
  const [view, setView] = useState<AppView>(() => readViewFromUrl())
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('')
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const onHome = view.kind === 'home'
  const onTool = view.kind === 'tool'
  const toolId: ToolId | null = onTool ? view.id : null
  const pdfMode: AppMode | null = toolId && isPdfTool(toolId) ? toolId : null
  const onPdf = pdfMode !== null
  const onWord = toolId === 'word-unscrambler'
  const pdfMeta = pdfMode ? MODE_META[pdfMode] : null
  const idleTool = onTool && (onWord || !ready)

  useEffect(() => {
    normalizeViewUrl(view)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- mount only

  useEffect(() => {
    applyViewSeo(view)
  }, [view])

  useEffect(() => {
    const onPopState = () => {
      setView(viewFromPathname(window.location.pathname))
      setReady(false)
      setStatus('')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const onReadyChange = useCallback((nextReady: boolean, nextStatus: string) => {
    setReady(nextReady)
    setStatus(nextStatus)
  }, [])

  const openTool = (next: ToolId) => {
    setView({ kind: 'tool', id: next })
    setReady(false)
    setStatus('')
    writeToolToUrl(next, 'push')
  }

  const openPdfTool = (next: AppMode) => {
    openTool(next)
  }

  const openPage = (page: 'privacy' | 'heic-to-pdf') => {
    setView({ kind: 'page', page })
    setReady(false)
    setStatus('')
    writePageToUrl(page, 'push')
  }

  const openPrivacy = () => {
    openPage('privacy')
  }

  const goHome = () => {
    setView({ kind: 'home' })
    setReady(false)
    setStatus('')
    writeHomeToUrl('push')
  }

  const contentTagline =
    view.kind === 'page' ? CONTENT_PAGE_SEO[view.page].tagline : null

  const idleTagline = onWord
    ? WORD_UNSCRAMBLER_META.tagline
    : idleTool && pdfMeta
      ? pdfMeta.tagline
      : null

  const idlePrivacy = onWord
    ? WORD_UNSCRAMBLER_META.privacyIdle
    : idleTool && pdfMeta
      ? pdfMeta.privacyIdle
      : null

  return (
    <div
      className={`app ${onPdf && ready ? 'app--ready' : 'app--idle'}${
        view.kind === 'page' ? ' app--content' : ''
      }${onHome ? ' app--home' : ''}`}
    >
      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere__wash" />
        <div className="atmosphere__grain" />
      </div>

      <header className="header">
        <div className="header__top">
          <p className="brand">
            <a
              className="brand__home"
              href="/"
              onClick={(e) => {
                e.preventDefault()
                if (onHome) return
                goHome()
              }}
            >
              <span className="brand__mark" aria-hidden="true">
                B
              </span>
              <span className="brand__name">{SITE_NAME}</span>
            </a>
          </p>
          {onPdf && (
            <ModeSwitcher mode={pdfMode} onChange={openPdfTool} />
          )}
        </div>

        {idleTagline && (
          <>
            <p className="tagline">{idleTagline}</p>
            {idlePrivacy && <p className="privacy">{idlePrivacy}</p>}
          </>
        )}
        {onPdf && ready && status && (
          <p className="header__status">
            <span className="header__status-dot" aria-hidden="true" />
            {status}
          </p>
        )}
        {contentTagline && (
          <p className="tagline content-page__tagline">{contentTagline}</p>
        )}
      </header>

      <main className="main">
        {onHome && <HomePage onOpenTool={openTool} />}
        {view.kind === 'page' && view.page === 'privacy' && (
          <PrivacyPage
            onOpenTool={openTool}
            onOpenGuide={() => openPage('heic-to-pdf')}
          />
        )}
        {view.kind === 'page' && view.page === 'heic-to-pdf' && (
          <HeicToPdfGuidePage
            onOpenMode={openPdfTool}
            onOpenPrivacy={openPrivacy}
          />
        )}
        {onPdf && pdfMode === 'images' && (
          <ImagesMode key="images" onReadyChange={onReadyChange} />
        )}
        {onPdf && pdfMode === 'merge' && (
          <MergeMode key="merge" onReadyChange={onReadyChange} />
        )}
        {onPdf && pdfMode === 'extract' && (
          <ExtractMode key="extract" onReadyChange={onReadyChange} />
        )}
        {onPdf && pdfMode === 'slim' && (
          <CompressMode key="slim" onReadyChange={onReadyChange} />
        )}
        {onWord && (
          <Suspense
            fallback={
              <p className="unscramble__loading" role="status">
                Loading Word Unscrambler…
              </p>
            }
          >
            <WordUnscrambler />
          </Suspense>
        )}
      </main>

      {idleTool && toolId && <SeoIdleContent tool={toolId} />}

      <footer className="footer">
        <p className="footer__privacy">
          {onPdf && ready && pdfMeta
            ? pdfMeta.privacyReady
            : 'No account. No upload. Everything runs on this device.'}
        </p>
        <p className="footer__maker">
          <span className="footer__maker-label">An open-source product from</span>{' '}
          <a
            className="footer__maker-link"
            href="https://anchorsystems.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anchor Systems
          </a>
          <span className="footer__maker-sep" aria-hidden="true">
            ·
          </span>
          <a
            className="footer__cta"
            href="https://anchorsystems.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Technology delivery that ships
            <span className="footer__cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </p>
        <nav className="footer__links" aria-label="Project">
          <a
            className="footer__link"
            href={CONTENT_PAGE_SEO.privacy.path}
            onClick={(e) => {
              e.preventDefault()
              if (view.kind === 'page' && view.page === 'privacy') return
              openPage('privacy')
            }}
          >
            {CONTENT_PAGE_SEO.privacy.footerLabel}
          </a>
          <span className="footer__maker-sep" aria-hidden="true">
            ·
          </span>
          <a
            className="footer__link"
            href={CONTENT_PAGE_SEO['heic-to-pdf'].path}
            onClick={(e) => {
              e.preventDefault()
              if (view.kind === 'page' && view.page === 'heic-to-pdf') return
              openPage('heic-to-pdf')
            }}
          >
            {CONTENT_PAGE_SEO['heic-to-pdf'].footerLabel}
          </a>
          <span className="footer__maker-sep" aria-hidden="true">
            ·
          </span>
          <a
            className="footer__link"
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
          <span className="footer__maker-sep" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className="footer__link"
            onClick={() => setFeedbackOpen(true)}
          >
            Feedback
          </button>
        </nav>
      </footer>

      <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      <Analytics />
      <SpeedInsights />
    </div>
  )
}
