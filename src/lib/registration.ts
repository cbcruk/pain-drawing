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
  /**
   * flip을 데이터로 정하지 못했다는 표시. 대응점이 2개면 정방향과 거울상이
   * **둘 다 rms 0으로 완전히 맞는다** — 상사변환의 자유도가 4라 점 2개(식 4개)를
   * 어느 방향으로든 정확히 통과시킬 수 있기 때문이다. 이때 자동 선택은
   * 근거가 아니라 동전 던지기이므로, rms만 보고 정합됐다고 믿으면 안 된다.
   */
  reflectionAmbiguous: boolean
}

/** 두 해의 잔차 차이가 이보다 작으면 데이터가 방향을 못 가른 것으로 본다 */
const REFLECTION_EPS = 1e-6

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

  const draft: Registration = {
    a,
    b,
    tx,
    ty,
    flip,
    rms: 0,
    count: pairs.length,
    reflectionAmbiguous: false,
  }

  let sq = 0
  for (const c of pairs) {
    const [mx, my] = applyRegistration(draft, c.from)
    sq += (mx - c.to[0]) ** 2 + (my - c.to[1]) ** 2
  }

  return { ...draft, rms: Math.sqrt(sq / pairs.length) }
}

/**
 * 대응점 2쌍 이상으로 변환을 구한다. 반전 여부는 잔차가 작은 쪽으로 정한다 —
 * 반대쪽 발 사진을 올렸는지는 대개 데이터가 안다.
 *
 * 단, **기준점 3개부터**다. 2개면 두 방향이 똑같이 완벽하게 맞아서 데이터가
 * 방향을 말해주지 않으므로 `reflectionAmbiguous`를 세운다. 자료의 좌우를
 * 이미 아는 호출자는 `reflect`로 직접 지정할 수 있다.
 */
export function fitRegistration(
  pairs: Correspondence[],
  reflect?: boolean,
): Registration | null {
  if (pairs.length < 2) return null

  if (reflect !== undefined) return fitOriented(pairs, reflect)

  const plain = fitOriented(pairs, false)
  const mirrored = fitOriented(pairs, true)

  if (!plain) return mirrored
  if (!mirrored) return plain

  const chosen = mirrored.rms < plain.rms ? mirrored : plain
  const undecided =
    pairs.length < 3 || Math.abs(plain.rms - mirrored.rms) < REFLECTION_EPS

  return { ...chosen, reflectionAmbiguous: undecided }
}

export interface SegmentedRegistration {
  /** 분절 id → 변환 */
  bySegment: Record<string, Registration>
  /** 대응점이 2개 미만이라 아직 못 구한 분절 */
  pending: string[]
  /** 점 개수로 가중한 전체 잔차 */
  rms: number
}

/**
 * 분절마다 따로 정합한다. 자세가 다른 자료를 얹는 유일한 정직한 방법이다 —
 * 하나의 변환으로 억지로 맞추면 랜드마크는 붙고 그 사이 구조가 전부 틀어진다.
 *
 * `reflect`는 전체에 한 번 적용된다. 한 표본을 찍은 한 장이므로 어떤 뼈는
 * 뒤집히고 어떤 뼈는 안 뒤집히는 일은 없다.
 */
export function fitSegmented(
  pairs: Record<string, Correspondence[]>,
  reflect?: boolean,
): SegmentedRegistration {
  const bySegment: Record<string, Registration> = {}
  const pending: string[] = []

  let sq = 0
  let count = 0

  for (const [id, list] of Object.entries(pairs)) {
    const fitted = fitRegistration(list, reflect)

    if (!fitted) {
      pending.push(id)
      continue
    }

    bySegment[id] = fitted
    sq += fitted.rms ** 2 * fitted.count
    count += fitted.count
  }

  return { bySegment, pending, rms: count > 0 ? Math.sqrt(sq / count) : 0 }
}

/** 각 점까지의 누적 길이를 0~1로 — 등간격이 아닌 중심선에서도 비율이 맞는다 */
function arcFractions(points: Pt[]): number[] {
  const cumulative: number[] = [0]

  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1]!
    const current = points[i]!
    cumulative.push(
      cumulative[i - 1]! + Math.hypot(current[0] - previous[0], current[1] - previous[1]),
    )
  }

  const total = cumulative[cumulative.length - 1]!

  // 길이가 0이면(점이 겹쳐 있으면) 순번으로 나눈다
  return total < 1e-9
    ? points.map((_, i) => (points.length > 1 ? i / (points.length - 1) : 0))
    : cumulative.map((c) => c / total)
}

/**
 * 관절을 건너는 중심선. 첫 점은 `from` 분절의 변환으로, 마지막 점은 `to`의
 * 변환으로 얹고 사이는 누적 길이 비율로 섞는다.
 *
 * **이 구간은 트레이싱이 아니라 재구성이다.** 두 상사변환을 선형으로 섞은 것은
 * 상사변환이 아니므로 결과가 원본과 닮지 않는다. 그리고 그게 맞다 — 무릎을 펴면
 * 인대는 실제로 길이와 방향이 달라지므로, 굽힌 자료에서 본 중간부 모양은 편
 * 자세의 모양이 아니다. **부착부 양 끝은 정확하고 그 사이는 추정이다.**
 *
 * 무릎 인대는 거의 전부 여기 해당한다(십자인대·측부인대·슬와근건). 반월판처럼
 * 한 뼈에만 붙은 구조만 강체 변환으로 온전히 옮겨진다.
 */
export function applyAcross(
  from: Registration,
  to: Registration,
  points: Pt[],
): Pt[] {
  if (points.length === 0) return []
  if (points.length === 1) return [applyRegistration(from, points[0]!)]

  const t = arcFractions(points)

  return points.map((point, i) => {
    const [ax, ay] = applyRegistration(from, point)
    const [bx, by] = applyRegistration(to, point)
    const k = t[i]!

    return [ax + (bx - ax) * k, ay + (by - ay) * k]
  })
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
    reflectionAmbiguous: false,
  }
}

/** 정합 품질을 사람 말로 — bbox 대각선 대비 몇 %인가 */
export function rmsVerdict(rms: number, diagonal: number): string {
  const ratio = rms / diagonal

  if (ratio < 0.01) return '양호'
  if (ratio < 0.025) return '보통'

  return '기준점 재확인 필요'
}
