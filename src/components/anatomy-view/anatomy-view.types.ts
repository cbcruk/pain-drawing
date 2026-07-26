import type { Pt, Structure, StructureInView, View } from '@/types/anatomy.types'
import type { ShapeRegistry } from '@/lib/probe'

export interface AnatomyViewProps {
  view: View
  placements: StructureInView[]
  structures: Map<string, Structure>
  depth: number
  selectedId: string | null
  hoveredId: string | null
  pinPoint: Pt | null
  showBones: boolean
  registry: ShapeRegistry
  onProbe: (point: Pt) => void
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}
