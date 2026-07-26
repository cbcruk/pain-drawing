import type { Structure, StructureInView, View } from '@/types/anatomy.types'
import { footPlantarView } from './foot-plantar/view'
import { footStructures } from './foot-plantar/structures'
import { footPlantarPlacements } from './foot-plantar/placements'

export const VIEWS: View[] = [footPlantarView]

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

export const DEFAULT_VIEW_ID = footPlantarView.id
