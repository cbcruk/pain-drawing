import { useCallback, useMemo, useRef } from 'react'
import { shapeToPath, toLocalPoint } from '@/lib/geometry'
import { TISSUE } from '@/data/tissue'
import type { AnatomyViewProps } from './anatomy-view.types'

export function AnatomyView({
  view,
  placements,
  structures,
  depth,
  selectedId,
  hoveredId,
  pinPoint,
  showBones,
  registry,
  onProbe,
  onHover,
  onSelect,
}: AnatomyViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const paths = useMemo(
    () =>
      placements.map((placement) => ({
        placement,
        ds: placement.shapes.map(shapeToPath),
      })),
    [placements],
  )

  const silhouettePaths = useMemo(
    () => (view.silhouette ?? []).map(shapeToPath),
    [view.silhouette],
  )

  const bonePaths = useMemo(
    () => (view.boneRef ?? []).map(shapeToPath),
    [view.boneRef],
  )

  const handleClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current
      if (!svg) return

      const point = toLocalPoint(svg, event.clientX, event.clientY)
      if (point) onProbe(point)
    },
    [onProbe],
  )

  return (
    <svg
      ref={svgRef}
      viewBox={view.viewBox}
      className="h-auto w-[300px] shrink-0 md:w-[340px]"
      onClick={handleClick}
      role="img"
      aria-label={`${view.label.ko} 도해`}
    >
      <path
        d={view.outline}
        fill="var(--color-silhouette)"
        stroke="var(--color-rule)"
        strokeWidth="1"
      />
      {silhouettePaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="var(--color-silhouette)"
          stroke="var(--color-rule)"
          strokeWidth="1"
        />
      ))}

      {showBones &&
        bonePaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={TISSUE.bone.fill}
            opacity="0.28"
            pointerEvents="none"
          />
        ))}

      {paths.map(({ placement, ds }) => {
        const structure = structures.get(placement.structureId)
        if (!structure) return null

        const active = placement.depth === depth
        const isSelected = placement.structureId === selectedId
        const isHovered = placement.structureId === hoveredId

        return (
          <g
            key={placement.structureId}
            opacity={active ? 1 : 0}
            pointerEvents={active ? 'auto' : 'none'}
            onMouseEnter={() => onHover(placement.structureId)}
            onMouseLeave={() => onHover(null)}
          >
            {ds.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  const list = registry.get(placement.structureId) ?? []
                  list[i] = el
                  registry.set(placement.structureId, list)
                }}
                d={d}
                className="shape"
                tabIndex={active && i === 0 ? 0 : -1}
                role={i === 0 ? 'button' : undefined}
                aria-label={i === 0 ? structure.name.ko.classic : undefined}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelect(placement.structureId)
                  }
                }}
                fill={TISSUE[structure.kind].fill}
                fillOpacity={isSelected ? 0.95 : isHovered ? 0.8 : 0.62}
                stroke={isSelected ? 'var(--color-accent)' : 'var(--color-edge)'}
                strokeWidth={isSelected ? 2 : 0.7}
                strokeOpacity={isSelected ? 1 : 0.5}
              />
            ))}
          </g>
        )
      })}

      {pinPoint && (
        <g pointerEvents="none">
          <circle
            cx={pinPoint[0]}
            cy={pinPoint[1]}
            r="14"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeOpacity="0.45"
          />
          <circle
            cx={pinPoint[0]}
            cy={pinPoint[1]}
            r="3"
            fill="var(--color-accent)"
          />
        </g>
      )}
    </svg>
  )
}
