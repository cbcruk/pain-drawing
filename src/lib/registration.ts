import type { Pt } from '@/types/anatomy.types'

export interface Correspondence {
  /** 참조 이미지 픽셀 좌표 */
  from: Pt
  /** 뷰 좌표 */
  to: Pt
}

/**
 * 참조 이미지 픽셀 → 뷰 좌표 변환. 회전 + 등방 스케일 + 평행이동, 그리고
 * 선택적 좌우 반전.
 *
 * 비등방 스케일을 허용하지 않는 건 의도다. 발을 가로로만 늘리면 랜드마크는
 * 맞고 그 사이 구조는 전부 틀어진다. 종횡비가 안 맞으면 rms로 드러나야 한다.
 */
export interface Registration {
  a: number
  b: number
  tx: number
  ty: number
  /** 참조가 반대쪽 발이거나 거울상일 때 */
  flip: boolean
  /** 잔차 RMS (뷰 좌표 단위) — 정합 품질 */
  rms: number
  count: number
}

function centroid(points: Pt[]): Pt {
  let x = 0
  let y = 0

  for (const p of points) {
    x += p[0]
    y += p[1]
  }

  return [x / points.length, y / points.length]
}

function fitOriented(pairs: Correspondence[], flip: boolean): Registration | null {
  const from: Pt[] = pairs.map((c) => (flip ? [-c.from[0], c.from[1]] : c.from))
  const to: Pt[] = pairs.map((c) => c.to)

  const fc = centroid(from)
  const tc = centroid(to)

  let num = 0
  let cross = 0
  let denom = 0

  for (let i = 0; i < pairs.length; i++) {
    const fx = from[i]![0] - fc[0]
    const fy = from[i]![1] - fc[1]
    const tx = to[i]![0] - tc[0]
    const ty = to[i]![1] - tc[1]

    num += fx * tx + fy * ty
    cross += fx * ty - fy * tx
    denom += fx * fx + fy * fy
  }

  // 기준점이 한 자리에 뭉쳐 있으면 방향을 정할 수 없다
  if (denom < 1e-9) return null

  const a = num / denom
  const b = cross / denom
  const tx = tc[0] - (a * fc[0] - b * fc[1])
  const ty = tc[1] - (b * fc[0] + a * fc[1])

  const draft: Registration = { a, b, tx, ty, flip, rms: 0, count: pairs.length }

  let sq = 0
  for (const c of pairs) {
    const [mx, my] = applyRegistration(draft, c.from)
    sq += (mx - c.to[0]) ** 2 + (my - c.to[1]) ** 2
  }

  return { ...draft, rms: Math.sqrt(sq / pairs.length) }
}

/**
 * 대응점 2쌍 이상으로 변환을 구한다. 반전 여부는 사용자가 고르지 않고
 * 잔차가 작은 쪽을 고른다 — 반대쪽 발 사진을 올렸는지는 데이터가 안다.
 */
export function fitRegistration(pairs: Correspondence[]): Registration | null {
  if (pairs.length < 2) return null

  const plain = fitOriented(pairs, false)
  const mirrored = fitOriented(pairs, true)

  if (!plain) return mirrored
  if (!mirrored) return plain

  return mirrored.rms < plain.rms ? mirrored : plain
}

export function applyRegistration(reg: Registration, point: Pt): Pt {
  const x = reg.flip ? -point[0] : point[0]
  const y = point[1]

  return [reg.a * x - reg.b * y + reg.tx, reg.b * x + reg.a * y + reg.ty]
}

/** 뷰 좌표 → 참조 이미지 픽셀 */
export function invertRegistration(reg: Registration, point: Pt): Pt {
  const det = reg.a * reg.a + reg.b * reg.b
  if (det < 1e-12) return point

  const dx = point[0] - reg.tx
  const dy = point[1] - reg.ty
  const x = (reg.a * dx + reg.b * dy) / det
  const y = (-reg.b * dx + reg.a * dy) / det

  return [reg.flip ? -x : x, y]
}

/** SVG transform 속성값 — 이미지를 뷰 좌표계 위에 얹는다 */
export function registrationMatrix(reg: Registration): string {
  const [a, b] = reg.flip ? [-reg.a, -reg.b] : [reg.a, reg.b]

  return `matrix(${a} ${b} ${-reg.b} ${reg.a} ${reg.tx} ${reg.ty})`
}

export function parseViewBox(viewBox: string): [number, number, number, number] {
  const [x, y, w, h] = viewBox.split(/[\s,]+/).map(Number)

  return [x ?? 0, y ?? 0, w ?? 1, h ?? 1]
}

/** 정합 전 임시 배치 — 이미지를 viewBox에 맞춰 넣어두고 여기서 기준점을 찍는다 */
export function fitToViewBox(
  imageWidth: number,
  imageHeight: number,
  viewBox: string,
): Registration {
  const [vx, vy, vw, vh] = parseViewBox(viewBox)
  const scale = Math.min(vw / imageWidth, vh / imageHeight)

  return {
    a: scale,
    b: 0,
    tx: vx + (vw - imageWidth * scale) / 2,
    ty: vy + (vh - imageHeight * scale) / 2,
    flip: false,
    rms: 0,
    count: 0,
  }
}

/** 정합 품질을 사람 말로 — bbox 대각선 대비 몇 %인가 */
export function rmsVerdict(rms: number, diagonal: number): string {
  const ratio = rms / diagonal

  if (ratio < 0.01) return '양호'
  if (ratio < 0.025) return '보통'

  return '기준점 재확인 필요'
}
