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

/**
 * 국제 해부학 용어 표준(Terminologia Anatomica)의 항목 식별자.
 *
 * `name.la`는 **우리가 적은 이름**이고 이것은 **대조한 결과**다 — 표준에 이
 * 코드로 실린 항목이 있고 그 라틴어 이름이 우리 `la`와 같다는 뜻이다. 이름을
 * 스스로 검증할 수는 없으므로 밖에 기준을 두는 것이고, 도판 번호를 캡션으로
 * 확정하는 것과 같은 규율이다.
 *
 * 판을 함께 적는 이유: TA98과 TA2는 코드 체계가 아예 다르다. TA98은
 * `A04.7.02.047` 형태이고 TA2는 일련번호라, 문자열 하나로 두면 나중에 어느
 * 판의 코드인지 알 수 없게 된다.
 */
export interface TaReference {
  edition: 'TA98'
  code: string
}

interface StructureBase {
  id: string
  name: StructureName

  /**
   * 표준 용어 대조 결과. **대응 항목이 없으면 비운다** — 없다는 것도 사실이고,
   * 근처 코드를 끌어다 적으면 그게 나중에 근거로 둔갑한다.
   *
   * 비게 되는 경우가 실제로 있다. 표준이 우리보다 잘게 나눈 자리(비골근지대는
   * TA98에서 상·하 둘로 나뉜다), 반대로 우리가 더 잘게 나눈 자리(비복근 두
   * 갈래는 TA98에 근육 하나로만 있다), 그리고 근육 배와 힘줄을 따로 두는
   * 우리 규칙(만져지는 자리가 다르므로)에 표준이 대응하지 않는 경우다.
   */
  ta?: TaReference

  /** 표준 대조에서 함께 나오는 FMA id. TA98 항목 전부에 있지는 않다 */
  fmaId?: string

  /** 조직 종류와 무관하게 "무엇을 하는가"는 물을 수 있다 */
  action?: string

  notes?: string[]
  commonIssues?: string[]
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
 * 좌표가 무엇을 주장하는가. 셋 다 출처 유무가 다르고, 모식도만 출처가 없다.
 *
 * - `schematic` — 손으로 찍었다. 아무것도 주장하지 않는다.
 * - `normalized` — **상대 위치는 자료에서, 비율은 뷰에서.** 자료를 상사변환으로
 *   얹을 수 없을 때 쓴다. 자료의 다리가 뷰보다 뭉툭하면 폭과 길이를 동시에
 *   맞추는 등방 배율이 존재하지 않으므로, 좌표 대신 **어느 높이에서 폭의 몇
 *   지점인가**를 옮긴다. 살아남는 것은 순서와 상대 위치이고, 잃는 것은 모양과
 *   각도다.
 * - `traced` — 자료의 좌표를 상사변환으로 그대로 옮겼다.
 *
 * 뒤 둘은 출처 없이 존재할 수 없다. 정밀도를 주장하는 순간 근거를 대야 하므로
 * 타입에서 막는다.
 */
export type Provenance =
  | { fidelity: 'schematic'; source?: never }
  | { fidelity: 'normalized'; source: TraceSource }
  | { fidelity: 'traced'; source: TraceSource }

/** 약한 순서 — 고지 문구가 절대 과장되지 않게 하는 기준 */
export const FIDELITY_ORDER = ['schematic', 'normalized', 'traced'] as const

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

/**
 * 강체 분절 — 이 안에서는 참조 자료와 뷰가 **같은 모양**이다.
 *
 * 발은 도판 다섯 장이 모두 같은 자세라 자료 한 장을 뷰에 얹는 상사변환이 하나
 * 존재했다. 무릎은 아니다. 관절 내부가 보이는 도판은 무릎을 굽힌 자세인데 뷰는
 * 편 무릎이라, 전체를 한 변환으로 맞출 방법이 없다 — 자세가 다르면 그건 닮은
 * 도형이 아니다.
 *
 * 그러나 **뼈 하나 안에서는** 여전히 닮은 도형이다. 뼈는 굽지 않는다. 그래서
 * 분절마다 따로 정합하고, 관절을 건너는 구조만 두 변환 사이를 보간한다.
 */
export interface Segment {
  id: string
  ko: string
  /**
   * 이 분절의 정합에 쓸 수 있는 `landmarks` 키. 상사변환이라 2개부터 풀리고
   * 3개부터 좌우 반전이 데이터로 갈린다. 자료에서 보이는 것만 골라 쓰면 된다.
   */
  landmarks: string[]
}

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

  /**
   * 이 뷰가 강체 분절로 나뉘는가. 없으면 뷰 전체가 하나의 강체다(발이 그렇다).
   *
   * 모든 랜드마크가 어느 분절에 속할 필요는 없다. 슬개골은 굽힘에 따라 대퇴골
   * 위를 미끄러지므로 어느 뼈와도 함께 움직이지 않아 빠져 있다.
   */
  segments?: Segment[]
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

  /**
   * 제품 화면에서 감춘다. 데이터는 그대로 조립되고 URL로는 열리지만 부위
   * 전환에 나오지 않는다.
   *
   * 지우지 않고 감추는 이유: 이 도구는 **눌러서 만질 수 있는 것**을 가리킨다.
   * 관절 속 구조는 지목한 점 아래에 있는 게 맞지만 눌러도 닿지 않아서, 깊이
   * 레일이 "더 파고들면 그것도 네가 만지는 것"이라고 잘못 말하게 된다.
   * 스키마 검증용으로는 여전히 쓸모가 있으므로 데이터는 남긴다.
   */
  hidden?: boolean
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
