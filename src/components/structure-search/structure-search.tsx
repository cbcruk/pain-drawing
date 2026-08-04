import { useMemo, useState } from 'react'
import type { View } from '@/types/anatomy.types'
import { pickLocation, searchStructures, type StructureLocation } from '@/data'
import { TISSUE } from '@/data/tissue'

interface StructureSearchProps {
  view: View
  selectedId: string | null
  onPick: (structureId: string, location: StructureLocation) => void
}

/** 지금 뷰에 있으면 층만, 다른 뷰면 어느 뷰인지까지 말해야 한다 */
function locationLabel(location: StructureLocation, current: View): string {
  const layer = location.view.layers.find((l) => l.depth === location.depth)
  const where = `L${location.depth}${layer ? ` · ${layer.ko}` : ''}`

  return location.view.id === current.id
    ? where
    : `${location.view.label.ko} · ${where}`
}

export function StructureSearch({
  view,
  selectedId,
  onPick,
}: StructureSearchProps) {
  const [query, setQuery] = useState('')

  const hits = useMemo(() => searchStructures(query), [query])
  const trimmed = query.trim()

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="이름으로 찾기 — 무지외전근 / 엄지벌림근 / abductor hallucis"
        className="w-full border px-3 py-2 text-[13px]"
        style={{
          borderColor: 'var(--color-rule)',
          background: 'var(--color-paper)',
          color: 'var(--color-ink)',
        }}
      />

      {trimmed !== '' && (
        <div
          className="mt-2 border"
          style={{ borderColor: 'var(--color-rule)' }}
        >
          {hits.length === 0 ? (
            <div
              className="px-3 py-3 text-[12.5px]"
              style={{ color: 'var(--color-muted)' }}
            >
              찾는 이름이 없습니다. 한글 전통·개정 이름, 영문, 라틴어로 찾을 수
              있습니다.
            </div>
          ) : (
            hits.map(({ structure, locations }) => {
              const tissue = TISSUE[structure.kind]
              const isSelected = structure.id === selectedId

              /*
                한 구조가 여러 뷰에 있으면 전부 보여준다. 배측골간근은 발바닥
                4층이자 발등 3층인데, 어느 쪽으로 갈지는 사용자가 고를 일이다.
              */
              return (
                <div
                  key={structure.id}
                  className="border-b last:border-b-0"
                  style={{ borderColor: 'var(--color-rule)' }}
                >
                  {/* 이름을 누르면 가장 알맞은 자리로 — 지금 뷰, 없으면 같은 쪽 */}
                  <button
                    type="button"
                    onClick={() => {
                      const best = pickLocation(locations, view)
                      if (best) onPick(structure.id, best)
                    }}
                    className="flex w-full flex-wrap items-baseline gap-2 px-3 pt-2 text-left"
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
                      {structure.name.ko.classic}
                    </span>
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {structure.name.en}
                    </span>
                    <span
                      className="px-1 py-px font-mono text-[9.5px]"
                      style={{ background: tissue.fill, color: tissue.onFill }}
                    >
                      {tissue.label}
                    </span>
                  </button>

                  <div className="flex flex-wrap gap-1.5 px-3 pt-1.5 pb-2">
                    {locations.map((location) => (
                      <button
                        key={location.view.id}
                        type="button"
                        onClick={() => onPick(structure.id, location)}
                        className="border px-2 py-0.5 text-[11.5px]"
                        style={{
                          borderColor:
                            location.view.id === view.id
                              ? 'var(--color-accent)'
                              : 'var(--color-rule)',
                          color:
                            location.view.id === view.id
                              ? 'var(--color-accent)'
                              : 'var(--color-dim)',
                        }}
                      >
                        {locationLabel(location, view)}
                        {!location.reachable && (
                          <span
                            className="ml-1.5 font-mono text-[9.5px]"
                            style={{ color: 'var(--color-mark)' }}
                          >
                            도달 불가
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
