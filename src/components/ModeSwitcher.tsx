import type { AppMode } from '../types'
import { MODE_META } from '../types'
import { pathForMode } from '../seoData'
import { PDF_TOOL_IDS } from '../toolCatalog'

type ModeSwitcherProps = {
  /** Active PDF tool. */
  mode: AppMode | null
  onChange: (mode: AppMode) => void
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="mode-switch" role="tablist" aria-label="PDF tools">
      {PDF_TOOL_IDS.map((id) => {
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
