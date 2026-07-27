import type { Probe, Pt, Structure, View } from '@/types/anatomy.types'
import { normalizePoint } from './geometry'

const fixed2 = (n: number): string => n.toFixed(2)

export function koName(structure: Structure): string {
  const { classic, revised } = structure.name.ko

  return revised ? `${classic} · ${revised}` : classic
}

/** 정밀도 고지 — 하드코딩하지 않고 뷰의 fidelity가 문구를 정한다 */
export function fidelityNote(view: View): string {
  return view.fidelity === 'traced'
    ? `${view.source.ref} 트레이싱 기반 위치`
    : '모식도 기반 위치'
}

function layerLabel(view: View, depth: number): string {
  const layer = view.layers.find((l) => l.depth === depth)

  return layer ? `${depth} (${layer.en})` : String(depth)
}

/** 붙여넣기용 참조 블록 — 사람에게든 LLM에게든 이게 산출물이다 */
export function buildReferenceBlock(
  probe: Probe,
  view: View,
  selectedId: string | null,
): string {
  const [nx, ny] = normalizePoint(probe.point, view.bbox)
  const lines = [
    `Region: ${view.label.en}`,
    `Point: (${fixed2(nx)}, ${fixed2(ny)}) normalized`,
  ]

  if (probe.candidates.length === 0) {
    lines.push('Structures: none — 윤곽 밖이거나 매핑되지 않은 지점')

    return lines.join('\n')
  }

  const selected =
    probe.candidates.find((c) => c.structure.id === selectedId) ??
    probe.candidates[0]!

  lines.push(
    `Structure: ${selected.structure.name.en} (${koName(selected.structure)})`,
    `Layer: ${layerLabel(view, selected.depth)}`,
  )

  const adjacent = probe.candidates.filter((c) => c !== selected)

  if (adjacent.length > 0) {
    const parts = adjacent.map(
      (c) =>
        `${c.structure.name.en} (L${c.depth}${c.reachable ? '' : ', not reachable'})`,
    )
    lines.push(`Adjacent: ${parts.join(', ')}`)
  }

  lines.push(`Note: ${fidelityNote(view)}이며 증상의 원인 판단은 포함하지 않음`)

  return lines.join('\n')
}

export interface LocatorState {
  viewId: string
  depth: number
  point: Pt | null
  structureId: string | null
}

/** 뷰가 아직 해석되지 않은 단계의 URL 값 — point는 정규화 좌표 */
export interface ParsedSearch {
  viewId?: string
  depth?: number
  normalizedPoint?: Pt
  structureId?: string
}

export function stateToSearch(state: LocatorState, view: View): string {
  const params = new URLSearchParams()
  params.set('view', state.viewId)
  params.set('layer', String(state.depth))

  if (state.point) {
    const [nx, ny] = normalizePoint(state.point, view.bbox)
    params.set('at', `${fixed2(nx)},${fixed2(ny)}`)
  }

  if (state.structureId) params.set('s', state.structureId)

  return `?${params.toString()}`
}

export function parseSearch(search: string): ParsedSearch {
  const params = new URLSearchParams(search)
  const parsed: ParsedSearch = {}

  const viewId = params.get('view')
  if (viewId) parsed.viewId = viewId

  const layer = params.get('layer')
  if (layer !== null && layer !== '' && Number.isFinite(Number(layer))) {
    parsed.depth = Number(layer)
  }

  const at = params.get('at')
  if (at) {
    const [x, y] = at.split(',').map(Number)
    if (Number.isFinite(x) && Number.isFinite(y)) {
      parsed.normalizedPoint = [x!, y!]
    }
  }

  const structureId = params.get('s')
  if (structureId) parsed.structureId = structureId

  return parsed
}
