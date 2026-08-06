import type { AppMode } from '../types'
import { MODE_META } from '../types'

const MODES: AppMode[] = ['images', 'merge', 'extract']

type ModeSwitcherProps = {
  mode: AppMode
  onChange: (mode: AppMode) => void
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="mode-switch" role="tablist" aria-label="Tool mode">
      {MODES.map((id) => {
        const active = mode === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`mode-switch__btn ${active ? 'mode-switch__btn--active' : ''}`}
            onClick={() => onChange(id)}
          >
            {MODE_META[id].label}
          </button>
        )
      })}
    </div>
  )
}
