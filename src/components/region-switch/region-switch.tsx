import type { Region } from '@/types/anatomy.types'

interface RegionSwitchProps {
  regions: Region[]
  regionId: string
  onChange: (regionId: string) => void
}

/*
  뷰 스위치와 나눠 둔 이유: 좌우·면 스위치는 "지금 이 뷰"를 고르지만 부위
  스위치는 뷰 묶음을 고른다. 무릎 뒤 뷰를 보고 있어도 활성 칩은 "무릎"이어야
  하므로 viewId로 판정할 수 없다.
*/
export function RegionSwitch({
  regions,
  regionId,
  onChange,
}: RegionSwitchProps) {
  return (
    <div
      className="flex w-fit border"
      style={{ borderColor: 'var(--color-rule)' }}
      role="group"
      aria-label="부위 전환"
    >
      {regions.map((region) => {
        const active = region.id === regionId

        return (
          <button
            key={region.id}
            type="button"
            onClick={() => onChange(region.id)}
            aria-pressed={active}
            className="px-3 py-1.5 text-[12px] transition-colors"
            style={{
              background: active ? 'var(--color-accent-wash)' : 'transparent',
              color: active ? 'var(--color-accent)' : 'var(--color-muted)',
            }}
          >
            {region.ko}
          </button>
        )
      })}
    </div>
  )
}
