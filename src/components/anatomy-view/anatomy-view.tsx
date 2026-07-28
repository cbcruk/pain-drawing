import { useCallback, useMemo, useRef } from 'react'
import {
  mirrorPoint,
  mirrorTransform,
  shapeToPath,
  toLocalPoint,
} from '@/lib/geometry'
import { TISSUE } from '@/data/tissue'
import type { AnatomyViewProps } from './anatomy-view.types'
import { shapeStyle, sortForPainting } from './anatomy-view.utils'

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
      sortForPainting(placements, depth).map((placement) => ({
        placement,
        ds: placement.shapes.map(shapeToPath),
      })),
    [placements, depth],
  )

  const maxDepth = useMemo(
    () => Math.max(...view.layers.map((layer) => layer.depth)),
    [view.layers],
  )

  const silhouettePaths = useMemo(
    () => (view.silhouette ?? []).map(shapeToPath),
    [view.silhouette],
  )

  const bonePaths = useMemo(
    () => (view.boneRef ?? []).map(shapeToPath),
    [view.boneRef],
  )

  const mirror = view.mirrorOf ? mirrorTransform(view.viewBox) : undefined

  const handleClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current
      if (!svg) return

      const point = toLocalPoint(svg, event.clientX, event.clientY)
      if (!point) return

      // 좌표는 원본 뷰 공간에 남는다 — 반전은 그리기에서만 일어난다
      onProbe(view.mirrorOf ? mirrorPoint(point, view.viewBox) : point)
    },
    [onProbe, view.mirrorOf, view.viewBox],
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
      <g transform={mirror}>
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

          const style = shapeStyle({
            tissue: structure.kind,
            depth: placement.depth,
            activeDepth: depth,
            maxDepth,
            selected: isSelected,
            hovered: isHovered,
          })

          return (
            <g
              key={placement.structureId}
              pointerEvents={active ? 'auto' : 'none'}
              aria-hidden={active ? undefined : true}
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
                  role={active && i === 0 ? 'button' : undefined}
                  aria-label={
                    active && i === 0 ? structure.name.ko.classic : undefined
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect(placement.structureId)
                    }
                  }}
                  fill={style.fill}
                  fillOpacity={style.fillOpacity}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeOpacity={style.strokeOpacity}
                  strokeDasharray={style.strokeDasharray}
                  vectorEffect="non-scaling-stroke"
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
      </g>
    </svg>
  )
}
