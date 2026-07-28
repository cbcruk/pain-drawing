import type { StructureInView, View } from '@/types/anatomy.types'

interface MirrorOverrides {
  id: string
  label: { ko: string; en: string }
}

/*
  반대쪽은 새로 트레이싱한 뷰가 아니다. 좌표·랜드마크·층 구성을 원본 그대로
  쓰고 렌더에서만 좌우를 뒤집는다. 내측/외측은 신체 기준 용어라 반전해도
  그대로 맞고, 정규화 좌표가 원본 공간에 남아 있어 좌우 지점 이송이 공짜다.
*/
export function mirrorView(source: View, overrides: MirrorOverrides): View {
  return {
    ...source,
    ...overrides,
    side: source.side === 'right' ? 'left' : 'right',
    mirrorOf: source.id,
  }
}

export function mirrorPlacements(
  placements: StructureInView[],
  viewId: string,
): StructureInView[] {
  return placements.map((placement) => ({ ...placement, viewId }))
}
