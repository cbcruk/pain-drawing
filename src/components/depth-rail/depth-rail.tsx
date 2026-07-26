import type { Layer, Probe } from '@/types/anatomy.types'

interface DepthRailProps {
  layers: Layer[]
  depth: number
  probe: Probe | null
  showBones: boolean
  onDepthChange: (depth: number) => void
  onShowBonesChange: (show: boolean) => void
}

export function DepthRail({
  layers,
  depth,
  probe,
  showBones,
  onDepthChange,
  onShowBonesChange,
}: DepthRailProps) {
  return (
    <div className="flex flex-col justify-center gap-1 pt-4">
      {layers.map((layer) => {
        const active = layer.depth === depth
        const hasCandidate = probe?.candidates.some(
          (c) => c.depth === layer.depth,
        )

        return (
          <button
            key={layer.depth}
            type="button"
            onClick={() => onDepthChange(layer.depth)}
            aria-pressed={active}
            className="w-[92px] border-l-2 px-2 py-2 text-left transition-colors"
            style={{
              borderColor: active
                ? 'var(--color-accent)'
                : hasCandidate
                  ? 'var(--color-hint)'
                  : 'var(--color-rule)',
              background: active ? 'var(--color-accent-wash)' : 'transparent',
            }}
          >
            <div
              className="font-mono text-[10px]"
              style={{
                color: active ? 'var(--color-accent)' : 'var(--color-muted)',
              }}
            >
              L{layer.depth}
            </div>
            <div
              className="text-[11px] leading-tight"
              style={{
                color: active ? 'var(--color-ink)' : 'var(--color-dim)',
              }}
            >
              {layer.ko}
            </div>
            {hasCandidate && !active && (
              <div
                className="mt-0.5 font-mono text-[9px]"
                style={{ color: 'var(--color-mark)' }}
              >
                ● 후보
              </div>
            )}
          </button>
        )
      })}

      <label
        className="mt-4 flex cursor-pointer items-center gap-2 px-2 text-[11px]"
        style={{ color: 'var(--color-dim)' }}
      >
        <input
          type="checkbox"
          checked={showBones}
          onChange={(event) => onShowBonesChange(event.target.checked)}
          className="accent-[var(--color-accent)]"
        />
        뼈 참조
      </label>
    </div>
  )
}
