import type { View } from '@/types/anatomy.types'

const SIDE_LABEL: Record<View['side'], string> = {
  right: '오른쪽',
  left: '왼쪽',
}

interface ViewSwitchProps {
  views: View[]
  viewId: string
  onChange: (viewId: string) => void
  /** 무엇을 바꾸는 스위치인가 — 좌우(기본)인지 면인지 */
  axis?: 'side' | 'aspect'
}

const ARIA: Record<'side' | 'aspect', string> = {
  side: '좌우 전환',
  aspect: '면 전환',
}

export function ViewSwitch({
  views,
  viewId,
  onChange,
  axis = 'side',
}: ViewSwitchProps) {
  return (
    <div
      className="flex w-fit border"
      style={{ borderColor: 'var(--color-rule)' }}
      role="group"
      aria-label={ARIA[axis]}
    >
      {views.map((view) => {
        const active = view.id === viewId

        return (
          <button
            key={view.id}
            type="button"
            onClick={() => onChange(view.id)}
            aria-pressed={active}
            className="px-3 py-1.5 text-[12px] transition-colors"
            style={{
              background: active ? 'var(--color-accent-wash)' : 'transparent',
              color: active ? 'var(--color-accent)' : 'var(--color-muted)',
            }}
          >
            {axis === 'aspect'
              ? (view.aspectLabel ?? view.aspect)
              : (view.sideLabel ?? SIDE_LABEL[view.side])}
          </button>
        )
      })}
    </div>
  )
}
