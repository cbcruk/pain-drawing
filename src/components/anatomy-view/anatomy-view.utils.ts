import type { StructureInView, Tissue } from '@/types/anatomy.types'
import { TISSUE } from '@/data/tissue'
import { withSaturation } from '@/lib/color'
import type { ShapeStyle, ShapeStyleInput } from './anatomy-view.types'

/*
  박리 의미론상 얕은 층은 "이미 걷어낸 것"이고 깊은 층은 "아직 덮여 있는 것"이라
  같은 흐림으로 그리면 안 된다. Gray's 도판도 위 층은 절단연으로, 아래 층은
  비쳐 보이는 덩어리로 남긴다. (SPEC "트레이싱 소스" 참조)
*/
const ABOVE_STROKE_OPACITY = [0.3, 0.19, 0.12, 0.08]
const BELOW_FILL_OPACITY = [0.1, 0.062, 0.04, 0.028]
const DEEPEST_SATURATION = 0.55

function rampAt(ramp: number[], distance: number): number {
  return ramp[Math.min(distance, ramp.length) - 1] ?? 0
}

export function depthFill(
  tissue: Tissue,
  depth: number,
  maxDepth: number,
): string {
  if (maxDepth <= 0) return TISSUE[tissue].fill

  const t = Math.min(Math.max(depth / maxDepth, 0), 1)

  return withSaturation(
    TISSUE[tissue].fill,
    1 - (1 - DEEPEST_SATURATION) * t,
  )
}

export function shapeStyle({
  tissue,
  depth,
  activeDepth,
  maxDepth,
  selected,
  hovered,
}: ShapeStyleInput): ShapeStyle {
  const fill = depthFill(tissue, depth, maxDepth)
  const distance = depth - activeDepth

  if (distance === 0) {
    return {
      fill,
      fillOpacity: selected ? 0.95 : hovered ? 0.8 : 0.62,
      stroke: selected ? 'var(--color-accent)' : 'var(--color-edge)',
      strokeOpacity: selected ? 1 : 0.5,
      strokeWidth: selected ? 2 : 0.7,
    }
  }

  if (distance < 0) {
    return {
      fill: 'none',
      fillOpacity: 0,
      stroke: selected ? 'var(--color-accent)' : 'var(--color-edge)',
      strokeOpacity: selected ? 0.9 : rampAt(ABOVE_STROKE_OPACITY, -distance),
      strokeWidth: selected ? 1.2 : 0.8,
      strokeDasharray: '3 3',
    }
  }

  return {
    fill,
    fillOpacity: selected ? 0.3 : rampAt(BELOW_FILL_OPACITY, distance),
    stroke: selected ? 'var(--color-accent)' : 'none',
    strokeOpacity: selected ? 0.9 : 0,
    strokeWidth: selected ? 1.2 : 0,
    strokeDasharray: selected ? '3 3' : undefined,
  }
}

/*
  깊은 층부터 깔고 활성 층을 얹은 뒤, 걷어낸 층의 절단연을 맨 위에 올린다.
*/
export function sortForPainting(
  placements: StructureInView[],
  activeDepth: number,
): StructureInView[] {
  const band = (depth: number): number =>
    depth > activeDepth ? 0 : depth === activeDepth ? 1 : 2

  return [...placements].sort(
    (a, b) => band(a.depth) - band(b.depth) || b.depth - a.depth,
  )
}
