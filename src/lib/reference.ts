import type {
  Probe,
  Provenance,
  Pt,
  Structure,
  StructureInView,
  View,
} from '@/types/anatomy.types'
import { normalizePoint } from './geometry'

const fixed2 = (n: number): string => n.toFixed(2)

export function koName(structure: Structure): string {
  const { classic, revised } = structure.name.ko

  return revised ? `${classic} · ${revised}` : classic
}

/** placement가 스스로 주장하지 않으면 뷰 값을 따른다 */
export function effectiveProvenance(
  placement: StructureInView | undefined,
  view: View,
): Provenance {
  if (placement?.fidelity === 'traced') {
    return { fidelity: 'traced', source: placement.source }
  }
  if (placement?.fidelity === 'schematic') return { fidelity: 'schematic' }

  return view.fidelity === 'traced'
    ? { fidelity: 'traced', source: view.source }
    : { fidelity: 'schematic' }
}

/** 정밀도 고지 — 하드코딩하지 않고 데이터가 문구를 정한다 */
export function fidelityNote(provenance: Provenance): string {
  return provenance.fidelity === 'traced'
    ? `${provenance.source.ref} 트레이싱 기반 위치`
    : '모식도 기반 위치'
}

/** 뷰 전체를 한 문장으로 — 부분 트레이싱이면 그렇다고 말해야 한다 */
export function fidelitySummary(
  view: View,
  placements: StructureInView[],
): 'schematic' | 'traced' | 'mixed' {
  if (placements.length === 0) return view.fidelity

  let traced = 0
  for (const placement of placements) {
    if (effectiveProvenance(placement, view).fidelity === 'traced') traced++
  }

  if (traced === 0) return 'schematic'

  return traced === placements.length && view.fidelity === 'traced'
    ? 'traced'
    : 'mixed'
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

  // 고지는 뷰가 아니라 지목된 그 구조의 근거를 말해야 한다
  lines.push(
    `Note: ${fidelityNote(selected.provenance)}이며 증상의 원인 판단은 포함하지 않음`,
  )

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
