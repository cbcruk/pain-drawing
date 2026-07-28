export type Pt = [number, number]

export type Shape =
  | { t: 'ribbon'; p: Pt[]; w: number[] }
  | { t: 'circle'; c: Pt; r: number }

export type Tissue =
  | 'muscle'
  | 'tendon'
  | 'ligament'
  | 'fascia'
  | 'nerve'
  | 'vessel'
  | 'bone'

export interface StructureName {
  ko: { classic: string; revised?: string }
  en: string
  la: string
}

export interface Structure {
  id: string
  name: StructureName
  kind: Tissue

  origin?: string
  insertion?: string
  action?: string
  nerve?: string

  attachments?: [string, string]

  notes?: string[]
  commonIssues?: string[]
  fmaId?: string
}

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
   * 해부학적 기준점 — 이 뷰 좌표계에서의 위치. 참조 이미지를 갈아탈 때
   * 좌표를 재정합하는 기준이고, 모식도 → 트레이싱 교체 시 같은 키를 맞춘다.
   * schematic 단계에서도 채워둬야 나중에 정합이 가능하다.
   */
  landmarks?: Record<string, Pt>
}

/** 뷰의 provenance는 뷰 자신의 기하(윤곽·뼈 참조·랜드마크)에 대한 주장이다 */
export type View = ViewBase & Provenance

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
