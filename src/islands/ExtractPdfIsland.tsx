import { PdfReadyBridge } from '../components/PdfReadyBridge'
import { ExtractMode } from '../modes/extract/ExtractMode'
import { MODE_META } from '../types'

export default function ExtractPdfIsland() {
  return (
    <PdfReadyBridge
      Tool={ExtractMode}
      privacyReady={MODE_META.extract.privacyReady}
    />
  )
}
