import { useCallback, useEffect, useState } from 'react'
import { ModeSwitcher } from './components/ModeSwitcher'
import { CompressMode } from './modes/compress/CompressMode'
import { ExtractMode } from './modes/extract/ExtractMode'
import { ImagesMode } from './modes/images/ImagesMode'
import { MergeMode } from './modes/merge/MergeMode'
import type { AppMode } from './types'
import { MODE_META, parseAppMode } from './types'
import './App.css'

function readModeFromUrl(): AppMode {
  if (typeof window === 'undefined') return 'images'
  return parseAppMode(new URLSearchParams(window.location.search).get('mode'))
}

function writeModeToUrl(mode: AppMode) {
  const url = new URL(window.location.href)
  if (mode === 'images') {
    url.searchParams.delete('mode')
  } else {
    url.searchParams.set('mode', mode)
  }
  window.history.replaceState({}, '', url)
}

export default function App() {
  const [mode, setMode] = useState<AppMode>(() => readModeFromUrl())
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('')

  const meta = MODE_META[mode]

  useEffect(() => {
    writeModeToUrl(mode)
  }, [mode])

  const onReadyChange = useCallback((nextReady: boolean, nextStatus: string) => {
    setReady(nextReady)
    setStatus(nextStatus)
  }, [])

  const onModeChange = (next: AppMode) => {
    if (next === mode) return
    setMode(next)
    setReady(false)
    setStatus('')
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

      <footer className="footer">
        <p className="footer__privacy">
          {ready
            ? meta.privacyReady
            : 'No account. No upload. Everything runs on this device.'}
        </p>
        <p className="footer__maker">
          <span className="footer__maker-label">A free tool from</span>{' '}
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
      </footer>
    </div>
  )
}
