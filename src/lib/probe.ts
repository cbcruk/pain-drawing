import type {
  Probe,
  ProbeCandidate,
  Pt,
  Structure,
  StructureInView,
} from '@/types/anatomy.types'

/**
 * structureId → 그 구조가 이 뷰에서 렌더한 SVG element들.
 * 히트테스트가 DOM에 의존하므로 비활성 층도 display:none 대신
 * opacity 0 + pointer-events none으로 렌더된 상태를 유지해야 한다.
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
  viewId: string,
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
    })
  }

  candidates.sort((a, b) => a.depth - b.depth)

  return { point, viewId, candidates }
}
