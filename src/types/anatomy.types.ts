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

export interface StructureInView {
  structureId: string
  viewId: string
  depth: number
  reachable: boolean
  shapes: Shape[]
}

export interface Layer {
  depth: number
  ko: string
  en: string
}

export interface BBox {
  x: number
  y: number
  w: number
  h: number
}

export interface ViewSource {
  /** 참조 자료 식별 — 판본까지 적는다. "Gray's Anatomy 1918, plate 442" */
  ref: string
  license: string
  /** 트레이싱 시점. 참조가 개정되면 재정합 대상인지 판단하는 근거 */
  tracedAt?: string
}

/**
 * traced 뷰는 출처 없이 존재할 수 없다. 정밀도를 주장하는 순간 근거를 대야
 * 하므로 타입에서 막는다.
 */
export type ViewProvenance =
  | { fidelity: 'schematic'; source?: never }
  | { fidelity: 'traced'; source: ViewSource }

export interface ViewBase {
  id: string
  region: string
  label: { ko: string; en: string }
  viewBox: string
  outline: string
  silhouette?: Shape[]
  boneRef?: Shape[]
  bbox: BBox
  layers: Layer[]

  /**
   * 해부학적 기준점 — 이 뷰 좌표계에서의 위치. 참조 이미지를 갈아탈 때
   * 좌표를 재정합하는 기준이고, 모식도 → 트레이싱 교체 시 같은 키를 맞춘다.
   * schematic 단계에서도 채워둬야 나중에 정합이 가능하다.
   */
  landmarks?: Record<string, Pt>
}

export type View = ViewBase & ViewProvenance

export interface ProbeCandidate {
  structure: Structure
  depth: number
  reachable: boolean
}

export interface Probe {
  point: Pt
  viewId: string
  candidates: ProbeCandidate[]
}
