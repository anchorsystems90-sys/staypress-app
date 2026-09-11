import { useCallback, useEffect, useState, type ComponentType } from 'react'
import { DEFAULT_FOOTER_PRIVACY } from '../seoData'

type ReadyTool = ComponentType<{
  onReadyChange?: (ready: boolean, status: string) => void
}>

type Props = {
  Tool: ReadyTool
  privacyReady: string
}

/**
 * Hydrates one PDF tool and mirrors ready/status onto the static page chrome.
 * Does not import PDF modes itself — pass the specific tool from the page island.
 */
export function PdfReadyBridge({ Tool, privacyReady }: Props) {
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('')

  const onReadyChange = useCallback((nextReady: boolean, nextStatus: string) => {
    setReady(nextReady)
    setStatus(nextStatus)
  }, [])

  useEffect(() => {
    const app = document.querySelector('.app')
    app?.classList.toggle('app--ready', ready)
    app?.classList.toggle('app--idle', !ready)

    document.querySelectorAll<HTMLElement>('[data-pdf-idle]').forEach((el) => {
      el.hidden = ready
    })

    const statusEl = document.querySelector<HTMLElement>('[data-pdf-status]')
    const statusText = document.querySelector('[data-pdf-status-text]')
    if (statusEl && statusText) {
      statusText.textContent = status
      statusEl.hidden = !(ready && status)
    }

    const privacy = document.querySelector('.footer__privacy')
    if (privacy) {
      privacy.textContent = ready ? privacyReady : DEFAULT_FOOTER_PRIVACY
    }
  }, [ready, status, privacyReady])

  return <Tool onReadyChange={onReadyChange} />
}
