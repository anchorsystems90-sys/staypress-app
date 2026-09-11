import { PdfReadyBridge } from '../components/PdfReadyBridge'
import { CompressMode } from '../modes/compress/CompressMode'
import { MODE_META } from '../types'

export default function SlimPdfIsland() {
  return (
    <PdfReadyBridge
      Tool={CompressMode}
      privacyReady={MODE_META.slim.privacyReady}
    />
  )
}
