import type { View } from '@/types/anatomy.types'
import { rmsVerdict, type Registration } from '@/lib/registration'
import type { LandmarkPick } from './storage'
import { Button, Field, Hint, Panel } from './ui'

interface CalibrationPanelProps {
  view: View
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
  const total = Object.keys(view.landmarks ?? {}).length
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
        </div>

        <Hint>
          기준점은 2개부터 변환이 잡히고, 3개 이상이면 최소제곱으로 맞춥니다.
          비등방 스케일은 쓰지 않으므로 종횡비가 안 맞는 참조는 rms로 드러납니다.
          반전 여부는 잔차가 작은 쪽으로 자동 선택됩니다.
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
