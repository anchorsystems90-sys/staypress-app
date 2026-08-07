import type { AppMode } from '../types'
import { MODE_META } from '../types'
import { pathForMode } from '../seoData'

const MODES: AppMode[] = ['images', 'merge', 'extract', 'slim']

type ModeSwitcherProps = {
  mode: AppMode
  onChange: (mode: AppMode) => void
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="mode-switch" role="tablist" aria-label="Tool mode">
      {MODES.map((id) => {
        const active = id === mode
        return (
          <a
            key={id}
            href={pathForMode(id)}
            role="tab"
            aria-selected={active}
            className={`mode-switch__btn ${active ? 'mode-switch__btn--active' : ''}`}
            onClick={(e) => {
              // SPA navigation: update mode without a full page reload.
              e.preventDefault()
              onChange(id)
            }}
          >
            {MODE_META[id].label}
          </a>
        )
      })}
    </div>
  )
}
