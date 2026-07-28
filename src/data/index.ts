import type { Structure, StructureInView, View } from '@/types/anatomy.types'
import { footStructures } from './foot/structures'
import { footPlantarView } from './foot/plantar/view'
import { footPlantarPlacements } from './foot/plantar/placements'

export const VIEWS: View[] = [footPlantarView]

/** 구조는 부위 단위로 모은다. 같은 구조가 여러 뷰에 나타나므로 뷰별로 쪼개지 않는다 */
export const STRUCTURES: Structure[] = [...footStructures]

export const PLACEMENTS: StructureInView[] = [...footPlantarPlacements]

export const STRUCTURE_BY_ID: Map<string, Structure> = new Map(
  STRUCTURES.map((s) => [s.id, s]),
)

export function getView(viewId: string): View | undefined {
  return VIEWS.find((v) => v.id === viewId)
}

export function getPlacements(viewId: string): StructureInView[] {
  return PLACEMENTS.filter((p) => p.viewId === viewId)
}

/** 같은 부위·같은 쪽을 다른 면에서 본 뷰 — 발바닥 ↔ 발등 전환의 대상 */
export function getSiblingViews(view: View): View[] {
  return VIEWS.filter(
    (v) => v.id !== view.id && v.region === view.region && v.side === view.side,
  )
}

export const DEFAULT_VIEW_ID = footPlantarView.id

/*
  뷰가 둘 이상이 되면 structureId 오타는 예외가 아니라 "조용히 안 그려지는"
  형태로 나타난다. 개발 중에만 확인하고 번들에는 남기지 않는다.
*/
if (import.meta.env.DEV) {
  const problems: string[] = []

  const seenStructure = new Set<string>()
  for (const s of STRUCTURES) {
    if (seenStructure.has(s.id)) problems.push(`중복 structure id: ${s.id}`)
    seenStructure.add(s.id)
  }

  const seenView = new Set<string>()
  for (const v of VIEWS) {
    if (seenView.has(v.id)) problems.push(`중복 view id: ${v.id}`)
    seenView.add(v.id)
  }

  const seenPlacement = new Set<string>()
  for (const p of PLACEMENTS) {
    const key = `${p.viewId}/${p.structureId}`

    if (!seenView.has(p.viewId)) problems.push(`없는 viewId 참조: ${key}`)
    if (!STRUCTURE_BY_ID.has(p.structureId)) {
      problems.push(`없는 structureId 참조: ${key}`)
    }
    if (seenPlacement.has(key)) problems.push(`중복 placement: ${key}`)
    seenPlacement.add(key)

    const view = getView(p.viewId)
    if (view && !view.layers.some((l) => l.depth === p.depth)) {
      problems.push(`뷰에 없는 depth: ${key} → L${p.depth}`)
    }
  }

  if (problems.length > 0) {
    console.error(`[data] 무결성 문제 ${problems.length}건\n` + problems.join('\n'))
  }
}
