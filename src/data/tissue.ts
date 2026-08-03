import type { AnchoredTissue, Tissue } from '@/types/anatomy.types'

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
  cartilage: { fill: '#9FB2B6', onFill: '#1C2528', label: '연골' },
  fascia: { fill: '#93A192', onFill: '#1E2A1E', label: '건막' },
  nerve: { fill: '#8E86A8', onFill: '#1D1A28', label: '신경' },
  vessel: { fill: '#9C4A57', onFill: '#FFFFFF', label: '혈관' },
  bone: { fill: '#B8AF96', onFill: '#2A261A', label: '뼈' },
}

const ANCHORED: AnchoredTissue[] = ['ligament', 'cartilage']

/**
 * 이 조직은 기시/정지가 아니라 부착부 2개로 적는가.
 *
 * `fascia`는 여기서 false지만 타입은 양쪽을 모두 허용한다 — 관절낭처럼 방향이
 * 없는 근막이 있기 때문이다. 저작 도구의 기본 폼을 정하는 값일 뿐이고,
 * 데이터에서 무엇이 허용되는지는 `Structure` 유니온이 정한다.
 */
export function usesAttachments(kind: Tissue): boolean {
  return (ANCHORED as Tissue[]).includes(kind)
}
