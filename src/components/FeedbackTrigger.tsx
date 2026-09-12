import { useState } from 'react'
import { FeedbackDialog } from './FeedbackDialog'

/** Footer Feedback control — hydrate this island only, not the whole footer. */
export default function FeedbackTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="footer__link" onClick={() => setOpen(true)}>
        Feedback
      </button>
      <FeedbackDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
