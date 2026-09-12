import { PdfReadyBridge } from '../components/PdfReadyBridge'
import { ImagesMode } from '../modes/images/ImagesMode'
import { MODE_META } from '../types'

export default function ImagesToPdfIsland() {
  return (
    <PdfReadyBridge
      Tool={ImagesMode}
      privacyReady={MODE_META.images.privacyReady}
    />
  )
}
