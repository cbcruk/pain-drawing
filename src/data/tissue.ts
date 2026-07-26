import type { Tissue } from '@/types/anatomy.types'

interface TissueStyle {
  fill: string
  /** fill 위에 얹는 글자색 — 밝은 조직 색에서 흰 글자는 읽히지 않는다 */
  onFill: string
  label: string
}

export const TISSUE: Record<Tissue, TissueStyle> = {
  muscle: { fill: '#A85D4C', onFill: '#FFFFFF', label: '근육' },
  tendon: { fill: '#D0BA88', onFill: '#2C2717', label: '힘줄' },
  ligament: { fill: '#B79A9A', onFill: '#2A1D1D', label: '인대' },
  fascia: { fill: '#93A192', onFill: '#1E2A1E', label: '건막' },
  nerve: { fill: '#8E86A8', onFill: '#1D1A28', label: '신경' },
  bone: { fill: '#B8AF96', onFill: '#2A261A', label: '뼈' },
}
