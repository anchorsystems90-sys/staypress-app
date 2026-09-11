import { lazy, Suspense } from 'react'
import type { NonPdfToolId } from '../toolCatalog'

const WordUnscrambler = lazy(
  () => import('./word-unscrambler/WordUnscrambler'),
)
const TextCleaner = lazy(() => import('./text-cleaner/TextCleaner'))
const CaseConverter = lazy(() => import('./case-converter/CaseConverter'))
const JsonFormatter = lazy(() => import('./json-formatter/JsonFormatter'))

type Props = {
  id: NonPdfToolId
}

export function StandaloneWorkspace({ id }: Props) {
  return (
    <Suspense
      fallback={
        <p className="unscramble__loading" role="status">
          Loading tool…
        </p>
      }
    >
      {id === 'word-unscrambler' && <WordUnscrambler />}
      {id === 'text-cleaner' && <TextCleaner />}
      {id === 'case-converter' && <CaseConverter />}
      {id === 'json-formatter' && <JsonFormatter />}
    </Suspense>
  )
}
