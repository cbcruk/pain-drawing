export type Pt = [number, number]

export type Shape =
  | { t: 'ribbon'; p: Pt[]; w: number[] }
  | { t: 'circle'; c: Pt; r: number }

/** 수축하거나 흐르는 조직 — 어디서 나와 어디로 가는지가 있다 */
export type DirectionalTissue = 'muscle' | 'tendon' | 'nerve' | 'vessel' | 'bone'

/**
 * 두 곳에 걸려 있을 뿐인 조직. 당기는 방향이 없으므로 기시/정지가 성립하지
 * 않는다. 연골이 여기 있는 이유는 반월판이다 — 인대와 같은 서술 형태를 쓴다.
 */
export type AnchoredTissue = 'ligament' | 'cartilage'

/**
 * 양쪽 다 되는 유일한 조직. 족저건막은 종골에서 나와 발가락으로 퍼지므로
 * 방향이 있고, 관절낭은 관절을 빙 둘러 걸쳐 있을 뿐이라 방향이 없다.
 * 조직 이름만으로는 갈리지 않는 경우가 실제로 있다는 뜻이다.
 */
export type AmbivalentTissue = 'fascia'

export type Tissue = DirectionalTissue | AnchoredTissue | AmbivalentTissue

export interface StructureName {
  ko: { classic: string; revised?: string }
  en: string
  la: string
}

interface StructureBase {
  id: string
  name: StructureName

  /** 조직 종류와 무관하게 "무엇을 하는가"는 물을 수 있다 */
  action?: string

  notes?: string[]
  commonIssues?: string[]
  fmaId?: string
}

/** 근육·힘줄·신경·혈관 — 기시에서 정지로 간다 */
type DirectionalMeta = {
  origin?: string
  insertion?: string
  nerve?: string
  attachments?: never
}

/**
 * 인대·연골 — 부착부 2개. 순서에 뜻이 없다.
 *
 * "뼈 A와 뼈 B"가 아니다. 반월판은 두 부착부가 모두 경골이고, 슬개하 횡인대는
 * 뼈가 아니라 반월판 둘을 잇는다. 부착 **대상**은 제한하지 않고 개수만 고정한다.
 */
type AnchoredMeta = {
  attachments: [string, string]
  origin?: never
  insertion?: never
  nerve?: never
}

/**
 * 조직 종류가 서술 형태를 정한다. 인대에 기시/정지를 적거나 근육에 부착부를
 * 적으면 컴파일되지 않는다 — SPEC이 말하는 "타입으로 강제한다"가 이것이다.
 */
export type Structure = StructureBase &
  (
    | ({ kind: DirectionalTissue } & DirectionalMeta)
    | ({ kind: AnchoredTissue } & AnchoredMeta)
    | ({ kind: AmbivalentTissue } & (DirectionalMeta | AnchoredMeta))
  )

export interface StructureInViewBase {
  structureId: string
  viewId: string
  depth: number
  reachable: boolean
  shapes: Shape[]
}

/**
 * 도판이 층별로 나뉘어 있어 트레이싱도 층별로 끝난다. provenance가 View에만
 * 있으면 "L0는 traced, L2는 아직"인 중간 상태를 표현할 수 없다. 생략하면
 * 뷰 값을 상속하고, 적으면 그 구조만 따로 주장한다.
 */
export type StructureInView = StructureInViewBase &
  (InheritedProvenance | Provenance)

export interface Layer {
  depth: number
  ko: string
  en: string
  /** 층 이름은 정확하지만 어렵다. 깊이 레일에서만 쓰는 한국어 풀이. */
  hint?: string
}

export interface BBox {
  x: number
  y: number
  w: number
  h: number
}

export interface TraceSource {
  /** 참조 자료 식별 — 판본·도판 번호까지 적는다. "Gray's Anatomy 1918, Fig. 443" */
  ref: string
  license: string
  /** 트레이싱 시점. 참조가 개정되면 재정합 대상인지 판단하는 근거 */
  tracedAt?: string
}

/**
 * traced는 출처 없이 존재할 수 없다. 정밀도를 주장하는 순간 근거를 대야
 * 하므로 타입에서 막는다.
 */
export type Provenance =
  | { fidelity: 'schematic'; source?: never }
  | { fidelity: 'traced'; source: TraceSource }

/** 상속 = 뷰 값을 따른다. 부분 트레이싱 중인 뷰가 정상 상태다. */
export type InheritedProvenance = { fidelity?: never; source?: never }

/**
 * 어느 면에서 본 것인가. 같은 region + 같은 side의 뷰끼리는 "같은 부위의 다른
 * 면"이므로 서로 전환 가능하다. label 자유 텍스트로 두면 이 판정을 못 한다.
 */
export type Aspect =
  | 'plantar'
  | 'dorsal'
  | 'anterior'
  | 'posterior'
  | 'medial'
  | 'lateral'

export interface ViewBase {
  id: string
  region: string
  side: 'right' | 'left'
  aspect: Aspect
  label: { ko: string; en: string }
  viewBox: string
  outline: string
  silhouette?: Shape[]
  boneRef?: Shape[]
  bbox: BBox
  layers: Layer[]

  /**
   * 이 뷰가 어느 뷰를 좌우 반전해 만든 것인지. 좌표는 원본 그대로 쓰고
   * 렌더에서만 뒤집으므로, 반전 뷰가 독립적으로 뜬 좌표로 오해되면 안 된다.
   */
  mirrorOf?: string

  /**
   * 화면 좌우 가장자리가 해부학적으로 어느 쪽인지. 같은 오른발이라도 발바닥과
   * 발등에서 내측이 반대 편에 오므로 규칙으로 유도하지 않고 뷰가 직접 말한다.
   */
  edges?: { left: string; right: string }

  /** 좌우 전환 UI에 쓰는 짧은 이름 — 부위마다 말이 다르다(오른발 / 오른쪽 무릎) */
  sideLabel?: string

  /** 면 전환 UI에 쓰는 짧은 이름 (발바닥 / 발등). aspect 값 그대로는 안 읽힌다 */
  aspectLabel?: string

  /**
   * 해부학적 기준점 — 이 뷰 좌표계에서의 위치. 참조 이미지를 갈아탈 때
   * 좌표를 재정합하는 기준이고, 모식도 → 트레이싱 교체 시 같은 키를 맞춘다.
   * schematic 단계에서도 채워둬야 나중에 정합이 가능하다.
   */
  landmarks?: Record<string, Pt>
}

/** 뷰의 provenance는 뷰 자신의 기하(윤곽·뼈 참조·랜드마크)에 대한 주장이다 */
export type View = ViewBase & Provenance

/**
 * 부위 — 뷰들의 묶음. `View.region`이 문자열인 채로는 UI가 "발"이라고 부를 수
 * 없고, 부위를 바꿀 때 어느 뷰로 들어가야 하는지도 모른다.
 */
export interface Region {
  id: string
  ko: string
  en: string
  /** 이 부위에 처음 들어갈 때 여는 뷰 */
  defaultViewId: string
}

export interface ProbeCandidate {
  structure: Structure
  depth: number
  reachable: boolean
  provenance: Provenance
}

export interface Probe {
  point: Pt
  viewId: string
  candidates: ProbeCandidate[]
}
