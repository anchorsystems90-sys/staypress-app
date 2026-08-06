import { useId, useRef, useState, type ReactNode } from 'react'

type StageProps = {
  accept: string
  multiple?: boolean
  compact: boolean
  showSheets?: boolean
  title: string
  hint: string
  onFiles: (files: FileList | File[]) => void
  icon?: ReactNode
}

export function Stage({
  accept,
  multiple = true,
  compact,
  showSheets = true,
  title,
  hint,
  onFiles,
  icon,
}: StageProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draggingOver, setDraggingOver] = useState(false)

  return (
    <section
      className={[
        'stage',
        draggingOver ? 'stage--active' : '',
        compact ? 'stage--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onDragOver={(e) => {
        e.preventDefault()
        setDraggingOver(true)
      }}
      onDragLeave={() => setDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDraggingOver(false)
        if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files)
      }}
    >
      {!compact && showSheets && (
        <div className="sheets" aria-hidden="true">
          <span className="sheet sheet--a" />
          <span className="sheet sheet--b" />
          <span className="sheet sheet--c" />
        </div>
      )}

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <label htmlFor={inputId} className="stage__label">
        <span className="stage__icon" aria-hidden="true">
          {icon ?? (
            <svg viewBox="0 0 56 56" fill="none">
              <path
                d="M18 16h14l8 8v22a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V18a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M32 16v8h8" stroke="currentColor" strokeWidth="2" />
              <path
                d="M28 26v12m0-12-4 4m4-4 4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="stage__title">{title}</span>
        <span className="stage__hint">{hint}</span>
      </label>
    </section>
  )
}
