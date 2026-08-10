import type { Pt } from '@/types/anatomy.types'

/**
 * # 정규화 대응 — 상사변환이 존재하지 않을 때
 *
 * `registration.ts`는 자료를 뷰에 **상사변환**(회전·등방 배율·평행이동)으로
 * 얹는다. 자료와 뷰가 닮은 도형일 때만 성립하는 방법이다.
 *
 * Gray437과 종아리 앞 뷰는 닮지 않았다. 발목으로 좁아지는 비율은 2.01 대
 * 1.96으로 거의 같은데, 길이/폭이 2.27 대 3.75다 — 도판 쪽 다리가 훨씬
 * 뭉툭하다. 등방 배율은 축 하나로 두 축을 함께 늘이므로 **폭을 맞추면 길이가,
 * 길이를 맞추면 폭이 그만큼 틀어진다.** 비등방 배율은 각도를 바꾸므로 금지다.
 *
 * 어느 쪽이 옳은지도 정해지지 않는다. 실제 다리의 길이/폭이 3.5쯤이므로
 * 뷰(3.75)가 도판(2.27)보다 낫다. 즉 도판의 **비율**은 믿을 수 없다.
 *
 * 믿을 수 있는 것은 도판의 **내부 상대 관계**다: 다리 길이의 몇 %인 높이에서,
 * 그 높이 폭의 몇 지점에 경계가 있는가. 이 방법은 그것만 옮긴다.
 *
 * ## 옮겨지는 것과 안 옮겨지는 것
 *
 * - **옮겨진다** — 순서(무엇이 무엇의 안쪽인가), 상대 위치, 구조가 시작하고
 *   끝나는 높이, 그 높이 폭에 대한 굵기 비율.
 * - **안 옮겨진다** — 모양과 각도. 등각사상이 아니므로 자료의 원은 뷰에서
 *   원이 아니다.
 *
 * 우리가 도형을 중심선 `p` + 폭 `w`로 저장하는 것이 여기서 값을 한다. 옮기는
 * 양이 정확히 **상대 위치와 폭 비율**이라, 살아남는 것만 저장하고 있다.
 * path 문자열이었다면 살아남지 않을 것을 옮기는 셈이 됐다.
 *
 * 결과는 `fidelity: 'traced'`가 아니다. 좌표를 옮긴 게 아니기 때문이고,
 * 그래서 `'normalized'`가 따로 있다.
 */

/** 높이마다 잰 좌우 가장자리. 자료와 뷰 양쪽을 같은 형태로 만든다. */
export interface Profile {
  /** y 오름차순 · [y, 왼쪽 x, 오른쪽 x] */
  rows: [number, number, number][]
}

/**
 * 길이 방향을 [0,1]로 만드는 두 높이. 자료와 뷰에서 **같은 해부학적 자리**를
 * 가리켜야 한다 — 이 방법의 유일한 판단 지점이고, 여기가 틀리면 나머지가 전부
 * 조용히 틀어진다. 그래서 두 개만 받는다. 늘릴수록 근거가 아니라 손이 는다.
 */
export interface Anchors {
  /** s = 0 이 되는 높이 (위쪽) */
  top: number
  /** s = 1 이 되는 높이 (아래쪽) */
  bottom: number
}

function edgesAt(profile: Profile, y: number): [number, number] | null {
  const { rows } = profile
  if (rows.length === 0) return null

  const first = rows[0]
  const last = rows[rows.length - 1]
  if (!first || !last) return null
  if (y <= first[0]) return [first[1], first[2]]
  if (y >= last[0]) return [last[1], last[2]]

  for (let i = 1; i < rows.length; i += 1) {
    const a = rows[i - 1]
    const b = rows[i]
    if (!a || !b || b[0] < y) continue

    const span = b[0] - a[0]
    const t = span === 0 ? 0 : (y - a[0]) / span
    return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
  }

  return [last[1], last[2]]
}

/**
 * 한 점을 (s, u)로 읽는다.
 *
 * - `s` — 두 기준 높이 사이에서의 위치. 0이 위, 1이 아래. 밖으로 나가면 1을
 *   넘거나 음수가 된다(자르지 않는다 — 자료가 뷰보다 길 수 있다).
 * - `u` — 그 높이에서 폭의 어디인가. 0이 왼쪽 가장자리, 1이 오른쪽.
 *   가장자리 밖이면 범위를 벗어난다.
 */
export function toNormalized(
  profile: Profile,
  anchors: Anchors,
  point: Pt,
): { s: number; u: number } | null {
  const [x, y] = point
  const span = anchors.bottom - anchors.top
  if (span === 0) return null

  const edges = edgesAt(profile, y)
  if (!edges) return null

  const [left, right] = edges
  const width = right - left

  return {
    s: (y - anchors.top) / span,
    u: width === 0 ? 0.5 : (x - left) / width,
  }
}

/** (s, u)를 반대편 좌표계의 점으로 되돌린다 */
export function fromNormalized(
  profile: Profile,
  anchors: Anchors,
  n: { s: number; u: number },
): Pt | null {
  const y = anchors.top + n.s * (anchors.bottom - anchors.top)
  const edges = edgesAt(profile, y)
  if (!edges) return null

  const [left, right] = edges

  return [left + n.u * (right - left), y]
}

export interface Correspondence {
  from: { profile: Profile; anchors: Anchors }
  to: { profile: Profile; anchors: Anchors }
}

/** 자료 좌표 → 뷰 좌표 */
export function mapPoint(c: Correspondence, point: Pt): Pt | null {
  const n = toNormalized(c.from.profile, c.from.anchors, point)
  if (!n) return null

  return fromNormalized(c.to.profile, c.to.anchors, n)
}

export function mapPoints(c: Correspondence, points: Pt[]): Pt[] {
  const out: Pt[] = []
  for (const p of points) {
    const mapped = mapPoint(c, p)
    if (mapped) out.push(mapped)
  }

  return out
}

/**
 * 굵기는 점이 아니라 길이라 따로 옮긴다. 그 높이 폭에 대한 비율을 유지한다 —
 * "종아리 폭의 1/3을 차지하는 근육"은 어느 그림에서도 1/3이다.
 *
 * 굵기가 폭 비율을 따라간다는 것이 이 방법의 주장이고, 절대 굵기를 옮기지
 * 않는 이유다. 자료가 뭉툭하면 절대 굵기도 뭉툭하게 따라온다.
 */
export function mapWidth(c: Correspondence, atY: number, width: number): number {
  const fromEdges = edgesAt(c.from.profile, atY)
  const n = toNormalized(c.from.profile, c.from.anchors, [0, atY])
  if (!fromEdges || !n) return width

  const y = c.to.anchors.top + n.s * (c.to.anchors.bottom - c.to.anchors.top)
  const toEdges = edgesAt(c.to.profile, y)
  if (!toEdges) return width

  const fromWidth = fromEdges[1] - fromEdges[0]
  const toWidth = toEdges[1] - toEdges[0]
  if (fromWidth === 0) return width

  return (width / fromWidth) * toWidth
}

/**
 * 이 대응이 자료의 어느 성질을 버렸는지 숫자로 남긴다. 정합의 rms에 해당하는
 * 자리인데, 여기서는 오차가 아니라 **왜곡**을 보고한다 — 맞추는 게 아니라
 * 일부러 늘이는 방법이라 "얼마나 잘 맞았나"가 성립하지 않는다.
 */
export function distortion(c: Correspondence): {
  lengthRatio: number
  widthRatio: number
  /** 1이면 상사변환과 같다. 1에서 멀수록 모양이 더 바뀐다. */
  anisotropy: number
} {
  const fromLen = Math.abs(c.from.anchors.bottom - c.from.anchors.top)
  const toLen = Math.abs(c.to.anchors.bottom - c.to.anchors.top)

  const mid = (a: Anchors): number => (a.top + a.bottom) / 2
  const fromEdges = edgesAt(c.from.profile, mid(c.from.anchors))
  const toEdges = edgesAt(c.to.profile, mid(c.to.anchors))
  const fromWidth = fromEdges ? fromEdges[1] - fromEdges[0] : 0
  const toWidth = toEdges ? toEdges[1] - toEdges[0] : 0

  const lengthRatio = fromLen === 0 ? 1 : toLen / fromLen
  const widthRatio = fromWidth === 0 ? 1 : toWidth / fromWidth

  return {
    lengthRatio,
    widthRatio,
    anisotropy: widthRatio === 0 ? 1 : lengthRatio / widthRatio,
  }
}
