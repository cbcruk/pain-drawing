import type {
  Pt,
  Structure,
  StructureInView,
  Tissue,
  View,
} from '@/types/anatomy.types'
import type { ShapeRegistry } from '@/lib/probe'

export interface ShapeStyleInput {
  tissue: Tissue
  depth: number
  activeDepth: number
  maxDepth: number
  selected: boolean
  hovered: boolean
}

export interface ShapeStyle {
  fill: string
  fillOpacity: number
  stroke: string
  strokeOpacity: number
  strokeWidth: number
  strokeDasharray?: string
}

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
