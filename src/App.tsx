import { useCallback, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { FeedbackDialog } from './components/FeedbackDialog'
import { ModeSwitcher } from './components/ModeSwitcher'
import { SeoIdleContent } from './components/SeoIdleContent'
import { CompressMode } from './modes/compress/CompressMode'
import { ExtractMode } from './modes/extract/ExtractMode'
import { ImagesMode } from './modes/images/ImagesMode'
import { MergeMode } from './modes/merge/MergeMode'
import {
  normalizeModeUrl,
  readModeFromUrl,
  writeModeToUrl,
} from './routing'
import { applyModeSeo, modeFromPathname } from './seo'
import type { AppMode } from './types'
import { MODE_META } from './types'
import './App.css'

const GITHUB_REPO = 'https://github.com/anchorsystems90-sys/staypress-app'

export default function App() {
  const [mode, setMode] = useState<AppMode>(() => readModeFromUrl())
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('')
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const meta = MODE_META[mode]

  // Clean legacy ?mode= / /images → path routes once on mount.
  useEffect(() => {
    normalizeModeUrl(mode)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- mount only

  useEffect(() => {
    applyModeSeo(mode)
  }, [mode])

  useEffect(() => {
    const onPopState = () => {
      const next = modeFromPathname(window.location.pathname)
      setMode(next)
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

  const onModeChange = (next: AppMode) => {
    if (next === mode) return
    setMode(next)
    setReady(false)
    setStatus('')
    writeModeToUrl(next, 'push')
  }

  return (
    <div className={`app ${ready ? 'app--ready' : 'app--idle'}`}>
      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere__wash" />
        <div className="atmosphere__grain" />
      </div>

      <header className="header">
        <div className="header__top">
          <p className="brand">
            <span className="brand__mark" aria-hidden="true">
              S
            </span>
            <span className="brand__name">Staypress</span>
          </p>
          <ModeSwitcher mode={mode} onChange={onModeChange} />
        </div>

        {!ready && (
          <>
            <p className="tagline">{meta.tagline}</p>
            <p className="privacy">{meta.privacyIdle}</p>
          </>
        )}
        {ready && status && (
          <p className="header__status">
            <span className="header__status-dot" aria-hidden="true" />
            {status}
          </p>
        )}
      </header>

      <main className="main">
        {mode === 'images' && (
          <ImagesMode key="images" onReadyChange={onReadyChange} />
        )}
        {mode === 'merge' && (
          <MergeMode key="merge" onReadyChange={onReadyChange} />
        )}
        {mode === 'extract' && (
          <ExtractMode key="extract" onReadyChange={onReadyChange} />
        )}
        {mode === 'slim' && (
          <CompressMode key="slim" onReadyChange={onReadyChange} />
        )}
      </main>

      {!ready && <SeoIdleContent mode={mode} />}

      <footer className="footer">
        <p className="footer__privacy">
          {ready
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
    </div>
  )
}
