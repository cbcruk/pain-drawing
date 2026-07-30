import type { BBox, Pt, Shape } from '@/types/anatomy.types'

const round2 = (n: number): number => Math.round(n * 100) / 100

const midpoint = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

function smoothClosedPath(points: Pt[]): string {
  if (points.length < 3) return ''

  const last = points[points.length - 1]!
  const first = points[0]!
  const start = midpoint(last, first)

  let d = `M ${round2(start[0])} ${round2(start[1])}`

  for (let i = 0; i < points.length; i++) {
    const current = points[i]!
    const next = points[(i + 1) % points.length]!
    const m = midpoint(current, next)
    d += ` Q ${round2(current[0])} ${round2(current[1])} ${round2(m[0])} ${round2(m[1])}`
  }

  return `${d} Z`
}

function normals(points: Pt[]): Pt[] {
  const n = points.length

  return points.map((_, i) => {
    const a = points[Math.max(0, i - 1)]!
    const b = points[Math.min(n - 1, i + 1)]!
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dx, dy) || 1

    return [-dy / len, dx / len]
  })
}

/**
 * 중심선 points와 각 지점의 폭 widths로 닫힌 리본 path를 만든다.
 * 저장 형식이 path 문자열이 아니라 숫자 배열이므로 diff와 수동 보정이 가능하다.
 */
export function ribbon(points: Pt[], widths: number[]): string {
  if (points.length < 2) return ''

  const norms = normals(points)
  const side = (sign: number): Pt[] =>
    points.map((p, i) => {
      const half = ((widths[i] ?? widths[widths.length - 1] ?? 0) / 2) * sign

      return [p[0] + norms[i]![0] * half, p[1] + norms[i]![1] * half]
    })

  return smoothClosedPath([...side(1), ...side(-1).reverse()])
}

export function circlePath(center: Pt, r: number): string {
  const [cx, cy] = center

  return (
    `M ${round2(cx - r)} ${round2(cy)} ` +
    `a ${r} ${r} 0 1 0 ${r * 2} 0 ` +
    `a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`
  )
}

export function shapeToPath(shape: Shape): string {
  return shape.t === 'circle'
    ? circlePath(shape.c, shape.r)
    : ribbon(shape.p, shape.w)
}

function viewBoxMirrorAxis(viewBox: string): number {
  const [x, , w] = viewBox.split(/[\s,]+/).map(Number)

  return Number.isFinite(x) && Number.isFinite(w) ? 2 * x! + w! : 0
}

/** viewBox 가로 중심을 축으로 한 반전 — 프레이밍이 그대로 유지된다 */
export function mirrorTransform(viewBox: string): string {
  return `matrix(-1 0 0 1 ${round2(viewBoxMirrorAxis(viewBox))} 0)`
}

/** 반전 뷰에서 찍힌 점을 원본 좌표계로 되돌린다 */
export function mirrorPoint(point: Pt, viewBox: string): Pt {
  return [viewBoxMirrorAxis(viewBox) - point[0], point[1]]
}

/** 화면 좌표를 SVG 로컬 좌표로 변환 */
export function toLocalPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): Pt | null {
  const ctm = svg.getScreenCTM()
  if (!ctm) return null

  const local = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())

  return [local.x, local.y]
}

/** bbox 기준 정규화 좌표 — URL·내보내기에서 쓰는 뷰 독립 표현 */
export function normalizePoint(point: Pt, bbox: BBox): Pt {
  return [(point[0] - bbox.x) / bbox.w, (point[1] - bbox.y) / bbox.h]
}

export function denormalizePoint(point: Pt, bbox: BBox): Pt {
  return [point[0] * bbox.w + bbox.x, point[1] * bbox.h + bbox.y]
}
