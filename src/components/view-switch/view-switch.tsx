import type { View } from '@/types/anatomy.types'

const SIDE_LABEL: Record<View['side'], string> = {
  right: '오른쪽',
  left: '왼쪽',
}

interface ViewSwitchProps {
  views: View[]
  viewId: string
  onChange: (viewId: string) => void
}

export function ViewSwitch({ views, viewId, onChange }: ViewSwitchProps) {
  return (
    <div
      className="flex w-fit border"
      style={{ borderColor: 'var(--color-rule)' }}
      role="group"
      aria-label="좌우 전환"
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
            {SIDE_LABEL[view.side]}
          </button>
        )
      })}
    </div>
  )
}
