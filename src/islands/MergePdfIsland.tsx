import { PdfReadyBridge } from '../components/PdfReadyBridge'
import { MergeMode } from '../modes/merge/MergeMode'
import { MODE_META } from '../types'

export default function MergePdfIsland() {
  return (
    <PdfReadyBridge Tool={MergeMode} privacyReady={MODE_META.merge.privacyReady} />
  )
}
