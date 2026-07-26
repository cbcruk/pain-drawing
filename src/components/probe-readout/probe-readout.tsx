import type { Layer, Probe } from '@/types/anatomy.types'

interface ProbeReadoutProps {
  layers: Layer[]
  probe: Probe | null
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ProbeReadout({
  layers,
  probe,
  depth,
  selectedId,
  onSelect,
}: ProbeReadoutProps) {
  if (!probe) {
    return (
      <div
        className="border border-dashed px-4 py-6 text-sm leading-relaxed"
        style={{ borderColor: 'var(--color-rule)', color: 'var(--color-muted)' }}
      >
        도해를 눌러 지점을 지정하세요. 그 아래 놓인 모든 층의 구조가 나열됩니다.
      </div>
    )
  }

  return (
    <div className="border" style={{ borderColor: 'var(--color-rule)' }}>
      {layers.map((layer) => {
        const hits = probe.candidates.filter((c) => c.depth === layer.depth)

        return (
          <div
            key={layer.depth}
            className="flex items-stretch border-b last:border-b-0"
            style={{
              borderColor: 'var(--color-rule)',
              background:
                layer.depth === depth
                  ? 'var(--color-accent-wash)'
                  : 'transparent',
            }}
          >
            <div
              className="w-11 shrink-0 border-r px-2.5 py-2.5 font-mono text-[10px]"
              style={{
                borderColor: 'var(--color-rule)',
                color: 'var(--color-muted)',
              }}
            >
              L{layer.depth}
            </div>
            <div className="min-w-0 flex-1 px-3 py-2">
              {hits.length === 0 ? (
                <span
                  className="text-[12px]"
                  style={{ color: 'var(--color-faint)' }}
                >
                  —
                </span>
              ) : (
                hits.map((hit) => {
                  const isSelected = hit.structure.id === selectedId

                  return (
                    <button
                      key={hit.structure.id}
                      type="button"
                      onClick={() => onSelect(hit.structure.id)}
                      className="block w-full py-0.5 text-left"
                    >
                      <span
                        className="text-[13px]"
                        style={{
                          color: isSelected
                            ? 'var(--color-accent)'
                            : 'var(--color-ink)',
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        {hit.structure.name.ko.classic}
                      </span>
                      <span
                        className="ml-2 font-mono text-[11px]"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        {hit.structure.name.en}
                      </span>
                      {!hit.reachable && (
                        <span
                          className="ml-2 font-mono text-[10px]"
                          style={{ color: 'var(--color-mark)' }}
                        >
                          도달 불가
                        </span>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
