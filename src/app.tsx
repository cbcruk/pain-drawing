import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Probe, Pt } from '@/types/anatomy.types'
import {
  DEFAULT_VIEW_ID,
  VISIBLE_REGIONS,
  STRUCTURE_BY_ID,
  getPlacements,
  getAspectVariants,
  getRegionEntry,
  getSideVariants,
  getView,
  type StructureLocation,
} from '@/data'
import { denormalizePoint } from '@/lib/geometry'
import { probeAt, type ShapeRegistry } from '@/lib/probe'
import {
  buildReferenceBlock,
  effectiveProvenance,
  fidelitySummary,
  parseSearch,
  stateToSearch,
} from '@/lib/reference'
import { AnatomyView } from '@/components/anatomy-view/anatomy-view'
import { DepthRail } from '@/components/depth-rail/depth-rail'
import { ProbeReadout } from '@/components/probe-readout/probe-readout'
import { StructureDetail } from '@/components/structure-detail/structure-detail'
import { ReferenceExport } from '@/components/reference-export/reference-export'
import { ViewSwitch } from '@/components/view-switch/view-switch'
import { RegionSwitch } from '@/components/region-switch/region-switch'
import { StructureSearch } from '@/components/structure-search/structure-search'

const initial = parseSearch(window.location.search)
const initialView = getView(initial.viewId ?? DEFAULT_VIEW_ID) ?? getView(DEFAULT_VIEW_ID)!

export function App() {
  const [viewId, setViewId] = useState(initialView.id)

  const view = getView(viewId) ?? initialView
  const placements = useMemo(() => getPlacements(view.id), [view.id])
  const sideVariants = useMemo(() => getSideVariants(view), [view])
  const aspectVariants = useMemo(() => getAspectVariants(view), [view])

  const [depth, setDepth] = useState(initial.depth ?? 1)
  const [selectedId, setSelectedId] = useState<string | null>(
    initial.structureId ?? null,
  )
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [probe, setProbe] = useState<Probe | null>(null)
  const [showBones, setShowBones] = useState(true)

  const registry = useRef<ShapeRegistry>(new Map()).current

  /*
    면이나 부위를 바꾸면 다른 구조가 놓인 다른 공간이다. 층 수도 층 번호의 뜻도
    다르므로, 선택과 지시 지점을 들고 가면 엉뚱한 것을 가리키게 된다.
    좌우 전환만 같은 좌표계라 그대로 유지한다.
  */
  const previousFace = useRef(`${view.region}/${view.aspect}`)

  /*
    이름으로 찾아 건너온 경우는 예외다. 찾은 구조까지 지워 버리면 옮겨간 이유가
    사라진다 — 좌표(지시 지점)만 버리고 선택은 들고 간다.
  */
  const keepSelection = useRef(false)

  useEffect(() => {
    const face = `${view.region}/${view.aspect}`
    if (previousFace.current === face) return
    previousFace.current = face

    setProbe(null)
    setHoveredId(null)
    registry.clear()

    if (keepSelection.current) {
      keepSelection.current = false

      return
    }

    setSelectedId(null)
  }, [view.region, view.aspect, registry])

  // 층 번호는 뷰마다 범위가 다르다. 없는 층에 머무르면 아무것도 안 보인다
  useEffect(() => {
    if (view.layers.some((l) => l.depth === depth)) return

    setDepth(view.layers[view.layers.length - 1]?.depth ?? 0)
  }, [view, depth])

  const depthOf = useCallback(
    (structureId: string): number | undefined =>
      placements.find((p) => p.structureId === structureId)?.depth,
    [placements],
  )

  const runProbe = useCallback(
    (point: Pt): Probe =>
      probeAt(point, view, placements, STRUCTURE_BY_ID, registry),
    [view, placements, registry],
  )

  const handleProbe = useCallback(
    (point: Pt) => {
      const result = runProbe(point)
      setProbe(result)

      const onCurrentLayer = result.candidates.find((c) => c.depth === depth)
      const pick = onCurrentLayer ?? result.candidates[0]
      setSelectedId(pick ? pick.structure.id : null)
    },
    [runProbe, depth],
  )

  const handleRegionChange = useCallback(
    (regionId: string) => {
      const entry = getRegionEntry(regionId, view.side)
      if (entry) setViewId(entry.id)
    },
    [view.side],
  )

  /*
    역방향 조회 — 이름으로 찾아 그 자리로 간다. probe의 반대 방향이라 지시
    지점이 없다. 대신 그 구조가 있는 뷰·층으로 옮기고 선택만 해 준다.
    지점을 억지로 만들면 사용자가 짚지도 않은 곳을 짚은 것처럼 URL에 남는다.
  */
  const handleFind = useCallback(
    (structureId: string, location: StructureLocation) => {
      if (location.view.id !== view.id) {
        keepSelection.current = true
        setProbe(null)
        registry.clear()
        setViewId(location.view.id)
      }

      setDepth(location.depth)
      setSelectedId(structureId)
    },
    [view.id, registry],
  )

  const handleSelect = useCallback(
    (structureId: string) => {
      setSelectedId(structureId)
      const structureDepth = depthOf(structureId)
      if (structureDepth !== undefined) setDepth(structureDepth)
    },
    [depthOf],
  )

  // URL 복원은 첫 렌더 한 번뿐이다. 뷰를 바꿀 때마다 되살아나면 안 된다
  const restored = useRef(false)

  useEffect(() => {
    if (restored.current || !initial.normalizedPoint) return
    restored.current = true

    const point = denormalizePoint(initial.normalizedPoint, view.bbox)
    setProbe(runProbe(point))
  }, [runProbe, view.bbox])

  useEffect(() => {
    const search = stateToSearch(
      {
        viewId: view.id,
        depth,
        point: probe?.point ?? null,
        structureId: selectedId,
      },
      view,
    )

    // URL 동기화는 best-effort다. 임베드(sandbox iframe)에서는 replaceState가
    // SecurityError를 던지는데, 그걸로 앱이 죽으면 안 된다.
    try {
      window.history.replaceState(null, '', search)
    } catch {
      /* 주소창 갱신 실패 — 내보내기 버튼의 URL 복사는 계속 동작한다 */
    }
  }, [view, depth, probe, selectedId])

  const selected = selectedId ? STRUCTURE_BY_ID.get(selectedId) : undefined

  const summary = useMemo(
    () => fidelitySummary(view, placements),
    [view, placements],
  )

  const selectedProvenance = useMemo(
    () =>
      effectiveProvenance(
        placements.find((p) => p.structureId === selectedId),
        view,
      ),
    [placements, selectedId, view],
  )

  const visibleOnLayer = useMemo(
    () =>
      placements
        .filter((p) => p.depth === depth)
        .map((p) => STRUCTURE_BY_ID.get(p.structureId))
        .filter((s) => s !== undefined),
    [placements, depth],
  )

  const referenceBlock = useMemo(
    () => (probe ? buildReferenceBlock(probe, view, selectedId) : ''),
    [probe, view, selectedId],
  )

  const referenceUrl = useMemo(() => {
    if (!probe) return ''

    const search = stateToSearch(
      { viewId: view.id, depth, point: probe.point, structureId: selectedId },
      view,
    )

    return `${window.location.origin}${window.location.pathname}${search}`
  }, [probe, view, depth, selectedId])

  const activeLayer = view.layers.find((l) => l.depth === depth)

  return (
    <div className="min-h-screen w-full p-6 md:p-10">
      <header className="mx-auto mb-8 max-w-5xl">
        <div
          className="font-mono text-[11px] tracking-[0.18em] uppercase"
          style={{ color: 'var(--color-muted)' }}
        >
          {view.label.en} · {view.layers.length} layers
        </div>
        <h1 className="serif mt-1 text-3xl md:text-4xl">
          {view.label.ko} 층별 구조 탐색
        </h1>
        <p
          className="mt-3 max-w-xl text-sm leading-relaxed"
          style={{ color: 'var(--color-dim)' }}
        >
          도해 위의 한 점을 누르면 그 아래 놓인 구조가 깊이 순으로 나옵니다.
          단일 정답이 아니라 후보 목록입니다.
        </p>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {VISIBLE_REGIONS.length > 1 && (
              <RegionSwitch
                regions={VISIBLE_REGIONS}
                regionId={view.region}
                onChange={handleRegionChange}
              />
            )}
            {sideVariants.length > 1 && (
              <ViewSwitch
                views={sideVariants}
                viewId={view.id}
                onChange={setViewId}
              />
            )}
            {aspectVariants.length > 1 && (
              <ViewSwitch
                views={aspectVariants}
                viewId={view.id}
                onChange={setViewId}
                axis="aspect"
              />
            )}
          </div>

          <div className="flex gap-4">
            <DepthRail
              layers={view.layers}
              depth={depth}
              probe={probe}
              showBones={showBones}
              onDepthChange={setDepth}
              onShowBonesChange={setShowBones}
            />
            <AnatomyView
              view={view}
              placements={placements}
              structures={STRUCTURE_BY_ID}
              depth={depth}
              selectedId={selectedId}
              hoveredId={hoveredId}
              pinPoint={probe?.point ?? null}
              showBones={showBones}
              registry={registry}
              onProbe={handleProbe}
              onHover={setHoveredId}
              onSelect={handleSelect}
            />
          </div>
        </div>

        <div className="min-w-0">
          <section className="mb-7">
            <div
              className="mb-3 font-mono text-[10px] tracking-[0.16em] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              이름으로 찾기 · reverse lookup
            </div>
            <StructureSearch
              view={view}
              selectedId={selectedId}
              onPick={handleFind}
            />
          </section>

          <section className="mb-7">
            <div
              className="mb-3 font-mono text-[10px] tracking-[0.16em] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              지시 지점 · core readout
            </div>
            <ProbeReadout
              layers={view.layers}
              probe={probe}
              depth={depth}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </section>

          {selected && (
            <StructureDetail
              structure={selected}
              provenance={selectedProvenance}
            />
          )}

          {probe && (
            <ReferenceExport block={referenceBlock} url={referenceUrl} />
          )}

          <section
            className="mt-7 border-t pt-6"
            style={{ borderColor: 'var(--color-rule)' }}
          >
            <div
              className="mb-3 font-mono text-[10px] tracking-[0.16em] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              L{depth} · {activeLayer?.ko} — {visibleOnLayer.length}개
            </div>
            <div className="flex flex-wrap gap-1.5">
              {visibleOnLayer.map((structure) => {
                const isSelected = structure.id === selectedId

                return (
                  <button
                    key={structure.id}
                    type="button"
                    onClick={() => handleSelect(structure.id)}
                    onMouseEnter={() => setHoveredId(structure.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="border px-2 py-1 text-[12px]"
                    style={{
                      borderColor: isSelected
                        ? 'var(--color-accent)'
                        : 'var(--color-rule)',
                      background: isSelected
                        ? 'var(--color-accent-wash)'
                        : 'transparent',
                      color: isSelected
                        ? 'var(--color-accent)'
                        : 'var(--color-dim)',
                    }}
                  >
                    {structure.name.ko.classic}
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      </div>

      <footer
        className="mx-auto mt-12 max-w-5xl border-t pt-5 text-[11.5px] leading-relaxed"
        style={{ borderColor: 'var(--color-rule)', color: 'var(--color-muted)' }}
      >
        {summary === 'traced' &&
          `형태는 ${view.fidelity === 'traced' ? view.source.ref : ''}를 참조로 트레이싱한 것입니다. 위치 관계와 층 순서가 우선이며 개인차는 반영하지 않습니다.`}
        {summary === 'normalized' &&
          `형태는 ${view.fidelity === 'normalized' ? view.source.ref : ''}에서 상대 위치만 옮긴 것입니다. 어느 높이에서 폭의 어디쯤인지는 자료를 따르지만 전체 비율은 이 도해의 것이라, 순서와 자리는 근거가 있고 모양은 그렇지 않습니다.`}
        {summary === 'mixed' &&
          '형태는 층마다 근거가 다릅니다. 실제 해부 도판을 트레이싱한 것, 거기서 상대 위치만 옮긴 것, 모식도가 섞여 있습니다. 구조를 선택하면 그 구조의 근거가 표시됩니다.'}
        {summary === 'schematic' &&
          '형태는 모식도입니다. 위치 관계와 층 순서를 보기 위한 것이지 실측 도해가 아닙니다.'}{' '}
        {view.mirrorOf &&
          '반대쪽 도해를 좌우 반전해 그린 것이라 좌우 차이는 반영하지 않습니다. '}
        구조를 가리키는 도구이며 증상의 원인을 판단하지 않습니다.
      </footer>
    </div>
  )
}
