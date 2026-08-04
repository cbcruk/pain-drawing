import type { View } from '@/types/anatomy.types'
import {
  rmsVerdict,
  type Registration,
  type SegmentedRegistration,
} from '@/lib/registration'
import type { LandmarkPick } from './storage'
import { Button, Field, Hint, Panel } from './ui'

interface CalibrationPanelProps {
  view: View
  /** 지금 정합 중인 분절. 분절이 없는 뷰에서는 null */
  segmentId: string | null
  segmented: SegmentedRegistration
  onSegment: (id: string) => void
  imageName: string | null
  registration: Registration | null
  calibrated: boolean
  picks: LandmarkPick[]
  nextLandmark: string | null
  opacity: number
  sourceRef: string
  sourceLicense: string
  sourceTracedAt: string
  onImage: (file: File) => void
  onOpacity: (value: number) => void
  onUndoPick: () => void
  onResetPicks: () => void
  onSource: (patch: {
    ref?: string
    license?: string
    tracedAt?: string
  }) => void
}

export function CalibrationPanel({
  view,
  segmentId,
  segmented,
  onSegment,
  imageName,
  registration,
  calibrated,
  picks,
  nextLandmark,
  opacity,
  sourceRef,
  sourceLicense,
  sourceTracedAt,
  onImage,
  onOpacity,
  onUndoPick,
  onResetPicks,
  onSource,
}: CalibrationPanelProps) {
  const segments = view.segments
  const active = segments?.find((s) => s.id === segmentId)
  const all = Object.keys(view.landmarks ?? {})
  const total = (active ? active.landmarks.filter((k) => all.includes(k)) : all)
    .length
  const diagonal = Math.hypot(view.bbox.w, view.bbox.h)

  return (
    <Panel
      title="1 · 참조 정합"
      aside={
        picks.length > 0 && (
          <div className="flex gap-1.5">
            <Button onClick={onUndoPick}>되돌리기</Button>
            <Button onClick={onResetPicks}>초기화</Button>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {/*
          자세가 바뀌는 관절에서는 자료 한 장이 뷰 전체에 얹히지 않는다.
          뼈마다 따로 맞추고, 지금 맞춘 뼈의 자리에 이미지가 놓인다.
        */}
        {segments && (
          <div className="flex flex-col gap-1.5">
            <span
              className="font-mono text-[10px] tracking-[0.12em] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              분절
            </span>
            <div
              className="flex w-fit border"
              style={{ borderColor: 'var(--color-rule)' }}
              role="group"
              aria-label="분절 전환"
            >
              {segments.map((segment) => {
                const on = segment.id === segmentId
                const reg = segmented.bySegment[segment.id]

                return (
                  <button
                    key={segment.id}
                    type="button"
                    onClick={() => onSegment(segment.id)}
                    aria-pressed={on}
                    className="px-3 py-1.5 text-[12px] transition-colors"
                    style={{
                      background: on ? 'var(--color-accent-wash)' : 'transparent',
                      color: on ? 'var(--color-accent)' : 'var(--color-muted)',
                    }}
                  >
                    {segment.ko}
                    <span className="ml-1.5 font-mono text-[10px]">
                      {reg ? `rms ${reg.rms.toFixed(1)}` : '미정합'}
                    </span>
                  </button>
                )
              })}
            </div>
            <Hint>
              뼈 하나 안에서는 자료와 뷰가 여전히 닮은 도형입니다. 관절을 건너는
              구조(십자인대·측부인대)는 도형 패널에서 <strong>걸침</strong>을
              지정하면 양 끝 부착부가 각자의 뼈에 붙고 사이는 보간됩니다 —
              그 구간은 트레이싱이 아니라 재구성입니다.
            </Hint>
          </div>
        )}

        <label className="flex flex-col gap-1">
          <span
            className="font-mono text-[10px] tracking-[0.12em] uppercase"
            style={{ color: 'var(--color-muted)' }}
          >
            참조 이미지
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onImage(file)
            }}
            className="text-[11.5px]"
            style={{ color: 'var(--color-dim)' }}
          />
          {imageName && (
            <span className="font-mono text-[11px]" style={{ color: 'var(--color-faint)' }}>
              {imageName}
            </span>
          )}
        </label>

        {imageName && (
          <label className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] tracking-[0.12em] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              투명도
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(event) => onOpacity(Number(event.target.value))}
              className="flex-1"
            />
            <span
              className="font-mono text-[11px] tabular-nums"
              style={{ color: 'var(--color-faint)' }}
            >
              {Math.round(opacity * 100)}%
            </span>
          </label>
        )}

        <div
          className="border p-2.5 text-[12px] leading-relaxed"
          style={{ borderColor: 'var(--color-rule)' }}
        >
          <div className="font-mono text-[11px]" style={{ color: 'var(--color-dim)' }}>
            기준점 {picks.length} / {total}
          </div>

          {nextLandmark ? (
            <div className="mt-1" style={{ color: 'var(--color-ink)' }}>
              캔버스에서 <strong>{nextLandmark}</strong> 위치를 클릭하세요.
            </div>
          ) : (
            <div className="mt-1" style={{ color: 'var(--color-ink)' }}>
              기준점 입력 완료.
            </div>
          )}

          {registration && calibrated && (
            <div
              className="mt-1.5 font-mono text-[11px] tabular-nums"
              style={{ color: 'var(--color-muted)' }}
            >
              rms {registration.rms.toFixed(2)} ·{' '}
              {rmsVerdict(registration.rms, diagonal)}
              {registration.flip && ' · 좌우 반전 적용'}
            </div>
          )}

          {registration?.reflectionAmbiguous && calibrated && (
            <div className="mt-1.5 text-[12px]" style={{ color: 'var(--color-mark)' }}>
              기준점이 2개라 <strong>좌우 반전을 데이터가 정하지 못했습니다.</strong>{' '}
              rms 0은 정합이 맞다는 뜻이 아닙니다 — 정방향과 거울상이 똑같이
              맞습니다. 도해가 뒤집혀 보이면 기준점을 하나 더 찍으세요.
            </div>
          )}
        </div>

        <Hint>
          기준점 2개면 변환이 잡히지만 좌우 반전은 3개부터 갈립니다. 상사변환은
          자유도가 4라 점 2개는 어느 방향으로든 정확히 통과하기 때문입니다.
          비등방 스케일은 쓰지 않으므로 종횡비가 안 맞는 참조는 rms로 드러납니다.
        </Hint>

        <div className="grid grid-cols-1 gap-2">
          <Field
            label="출처 ref"
            value={sourceRef}
            onChange={(ref) => onSource({ ref })}
            placeholder="Visible Human, 우측 발 단면 #1420"
          />
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="라이선스"
              value={sourceLicense}
              onChange={(license) => onSource({ license })}
              placeholder="PD / CC BY"
              mono
            />
            <Field
              label="트레이싱 시점"
              value={sourceTracedAt}
              onChange={(tracedAt) => onSource({ tracedAt })}
              placeholder="2026-07"
              mono
            />
          </div>
        </div>

        <Hint>
          이 값이 있어야 뷰를 <code>fidelity: 'traced'</code>로 바꿀 수 있습니다.
          참조 이미지는 배경으로만 쓰고 결과물에 포함하지 않습니다.
        </Hint>
      </div>
    </Panel>
  )
}
