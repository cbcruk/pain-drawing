import { useCallback, useMemo, useRef } from 'react'
import {
  mirrorPoint,
  mirrorTransform,
  shapeToPath,
  toLocalPoint,
} from '@/lib/geometry'
import { TISSUE } from '@/data/tissue'
import { shapeKey } from '@/lib/probe'
import type { AnatomyViewProps } from './anatomy-view.types'
import { plateMatrix, shapeStyle, sortForPainting } from './anatomy-view.utils'

/*
  같은 오른발이라도 발바닥이냐 발등이냐에 따라 내측이 반대 편에 온다. 도해가
  스스로 방향을 밝히지 않으면 좌우를 뒤집어 읽게 되고, 그게 이 도구가 막으려는
  오류다. SVG 밖에 두어야 반전 transform에 글자가 딸려 뒤집히지 않는다.
*/
function EdgeLabel({ text }: { text: string }) {
  return (
    <span
      className="text-[10px] tracking-[0.16em] whitespace-nowrap"
      style={{ color: 'var(--color-muted)', writingMode: 'vertical-rl' }}
    >
      {text}
    </span>
  )
}

export function AnatomyView({
  view,
  placements,
  structures,
  depth,
  selectedId,
  hoveredId,
  pinPoint,
  showBones,
  showPlates,
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

  /*
    지금 층을 그린 도판만 보여준다. Gray430은 피부와 근막을 벗긴 그림이라
    L0·L3에서 켜면 그 층까지 도판이 보증하는 것처럼 읽힌다 — ADR 0001.
  */
  const plates = useMemo(
    () => (showPlates ? (view.plates ?? []).filter((p) => p.depths.includes(depth)) : []),
    [showPlates, view.plates, depth],
  )
  const clipId = `outline-${view.id}`

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
    <div className="flex shrink-0 items-center gap-1.5">
      {view.edges && <EdgeLabel text={view.edges.left} />}

      <svg
        ref={svgRef}
        viewBox={view.viewBox}
        className="h-auto w-[300px] md:w-[340px]"
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

          {/*
            도판은 **클릭 대상이 아니다.** 히트테스트는 SVG 도형의
            `isPointInFill`로 남고 이 이미지는 근거를 눈으로 보여줄 뿐이라
            `pointer-events: none`을 건다. 윤곽으로 자르는 이유는 도판이 우리
            프레임보다 크기 때문이다 — 골반이나 볼기가 딸려 들어온다.
          */}
          {plates.length > 0 && (
            <>
              <clipPath id={clipId}>
                <path d={view.outline} />
              </clipPath>
              <g clipPath={`url(#${clipId})`} pointerEvents="none">
                {plates.map((plate) => (
                  <image
                    key={plate.src}
                    href={plate.src}
                    width={plate.size.w}
                    height={plate.size.h}
                    transform={plateMatrix(plate.place)}
                    /*
                      근거로 깔리는 그림이지 주인공이 아니다. 층 색과 도판의
                      분홍이 경쟁하지 않도록 채도를 반쯤 빼고 옅게 깐다.
                    */
                    opacity="0.42"
                    style={{ filter: 'grayscale(0.55)' }}
                  />
                ))}
              </g>
            </>
          )}
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
                key={shapeKey(placement.structureId, placement.depth)}
                pointerEvents={active ? 'auto' : 'none'}
                aria-hidden={active ? undefined : true}
                onMouseEnter={() => onHover(placement.structureId)}
                onMouseLeave={() => onHover(null)}
              >
                {/*
                  한 층에 열 개가 놓이는 자리가 생겼다(허벅지 앞 L1). 도형을
                  눌러 상세를 열기 전에는 무엇인지 알 방법이 없었으므로 이름을
                  붙인다. 활성 층만 `pointer-events`가 살아 있어 지금 층에서만
                  뜬다.
                */}
                {active && <title>{structure.name.ko.classic}</title>}
                {ds.map((d, i) => (
                  <path
                    key={i}
                    ref={(el) => {
                      const key = shapeKey(placement.structureId, placement.depth)
                      const list = registry.get(key) ?? []
                      list[i] = el
                      registry.set(key, list)
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

      {view.edges && <EdgeLabel text={view.edges.right} />}
    </div>
  )
}
