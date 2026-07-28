import type {
  Probe,
  ProbeCandidate,
  Pt,
  Structure,
  StructureInView,
  View,
} from '@/types/anatomy.types'
import { effectiveProvenance } from './reference'

/**
 * structureId → 그 구조가 이 뷰에서 렌더한 SVG element들.
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

    const elements = registry.get(placement.structureId)
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
