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

export interface View {
  id: string
  region: string
  label: { ko: string; en: string }
  viewBox: string
  outline: string
  silhouette?: Shape[]
  boneRef?: Shape[]
  bbox: BBox
  layers: Layer[]
}

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
