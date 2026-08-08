import { useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { FeedbackDialog } from './components/FeedbackDialog'
import { ModeSwitcher } from './components/ModeSwitcher'
import { SeoIdleContent } from './components/SeoIdleContent'
import { CompressMode } from './modes/compress/CompressMode'
import { ExtractMode } from './modes/extract/ExtractMode'
import { ImagesMode } from './modes/images/ImagesMode'
import { MergeMode } from './modes/merge/MergeMode'
import { PrivacyPage } from './pages/PrivacyPage'
import {
  normalizeViewUrl,
  readViewFromUrl,
  writeModeToUrl,
  writePageToUrl,
  type AppView,
} from './routing'
import { applyViewSeo, viewFromPathname } from './seo'
import type { AppMode } from './types'
import { MODE_META } from './types'
import './App.css'

const GITHUB_REPO = 'https://github.com/anchorsystems90-sys/staypress-app'

export default function App() {
  const [view, setView] = useState<AppView>(() => readViewFromUrl())
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('')
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const onTool = view.kind === 'tool'
  const mode: AppMode = onTool ? view.mode : 'images'
  const meta = MODE_META[mode]
  const idleTool = onTool && !ready

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

  const openTool = (next: AppMode) => {
    setView({ kind: 'tool', mode: next })
    setReady(false)
    setStatus('')
    writeModeToUrl(next, 'push')
  }

  const openPrivacy = () => {
    setView({ kind: 'page', page: 'privacy' })
    setReady(false)
    setStatus('')
    writePageToUrl('privacy', 'push')
  }

  const goHome = () => {
    openTool('images')
  }

  return (
    <div
      className={`app ${onTool && ready ? 'app--ready' : 'app--idle'}${
        view.kind === 'page' ? ' app--content' : ''
      }`}
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
                goHome()
              }}
            >
              <span className="brand__mark" aria-hidden="true">
                S
              </span>
              <span className="brand__name">Staypress</span>
            </a>
          </p>
          <ModeSwitcher
            mode={onTool ? mode : null}
            onChange={openTool}
          />
        </div>

        {idleTool && (
          <>
            <p className="tagline">{meta.tagline}</p>
            <p className="privacy">{meta.privacyIdle}</p>
          </>
        )}
        {onTool && ready && status && (
          <p className="header__status">
            <span className="header__status-dot" aria-hidden="true" />
            {status}
          </p>
        )}
        {view.kind === 'page' && (
          <p className="tagline content-page__tagline">
            How private processing works — and what still uses the network.
          </p>
        )}
      </header>

      <main className="main">
        {view.kind === 'page' && view.page === 'privacy' && (
          <PrivacyPage onOpenMode={openTool} />
        )}
        {onTool && mode === 'images' && (
          <ImagesMode key="images" onReadyChange={onReadyChange} />
        )}
        {onTool && mode === 'merge' && (
          <MergeMode key="merge" onReadyChange={onReadyChange} />
        )}
        {onTool && mode === 'extract' && (
          <ExtractMode key="extract" onReadyChange={onReadyChange} />
        )}
        {onTool && mode === 'slim' && (
          <CompressMode key="slim" onReadyChange={onReadyChange} />
        )}
      </main>

      {idleTool && <SeoIdleContent mode={mode} />}

      <footer className="footer">
        <p className="footer__privacy">
          {onTool && ready
            ? meta.privacyReady
            : 'No account. No upload. Everything runs on this device.'}
        </p>
        <p className="footer__maker">
          <span className="footer__maker-label">An open-source tool from</span>{' '}
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
            href="/privacy"
            onClick={(e) => {
              e.preventDefault()
              if (view.kind === 'page' && view.page === 'privacy') return
              openPrivacy()
            }}
          >
            Privacy
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
