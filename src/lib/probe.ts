import type {
  Probe,
  ProbeCandidate,
  Pt,
  Structure,
  StructureInView,
  View,
} from '@/types/anatomy.types'
import { effectiveProvenance } from './reference'

/** 레지스트리 키 — 한 구조가 한 뷰에서 두 깊이에 놓일 수 있다(ADR 0002) */
export function shapeKey(structureId: string, depth: number): string {
  return `${structureId}:${depth}`
}

/**
 * `structureId:depth` → 그 자리가 이 뷰에서 렌더한 SVG element들.
 *
 * 키에 depth가 들어가는 이유는 한 구조가 한 뷰 안에서 두 깊이에 놓일 수 있기
 * 때문이다(대내전근이 허벅지 뒤에서 안쪽 모서리 L1 · 바닥 L3). structureId만
 * 쓰면 나중 자리가 앞의 것을 덮어써서 **한쪽이 조용히 안 잡힌다**.
 *
 * 히트테스트가 DOM에 의존하므로 비활성 층도 display:none 없이 렌더된 상태를
 * 유지해야 한다. isPointInFill은 fill="none"과 pointer-events:none에 영향받지
 * 않으므로 고스트로 그린 층도 후보로 잡힌다.
 */
export type ShapeRegistry = Map<string, (SVGGeometryElement | null)[]>

function containsPoint(
  elements: (SVGGeometryElement | null)[],
  point: DOMPoint,
): boolean {
  return elements.some((el) => {
    if (!el) return false

    try {
      return el.isPointInFill(point)
    } catch {
      return false
    }
  })
}

export function probeAt(
  point: Pt,
  view: View,
  placements: StructureInView[],
  structures: Map<string, Structure>,
  registry: ShapeRegistry,
): Probe {
  const domPoint = new DOMPoint(point[0], point[1])
  const candidates: ProbeCandidate[] = []

  for (const placement of placements) {
    const structure = structures.get(placement.structureId)
    if (!structure) continue

    const elements = registry.get(
      shapeKey(placement.structureId, placement.depth),
    )
    if (!elements || !containsPoint(elements, domPoint)) continue

    candidates.push({
      structure,
      depth: placement.depth,
      reachable: placement.reachable,
      provenance: effectiveProvenance(placement, view),
    })
  }

  candidates.sort((a, b) => a.depth - b.depth)

  return { point, viewId: view.id, candidates }
}
