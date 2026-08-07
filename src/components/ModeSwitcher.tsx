import type { AppMode } from '../types'
import { MODE_META } from '../types'
import { pathForMode } from '../seoData'

const MODES: AppMode[] = ['images', 'merge', 'extract', 'slim']

type ModeSwitcherProps = {
  /** Active tool, or null when viewing a non-tool page (e.g. privacy). */
  mode: AppMode | null
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
