import { useCallback, useRef, useState } from 'react'
import type { Pt, StructureInView, View } from '@/types/anatomy.types'
import { shapeToPath, toLocalPoint } from '@/lib/geometry'
import { parseViewBox, registrationMatrix } from '@/lib/registration'
import type { Registration } from '@/lib/registration'
import { TISSUE } from '@/data/tissue'
import { draftShapes, type Draft, type SpanResolver } from './draft'

export interface LandmarkTarget {
  key: string
  point: Pt
  done: boolean
  next: boolean
}

interface CanvasProps {
  view: View
  mode: 'calibrate' | 'draw'
  imageUrl: string | null
  imageSize: [number, number] | null
  registration: Registration | null
  imageOpacity: number
  showGuides: boolean
  showExisting: boolean
  existing: StructureInView[]
  drafts: Draft[]
  activeDraft: Draft | null
  activeShapeKey: string | null
  selectedPoint: number | null
  landmarks: LandmarkTarget[]
  /** 걸친 도형을 실제 좌표로 푼다. 그리는 중인 구조는 그대로 두고 나머지에만 쓴다 */
  resolveSpan?: SpanResolver
  onPick: (point: Pt) => void
  onMovePoint: (index: number, point: Pt) => void
  onSelectPoint: (index: number) => void
}

export function Canvas({
  view,
  mode,
  imageUrl,
  imageSize,
  registration,
  imageOpacity,
  showGuides,
  showExisting,
  existing,
  drafts,
  activeDraft,
  activeShapeKey,
  selectedPoint,
  landmarks,
  resolveSpan,
  onPick,
  onMovePoint,
  onSelectPoint,
}: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragged = useRef(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const [, , vw, vh] = parseViewBox(view.viewBox)
  const unit = Math.hypot(vw, vh) / 160

  const localPoint = useCallback((clientX: number, clientY: number): Pt | null => {
    const svg = svgRef.current

    return svg ? toLocalPoint(svg, clientX, clientY) : null
  }, [])

  const handleClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (dragged.current) {
        dragged.current = false

        return
      }

      const point = localPoint(event.clientX, event.clientY)
      if (point) onPick(point)
    },
    [localPoint, onPick],
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (dragIndex === null) return

      const point = localPoint(event.clientX, event.clientY)
      if (!point) return

      dragged.current = true
      onMovePoint(dragIndex, point)
    },
    [dragIndex, localPoint, onMovePoint],
  )

  const activeShape =
    activeDraft?.shapes.find((s) => s.key === activeShapeKey) ?? null

  return (
    <svg
      ref={svgRef}
      viewBox={view.viewBox}
      className="h-full w-full touch-none select-none"
      style={{ background: 'var(--color-well)', cursor: 'crosshair' }}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDragIndex(null)}
      onPointerLeave={() => setDragIndex(null)}
      role="application"
      aria-label={`${view.label.ko} 저작 캔버스`}
    >
      {imageUrl && imageSize && registration && (
        <image
          href={imageUrl}
          width={imageSize[0]}
          height={imageSize[1]}
          transform={registrationMatrix(registration)}
          opacity={imageOpacity}
          pointerEvents="none"
        />
      )}

      {showGuides && (
        <g pointerEvents="none">
          <path
            d={view.outline}
            fill="none"
            stroke="var(--color-edge)"
            strokeWidth={unit * 0.3}
            strokeOpacity="0.55"
          />
          {(view.silhouette ?? []).map((shape, i) => (
            <path
              key={i}
              d={shapeToPath(shape)}
              fill="none"
              stroke="var(--color-edge)"
              strokeWidth={unit * 0.25}
              strokeOpacity="0.4"
            />
          ))}
          {(view.boneRef ?? []).map((shape, i) => (
            <path
              key={i}
              d={shapeToPath(shape)}
              fill={TISSUE.bone.fill}
              opacity="0.18"
            />
          ))}
        </g>
      )}

      {showExisting && (
        <g pointerEvents="none">
          {existing.map((placement) =>
            placement.shapes.map((shape, i) => (
              <path
                key={`${placement.structureId}-${i}`}
                d={shapeToPath(shape)}
                fill="var(--color-edge)"
                fillOpacity="0.14"
                stroke="var(--color-edge)"
                strokeWidth={unit * 0.15}
                strokeOpacity="0.3"
              />
            )),
          )}
        </g>
      )}

      {/* 작업 중인 다른 구조 — 겹침을 눈으로 확인하려고 남겨둔다 */}
      <g pointerEvents="none">
        {drafts
          .filter((d) => d.key !== activeDraft?.key)
          .map((draft) =>
            draftShapes(draft, resolveSpan).map((shape, i) => (
              <path
                key={`${draft.key}-${i}`}
                d={shapeToPath(shape)}
                fill={TISSUE[draft.kind].fill}
                fillOpacity="0.3"
                stroke="var(--color-edge)"
                strokeWidth={unit * 0.15}
              />
            )),
          )}
      </g>

      {activeDraft && (
        <g pointerEvents="none">
          {activeDraft.shapes.map((shape) => {
            const isActive = shape.key === activeShapeKey
            const path =
              shape.t === 'circle'
                ? shape.p[0]
                  ? shapeToPath({
                      t: 'circle',
                      c: shape.p[0],
                      r: shape.w[0] ?? 10,
                    })
                  : ''
                : shape.p.length >= 2
                  ? shapeToPath({ t: 'ribbon', p: shape.p, w: shape.w })
                  : ''

            if (!path) return null

            return (
              <path
                key={shape.key}
                d={path}
                fill={TISSUE[activeDraft.kind].fill}
                fillOpacity={isActive ? 0.72 : 0.4}
                stroke="var(--color-accent)"
                strokeWidth={isActive ? unit * 0.3 : unit * 0.15}
              />
            )
          })}
        </g>
      )}

      {/* 중심선 — 저장되는 건 이 점들이지 리본이 아니다 */}
      {activeShape && activeShape.p.length > 1 && (
        <polyline
          points={activeShape.p.map((p) => `${p[0]},${p[1]}`).join(' ')}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={unit * 0.2}
          strokeDasharray={`${unit} ${unit}`}
          pointerEvents="none"
        />
      )}

      {mode === 'draw' &&
        activeShape?.p.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={unit * (selectedPoint === i ? 1.15 : 0.85)}
            fill={
              selectedPoint === i ? 'var(--color-accent)' : 'var(--color-paper)'
            }
            stroke="var(--color-accent)"
            strokeWidth={unit * 0.22}
            style={{ cursor: 'grab' }}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => {
              event.stopPropagation()
              dragged.current = false
              setDragIndex(i)
              onSelectPoint(i)
              event.currentTarget.setPointerCapture(event.pointerId)
            }}
          />
        ))}

      {mode === 'calibrate' &&
        landmarks.map((landmark) => (
          <g key={landmark.key} pointerEvents="none">
            <circle
              cx={landmark.point[0]}
              cy={landmark.point[1]}
              r={unit * (landmark.next ? 1.8 : 1.2)}
              fill="none"
              stroke={
                landmark.done ? 'var(--color-accent)' : 'var(--color-mark)'
              }
              strokeWidth={unit * (landmark.next ? 0.4 : 0.22)}
            />
            <circle
              cx={landmark.point[0]}
              cy={landmark.point[1]}
              r={unit * 0.3}
              fill={landmark.done ? 'var(--color-accent)' : 'var(--color-mark)'}
            />
            <text
              x={landmark.point[0] + unit * 2.2}
              y={landmark.point[1] + unit * 0.6}
              fontSize={unit * 1.9}
              fill={landmark.done ? 'var(--color-accent)' : 'var(--color-mark)'}
              fontFamily="ui-monospace, monospace"
            >
              {landmark.key}
            </text>
          </g>
        ))}
    </svg>
  )
}
