import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Pt } from '@/types/anatomy.types'
import { PLACEMENTS, STRUCTURES, VIEWS, getPlacements, getView } from '@/data'
import {
  applyAcross,
  fitSegmented,
  fitToViewBox,
  invertRegistration,
  type Correspondence,
} from '@/lib/registration'
import { Canvas, type LandmarkTarget } from './canvas'
import { CalibrationPanel } from './calibration-panel'
import { ExportPanel } from './export-panel'
import { MetadataPanel } from './metadata-panel'
import { ShapePanel } from './shape-panel'
import {
  DEFAULT_WIDTH,
  draftLabel,
  emptyDraft,
  emptyShape,
  fromExisting,
  type Draft,
  type DraftShape,
} from './draft'
import { clearSession, loadSession, saveSession, type LandmarkPick } from './storage'
import { Button, Hint, Panel } from './ui'

const HISTORY_LIMIT = 60

/** 분절이 없는 뷰의 유일한 분절 이름 — 발처럼 뷰 전체가 하나의 강체인 경우 */
const SINGLE = '*'

const saved = loadSession()
const firstView = VIEWS[0]!

export function Author() {
  const [viewId, setViewId] = useState(saved?.viewId ?? firstView.id)
  const view = getView(viewId) ?? firstView

  const [drafts, setDrafts] = useState<Draft[]>(saved?.drafts ?? [])
  const [activeDraftKey, setActiveDraftKey] = useState<string | null>(
    saved?.activeDraftKey ?? null,
  )
  const [activeShapeKey, setActiveShapeKey] = useState<string | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)

  const [picks, setPicks] = useState<LandmarkPick[]>(saved?.picks ?? [])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState<[number, number] | null>(
    saved?.imageSize ?? null,
  )
  const [opacity, setOpacity] = useState(0.7)
  const [mode, setMode] = useState<'calibrate' | 'draw'>('draw')

  const [showGuides, setShowGuides] = useState(true)
  const [showExisting, setShowExisting] = useState(false)

  const [sourceRef, setSourceRef] = useState(saved?.sourceRef ?? '')
  const [sourceLicense, setSourceLicense] = useState(saved?.sourceLicense ?? '')
  const [sourceTracedAt, setSourceTracedAt] = useState(saved?.sourceTracedAt ?? '')

  const history = useRef<Draft[][]>([])
  const [canUndo, setCanUndo] = useState(false)

  const activeDraft = drafts.find((d) => d.key === activeDraftKey) ?? null

  /* ---- 이력 ---- */

  const commit = useCallback(
    (next: (current: Draft[]) => Draft[]) => {
      setDrafts((current) => {
        history.current = [...history.current.slice(-HISTORY_LIMIT), current]

        return next(current)
      })
      setCanUndo(true)
    },
    [],
  )

  const undo = useCallback(() => {
    const previous = history.current.pop()
    if (!previous) return

    setDrafts(previous)
    setCanUndo(history.current.length > 0)
  }, [])

  /* ---- 정합 ---- */

  /*
    분절이 있는 뷰(무릎)에서는 자료 한 장이 뷰 전체에 얹히지 않는다. 뼈마다
    변환이 다르므로 **한 번에 한 분절씩** 정합하고, 그 분절의 변환 아래에서
    그 뼈에 붙은 구조를 그린다. 분절이 없는 뷰(발)는 지금까지와 똑같다.
  */
  const segments = view.segments ?? null
  const [segmentId, setSegmentId] = useState<string | null>(
    segments?.[0]?.id ?? null,
  )

  // 뷰를 바꾸면 분절도 그 뷰의 것으로 — 안 그러면 이전 뷰의 id가 남아 어느
  // 분절에도 안 걸리고, 정합 대상이 조용히 랜드마크 전체로 돌아간다
  useEffect(() => {
    setSegmentId(view.segments?.[0]?.id ?? null)
  }, [view])

  const activeSegment = segments?.find((s) => s.id === segmentId) ?? null

  const landmarkKeys = useMemo(() => {
    const all = Object.keys(view.landmarks ?? {})

    return activeSegment
      ? activeSegment.landmarks.filter((key) => all.includes(key))
      : all
  }, [view.landmarks, activeSegment])

  const provisional = useMemo(
    () =>
      imageSize ? fitToViewBox(imageSize[0], imageSize[1], view.viewBox) : null,
    [imageSize, view.viewBox],
  )

  /** 분절 id(또는 분절이 없으면 단일 키) → 그 분절에 찍힌 대응점 */
  const pairsBySegment = useMemo(() => {
    const landmarks = view.landmarks
    if (!landmarks) return {}

    const owner = (key: string): string =>
      segments?.find((s) => s.landmarks.includes(key))?.id ?? SINGLE

    const out: Record<string, Correspondence[]> = {}
    for (const pick of picks) {
      const target = landmarks[pick.landmark]
      if (!target) continue

      const id = owner(pick.landmark)
      ;(out[id] ??= []).push({ from: pick.image, to: target })
    }

    return out
  }, [picks, view.landmarks, segments])

  const segmented = useMemo(
    () => fitSegmented(pairsBySegment),
    [pairsBySegment],
  )

  const fitted = segmented.bySegment[segmentId ?? SINGLE] ?? null

  /*
    걸친 도형을 푸는 법. 화면 점은 출발 분절의 변환 아래에서 찍혔으므로 일단
    이미지 좌표로 되돌린 뒤 두 변환 사이를 보간한다. 그래서 출발 쪽 끝은 그린
    자리에 그대로 남고, 도착 쪽 끝만 그 뼈의 자리로 옮겨간다.

    두 변환이 다 없으면 손대지 않는다 — 정합이 덜 된 상태에서 좌표를 조용히
    흔들면 무엇을 그린 건지 알 수 없게 된다.
  */
  const resolveSpan = useCallback(
    (points: Pt[], [fromId, toId]: [string, string]): Pt[] => {
      const from = segmented.bySegment[fromId]
      const to = segmented.bySegment[toId]
      if (!from || !to) return points

      return applyAcross(from, to, points.map((p) => invertRegistration(from, p)))
    },
    [segmented],
  )

  const registration = fitted ?? provisional
  const nextLandmark =
    landmarkKeys.find((key) => !picks.some((p) => p.landmark === key)) ?? null

  const landmarkTargets: LandmarkTarget[] = useMemo(
    () =>
      landmarkKeys.map((key) => ({
        key,
        point: view.landmarks?.[key] ?? [0, 0],
        done: picks.some((p) => p.landmark === key),
        next: key === nextLandmark,
      })),
    [landmarkKeys, view.landmarks, picks, nextLandmark],
  )

  /* ---- 저장 ---- */

  useEffect(() => {
    saveSession({
      viewId,
      drafts,
      activeDraftKey,
      picks,
      imageSize,
      sourceRef,
      sourceLicense,
      sourceTracedAt,
    })
  }, [
    viewId,
    drafts,
    activeDraftKey,
    picks,
    imageSize,
    sourceRef,
    sourceLicense,
    sourceTracedAt,
  ])

  useEffect(() => {
    const url = imageUrl

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [imageUrl])

  /* ---- 도형 편집 ---- */

  const patchActiveShape = useCallback(
    (patch: (shape: DraftShape) => DraftShape) => {
      commit((current) =>
        current.map((draft) =>
          draft.key === activeDraftKey
            ? {
                ...draft,
                shapes: draft.shapes.map((shape) =>
                  shape.key === activeShapeKey ? patch(shape) : shape,
                ),
              }
            : draft,
        ),
      )
    },
    [commit, activeDraftKey, activeShapeKey],
  )

  const handlePick = useCallback(
    (point: Pt) => {
      if (mode === 'calibrate') {
        if (!nextLandmark || !registration) return

        const image = invertRegistration(registration, point)
        setPicks((current) => [...current, { landmark: nextLandmark, image }])

        return
      }

      if (!activeDraft || !activeShapeKey) return

      patchActiveShape((shape) => {
        if (shape.t === 'circle') {
          return { ...shape, p: [point], w: [shape.w[0] ?? DEFAULT_WIDTH] }
        }

        const last = shape.w[shape.w.length - 1] ?? DEFAULT_WIDTH

        return { ...shape, p: [...shape.p, point], w: [...shape.w, last] }
      })

      setSelectedPoint(
        activeDraft.shapes.find((s) => s.key === activeShapeKey)?.p.length ?? 0,
      )
    },
    [
      mode,
      nextLandmark,
      registration,
      activeDraft,
      activeShapeKey,
      patchActiveShape,
    ],
  )

  const movePoint = useCallback(
    (index: number, point: Pt) => {
      patchActiveShape((shape) => ({
        ...shape,
        p: shape.p.map((p, i) => (i === index ? point : p)),
      }))
    },
    [patchActiveShape],
  )

  const nudgePoint = useCallback(
    (dx: number, dy: number) => {
      if (selectedPoint === null) return

      patchActiveShape((shape) => ({
        ...shape,
        p: shape.p.map((p, i): Pt =>
          i === selectedPoint ? [p[0] + dx, p[1] + dy] : p,
        ),
      }))
    },
    [patchActiveShape, selectedPoint],
  )

  const deletePoint = useCallback(
    (index: number) => {
      patchActiveShape((shape) => ({
        ...shape,
        p: shape.p.filter((_, i) => i !== index),
        w: shape.w.filter((_, i) => i !== index),
      }))
      setSelectedPoint(null)
    },
    [patchActiveShape],
  )

  /* ---- 키보드 ---- */

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
      ) {
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        undo()

        return
      }

      if (selectedPoint === null) return

      const step = event.shiftKey ? 10 : 1
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      }
      const move = moves[event.key]

      if (move) {
        event.preventDefault()
        nudgePoint(move[0], move[1])

        return
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        deletePoint(selectedPoint)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, nudgePoint, deletePoint, selectedPoint])

  /* ---- 구조 ---- */

  const addDraft = useCallback(() => {
    const draft = emptyDraft(view.layers[0]?.depth ?? 0)

    commit((current) => [...current, draft])
    setActiveDraftKey(draft.key)
    setActiveShapeKey(draft.shapes[0]?.key ?? null)
    setSelectedPoint(null)
  }, [commit, view.layers])

  const selectDraft = useCallback((draft: Draft) => {
    setActiveDraftKey(draft.key)
    setActiveShapeKey(draft.shapes[0]?.key ?? null)
    setSelectedPoint(null)
  }, [])

  const loadExisting = useCallback(
    (structureId: string) => {
      const structure = STRUCTURES.find((s) => s.id === structureId)
      if (!structure) return

      const placement = PLACEMENTS.find(
        (p) => p.structureId === structureId && p.viewId === view.id,
      )
      const draft = fromExisting(structure, placement)

      commit((current) => [...current, draft])
      setActiveDraftKey(draft.key)
      setActiveShapeKey(draft.shapes[0]?.key ?? null)
      setSelectedPoint(null)
    },
    [commit, view.id],
  )

  const existingPlacements = useMemo(() => getPlacements(view.id), [view.id])

  const handleImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      setImageSize([image.naturalWidth, image.naturalHeight])
      setImageUrl(url)
      setImageName(file.name)
      setMode('calibrate')
    }
    image.src = url
  }, [])

  useEffect(() => {
    if (mode === 'calibrate' && !nextLandmark) setMode('draw')
  }, [mode, nextLandmark])

  return (
    <div
      className="min-h-screen px-5 py-6"
      style={{ background: 'var(--color-paper)', color: 'var(--color-ink)' }}
    >
      <header className="mx-auto mb-5 flex max-w-[1400px] flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="font-mono text-[10px] tracking-[0.18em] uppercase"
            style={{ color: 'var(--color-muted)' }}
          >
            M1 · authoring
          </div>
          <h1 className="serif text-[26px] leading-tight">좌표 저작 도구</h1>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <select
            value={viewId}
            onChange={(event) => setViewId(event.target.value)}
            className="border px-2 py-1 text-[12px]"
            style={{
              borderColor: 'var(--color-rule)',
              background: 'var(--color-paper)',
              color: 'var(--color-ink)',
            }}
          >
            {VIEWS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label.ko}
              </option>
            ))}
          </select>
          <Button
            onClick={() => setMode('calibrate')}
            active={mode === 'calibrate'}
            disabled={!imageUrl}
          >
            정합
          </Button>
          <Button onClick={() => setMode('draw')} active={mode === 'draw'}>
            그리기
          </Button>
          <Button onClick={() => setShowGuides((v) => !v)} active={showGuides}>
            윤곽
          </Button>
          <Button onClick={() => setShowExisting((v) => !v)} active={showExisting}>
            기존 구조
          </Button>
          <a
            href="./index.html"
            className="border px-2.5 py-1 font-mono text-[11px]"
            style={{ borderColor: 'var(--color-rule)', color: 'var(--color-dim)' }}
          >
            지시 도구 →
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
        <div
          className="flex h-[calc(100vh-9rem)] min-h-[440px] items-center justify-center border p-2 lg:sticky lg:top-4"
          style={{ borderColor: 'var(--color-rule)' }}
        >
          <Canvas
            view={view}
            mode={mode}
            imageUrl={imageUrl}
            imageSize={imageSize}
            registration={registration}
            imageOpacity={opacity}
            showGuides={showGuides}
            showExisting={showExisting}
            existing={existingPlacements}
            drafts={drafts}
            activeDraft={activeDraft}
            activeShapeKey={activeShapeKey}
            selectedPoint={selectedPoint}
            landmarks={landmarkTargets}
            resolveSpan={resolveSpan}
            onPick={handlePick}
            onMovePoint={movePoint}
            onSelectPoint={setSelectedPoint}
          />
        </div>

        <div className="flex flex-col gap-5">
          <Panel
            title="0 · 구조"
            aside={
              <div className="flex gap-1.5">
                <Button onClick={addDraft}>+ 새 구조</Button>
                <Button
                  onClick={() => {
                    if (drafts.length === 0) return
                    commit(() => [])
                    setActiveDraftKey(null)
                    setActiveShapeKey(null)
                  }}
                  disabled={drafts.length === 0}
                >
                  전체 비우기
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-2">
              {drafts.length === 0 ? (
                <Hint>
                  새 구조를 만들거나, 아래에서 기존 구조를 불러와 좌표를
                  다시 찍을 수 있습니다.
                </Hint>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {drafts.map((draft) => (
                    <button
                      key={draft.key}
                      type="button"
                      onClick={() => selectDraft(draft)}
                      className="border px-2 py-1 text-[12px]"
                      style={{
                        borderColor:
                          draft.key === activeDraftKey
                            ? 'var(--color-accent)'
                            : 'var(--color-rule)',
                        background:
                          draft.key === activeDraftKey
                            ? 'var(--color-accent-wash)'
                            : 'transparent',
                        color:
                          draft.key === activeDraftKey
                            ? 'var(--color-accent)'
                            : 'var(--color-dim)',
                      }}
                    >
                      {draftLabel(draft)}
                    </button>
                  ))}
                </div>
              )}

              <select
                value=""
                onChange={(event) => {
                  if (event.target.value) loadExisting(event.target.value)
                }}
                className="border px-2 py-1 text-[12px]"
                style={{
                  borderColor: 'var(--color-rule)',
                  background: 'var(--color-paper)',
                  color: 'var(--color-ink)',
                }}
              >
                <option value="">기존 구조 불러오기…</option>
                {existingPlacements.map((placement) => {
                  const structure = STRUCTURES.find(
                    (s) => s.id === placement.structureId,
                  )

                  return (
                    <option key={placement.structureId} value={placement.structureId}>
                      L{placement.depth} · {structure?.name.ko.classic ?? placement.structureId}
                    </option>
                  )
                })}
              </select>

              {drafts.length > 0 && (
                <Button
                  onClick={() => {
                    clearSession()
                    commit(() => [])
                    setPicks([])
                    setActiveDraftKey(null)
                    setActiveShapeKey(null)
                  }}
                >
                  세션 초기화
                </Button>
              )}
            </div>
          </Panel>

          <CalibrationPanel
            view={view}
            segmentId={segmentId}
            segmented={segmented}
            onSegment={setSegmentId}
            imageName={imageName}
            registration={fitted}
            calibrated={Boolean(fitted)}
            picks={picks}
            nextLandmark={mode === 'calibrate' ? nextLandmark : null}
            opacity={opacity}
            sourceRef={sourceRef}
            sourceLicense={sourceLicense}
            sourceTracedAt={sourceTracedAt}
            onImage={handleImage}
            onOpacity={setOpacity}
            onUndoPick={() => setPicks((current) => current.slice(0, -1))}
            onResetPicks={() => setPicks([])}
            onSource={(patch) => {
              if (patch.ref !== undefined) setSourceRef(patch.ref)
              if (patch.license !== undefined) setSourceLicense(patch.license)
              if (patch.tracedAt !== undefined) setSourceTracedAt(patch.tracedAt)
            }}
          />

          <ShapePanel
            draft={activeDraft}
            segments={segments}
            activeShapeKey={activeShapeKey}
            onSpan={(span) =>
              patchActiveShape((shape) => {
                if (!span) {
                  const { span: _drop, ...rest } = shape
                  return rest
                }
                return { ...shape, span }
              })
            }
            selectedPoint={selectedPoint}
            canUndo={canUndo}
            onAddShape={(t) => {
              const shape = emptyShape(t)
              commit((current) =>
                current.map((draft) =>
                  draft.key === activeDraftKey
                    ? { ...draft, shapes: [...draft.shapes, shape] }
                    : draft,
                ),
              )
              setActiveShapeKey(shape.key)
              setSelectedPoint(null)
            }}
            onSelectShape={(key) => {
              setActiveShapeKey(key)
              setSelectedPoint(null)
            }}
            onDeleteShape={(key) => {
              commit((current) =>
                current.map((draft) =>
                  draft.key === activeDraftKey
                    ? { ...draft, shapes: draft.shapes.filter((s) => s.key !== key) }
                    : draft,
                ),
              )
              setActiveShapeKey(null)
              setSelectedPoint(null)
            }}
            onSelectPoint={setSelectedPoint}
            onWidth={(index, width) =>
              patchActiveShape((shape) => ({
                ...shape,
                w: shape.p.map((_, i) =>
                  i === index ? width : (shape.w[i] ?? DEFAULT_WIDTH),
                ),
              }))
            }
            onWidthAll={(width) =>
              patchActiveShape((shape) => ({
                ...shape,
                w: shape.p.map(() => width),
              }))
            }
            onDeletePoint={deletePoint}
            onUndo={undo}
          />

          <MetadataPanel
            draft={activeDraft}
            view={view}
            onChange={(patch) =>
              commit((current) =>
                current.map((draft) =>
                  draft.key === activeDraftKey ? { ...draft, ...patch } : draft,
                ),
              )
            }
          />

          <ExportPanel
            drafts={drafts}
            view={view}
            sourceRef={sourceRef}
            sourceLicense={sourceLicense}
            sourceTracedAt={sourceTracedAt}
            resolveSpan={resolveSpan}
          />
        </div>
      </div>

      <footer
        className="mx-auto mt-10 max-w-[1400px] border-t pt-4 text-[11.5px] leading-relaxed"
        style={{ borderColor: 'var(--color-rule)', color: 'var(--color-muted)' }}
      >
        작업 내용은 브라우저에 자동 저장됩니다. 참조 이미지는 저장하지 않으므로
        새로고침 후 같은 파일을 다시 선택하면 기준점이 그대로 살아납니다.
      </footer>
    </div>
  )
}
