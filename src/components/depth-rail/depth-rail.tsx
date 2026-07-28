import type { Layer, Probe } from '@/types/anatomy.types'
import { depthBarColor } from './depth-rail.utils'

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
  const maxDepth = Math.max(...layers.map((layer) => layer.depth))

  return (
    <div className="flex w-[132px] flex-col justify-center pt-4">
      <div
        className="mb-1.5 pl-4 font-mono text-[9px] tracking-[0.14em] uppercase"
        style={{ color: 'var(--color-muted)' }}
      >
        피부 쪽
      </div>

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
            title={layer.hint}
            className="flex items-stretch gap-2 text-left transition-colors"
            style={{
              background: active ? 'var(--color-accent-wash)' : 'transparent',
            }}
          >
            <span
              aria-hidden
              className="w-2.5 shrink-0"
              style={{
                background: active
                  ? 'var(--color-accent)'
                  : depthBarColor(layer.depth, maxDepth),
              }}
            />
            <span className="min-w-0 flex-1 py-1.5 pr-2">
              <span
                className="block font-mono text-[10px]"
                style={{
                  color: active ? 'var(--color-accent)' : 'var(--color-muted)',
                }}
              >
                L{layer.depth}
              </span>
              <span
                className="block text-[11px] leading-tight"
                style={{
                  color: active ? 'var(--color-ink)' : 'var(--color-dim)',
                }}
              >
                {layer.ko}
              </span>
              {active && layer.hint && (
                <span
                  className="mt-1 block text-[10px] leading-snug"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {layer.hint}
                </span>
              )}
              {hasCandidate && !active && (
                <span
                  className="mt-0.5 block font-mono text-[9px]"
                  style={{ color: 'var(--color-mark)' }}
                >
                  ● 후보
                </span>
              )}
            </span>
          </button>
        )
      })}

      <div
        className="mt-1.5 pl-4 font-mono text-[9px] tracking-[0.14em] uppercase"
        style={{ color: 'var(--color-muted)' }}
      >
        뼈 쪽
      </div>

      <label
        className="mt-5 flex cursor-pointer items-center gap-2 pl-4 text-[11px]"
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
