import { useEffect } from 'react'

type ViewerProps = {
  name: string
  url: string
  index: number
  total: number
  onClose: () => void
  onStep: (direction: -1 | 1) => void
}

export function Viewer({ name, url, index, total, onClose, onStep }: ViewerProps) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onStep(-1)
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onStep(1)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onStep])

  return (
    <div
      className="viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${name}, page ${index + 1} of ${total}`}
      onClick={onClose}
    >
      <button
        type="button"
        className="viewer__close"
        aria-label="Close preview"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        Close
      </button>

      <p className="viewer__counter" aria-live="polite">
        {index + 1} / {total}
      </p>

      <button
        type="button"
        className="viewer__nav viewer__nav--prev"
        aria-label="Previous image"
        disabled={index === 0}
        onClick={(e) => {
          e.stopPropagation()
          onStep(-1)
        }}
      >
        ‹
      </button>

      <img
        key={url}
        src={url}
        alt={name}
        className="viewer__image"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        type="button"
        className="viewer__nav viewer__nav--next"
        aria-label="Next image"
        disabled={index === total - 1}
        onClick={(e) => {
          e.stopPropagation()
          onStep(1)
        }}
      >
        ›
      </button>
    </div>
  )
}
