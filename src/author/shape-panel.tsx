import type { Segment } from '@/types/anatomy.types'
import { DEFAULT_WIDTH, type Draft, type DraftShape } from './draft'
import { Button, Hint, Panel } from './ui'

interface ShapePanelProps {
  draft: Draft | null
  /** 뷰가 강체 분절로 나뉘면 도형이 관절을 건널 수 있다 */
  segments: Segment[] | null
  activeShapeKey: string | null
  selectedPoint: number | null
  canUndo: boolean
  onAddShape: (t: DraftShape['t']) => void
  onSelectShape: (key: string) => void
  onDeleteShape: (key: string) => void
  onSelectPoint: (index: number) => void
  onWidth: (index: number, width: number) => void
  onWidthAll: (width: number) => void
  onDeletePoint: (index: number) => void
  onSpan: (span: [string, string] | undefined) => void
  onUndo: () => void
}

const segmentName = (segments: Segment[] | null, id: string): string =>
  segments?.find((s) => s.id === id)?.ko ?? id

const shapeLabel = (shape: DraftShape): string =>
  shape.t === 'circle'
    ? `원 · ${shape.p.length ? '1점' : '비어 있음'}`
    : `리본 · ${shape.p.length}점`

export function ShapePanel({
  draft,
  segments,
  activeShapeKey,
  selectedPoint,
  canUndo,
  onAddShape,
  onSelectShape,
  onDeleteShape,
  onSelectPoint,
  onWidth,
  onWidthAll,
  onDeletePoint,
  onSpan,
  onUndo,
}: ShapePanelProps) {
  const shape = draft?.shapes.find((s) => s.key === activeShapeKey) ?? null
  const width =
    shape && selectedPoint !== null
      ? (shape.w[selectedPoint] ?? DEFAULT_WIDTH)
      : DEFAULT_WIDTH

  return (
    <Panel
      title="2 · 도형"
      aside={
        <div className="flex gap-1.5">
          <Button onClick={onUndo} disabled={!canUndo} title="Ctrl+Z">
            실행 취소
          </Button>
        </div>
      }
    >
      {!draft ? (
        <Hint>구조를 먼저 만들거나 선택하세요.</Hint>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {draft.shapes.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => onSelectShape(s.key)}
                className="border px-2 py-1 font-mono text-[11px]"
                style={{
                  borderColor:
                    s.key === activeShapeKey
                      ? 'var(--color-accent)'
                      : 'var(--color-rule)',
                  color:
                    s.key === activeShapeKey
                      ? 'var(--color-accent)'
                      : 'var(--color-dim)',
                }}
              >
                {shapeLabel(s)}
              </button>
            ))}
            <Button onClick={() => onAddShape('ribbon')}>+ 리본</Button>
            <Button onClick={() => onAddShape('circle')}>+ 원</Button>
            {shape && draft.shapes.length > 1 && (
              <Button onClick={() => onDeleteShape(shape.key)}>도형 삭제</Button>
            )}
          </div>

          {/*
            관절을 건너는 도형. 출발 분절의 변환 아래에서 그리고, 내보낼 때
            도착 쪽 끝이 그 뼈로 옮겨간다. 첫 점이 출발, 마지막 점이 도착이다.
          */}
          {shape && shape.t === 'ribbon' && segments && segments.length > 1 && (
            <label className="flex flex-col gap-1">
              <span
                className="font-mono text-[10px] tracking-[0.12em] uppercase"
                style={{ color: 'var(--color-muted)' }}
              >
                걸침
              </span>
              <select
                value={shape.span ? shape.span.join('>') : ''}
                onChange={(event) => {
                  const [from, to] = event.target.value.split('>')
                  onSpan(from && to ? [from, to] : undefined)
                }}
                className="border px-2 py-1 text-[12.5px]"
                style={{
                  borderColor: 'var(--color-rule)',
                  background: 'var(--color-paper)',
                  color: 'var(--color-ink)',
                }}
              >
                <option value="">한 분절 안에 있다 (그린 그대로)</option>
                {segments.flatMap((a) =>
                  segments
                    .filter((b) => b.id !== a.id)
                    .map((b) => (
                      <option key={`${a.id}>${b.id}`} value={`${a.id}>${b.id}`}>
                        {a.ko} → {b.ko}
                      </option>
                    )),
                )}
              </select>
              {shape.span && (
                <Hint>
                  첫 점이 <strong>{segmentName(segments, shape.span[0])}</strong>{' '}
                  쪽 부착부, 마지막 점이{' '}
                  <strong>{segmentName(segments, shape.span[1])}</strong>{' '}
                  쪽입니다. 양 끝은 정확하고
                  사이는 보간 — 그리는 동안은 원래 자리에, 선택을 풀면 옮겨간
                  자리에 그려집니다.
                </Hint>
              )}
            </label>
          )}

          {shape && (
            <>
              <div
                className="max-h-44 overflow-y-auto border"
                style={{ borderColor: 'var(--color-rule)' }}
              >
                {shape.p.length === 0 && (
                  <div className="p-2 text-[12px]" style={{ color: 'var(--color-muted)' }}>
                    캔버스를 클릭해 {shape.t === 'circle' ? '중심을' : '중심선을'} 찍으세요.
                  </div>
                )}
                {shape.p.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelectPoint(i)}
                    className="flex w-full items-center gap-3 px-2 py-1 text-left font-mono text-[11px] tabular-nums"
                    style={{
                      background:
                        selectedPoint === i
                          ? 'var(--color-accent-wash)'
                          : 'transparent',
                      color:
                        selectedPoint === i
                          ? 'var(--color-accent)'
                          : 'var(--color-dim)',
                    }}
                  >
                    <span style={{ color: 'var(--color-faint)' }}>
                      {String(i).padStart(2, '0')}
                    </span>
                    <span>
                      {Math.round(p[0])}, {Math.round(p[1])}
                    </span>
                    <span className="ml-auto">
                      {shape.t === 'circle' ? 'r' : 'w'}{' '}
                      {Math.round(shape.w[i] ?? DEFAULT_WIDTH)}
                    </span>
                  </button>
                ))}
              </div>

              {selectedPoint !== null && shape.p[selectedPoint] && (
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <span
                      className="font-mono text-[10px] tracking-[0.12em] uppercase"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {shape.t === 'circle' ? '반지름' : '폭'}
                    </span>
                    <input
                      type="range"
                      min={2}
                      max={140}
                      step={1}
                      value={width}
                      onChange={(event) =>
                        onWidth(selectedPoint, Number(event.target.value))
                      }
                      className="flex-1"
                    />
                    <span
                      className="w-8 text-right font-mono text-[11px] tabular-nums"
                      style={{ color: 'var(--color-dim)' }}
                    >
                      {Math.round(width)}
                    </span>
                  </label>

                  <div className="flex gap-1.5">
                    {shape.t === 'ribbon' && (
                      <Button onClick={() => onWidthAll(width)}>
                        이 폭을 전체에
                      </Button>
                    )}
                    <Button onClick={() => onDeletePoint(selectedPoint)}>
                      점 삭제
                    </Button>
                  </div>
                </div>
              )}

              <Hint>
                캔버스 클릭으로 점 추가, 점을 끌어 이동. 선택한 점은 방향키로
                1씩(Shift 10씩) 미세 조정, Delete로 삭제, Ctrl+Z로 되돌리기.
                새 점은 직전 점의 폭을 물려받습니다.
              </Hint>
            </>
          )}
        </div>
      )}
    </Panel>
  )
}
