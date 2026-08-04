import type {
  Region,
  Structure,
  StructureInView,
  View,
} from '@/types/anatomy.types'
import { footStructures } from './foot/structures'
import { footPlantarLeftView, footPlantarView } from './foot/plantar/view'
import { footPlantarPlacements } from './foot/plantar/placements'
import { footDorsalLeftView, footDorsalView } from './foot/dorsal/view'
import { footDorsalPlacements } from './foot/dorsal/placements'
import { kneeStructures } from './knee/structures'
import { kneeAnteriorLeftView, kneeAnteriorView } from './knee/anterior/view'
import { kneeAnteriorPlacements } from './knee/anterior/placements'
import { kneePosteriorLeftView, kneePosteriorView } from './knee/posterior/view'
import { kneePosteriorPlacements } from './knee/posterior/placements'
import { normalize, scoreStructure } from '@/lib/search'
import { mirrorPlacements } from './mirror'

export const VIEWS: View[] = [
  footPlantarView,
  footPlantarLeftView,
  footDorsalView,
  footDorsalLeftView,
  kneeAnteriorView,
  kneeAnteriorLeftView,
  kneePosteriorView,
  kneePosteriorLeftView,
]

/*
  무릎은 **감춰 둔다**. M3의 목적은 `attachments` 스키마 검증이었고 그건
  끝났지만(옵셔널 필드라 아무것도 강제하지 않는다는 걸 찾아냈다), 부위 자체가
  이 도구의 전제와 맞지 않는다.

  전제는 "손가락의 대체재"다 — 눌러서 만져지는 것을 가리킨다. 발바닥은 층을
  파고들어도 그 전제가 유지된다. 눌린 힘이 건막에서 4층까지 실제로 전달된다.
  무릎은 아니다. 십자인대·반월판은 지목한 점 아래에 있는 게 맞지만 눌러도
  닿지 않는다. `reachable: false`가 각 항목에 붙긴 해도, 깊이 레일이라는 장치
  자체가 "계속 내려가 보라"고 권한다.

  데이터는 남긴다. 스키마 검증의 증거이고 URL로는 열린다.
*/
export const REGIONS: Region[] = [
  { id: 'foot', ko: '발', en: 'foot', defaultViewId: footPlantarView.id },
  {
    id: 'knee',
    ko: '무릎',
    en: 'knee',
    defaultViewId: kneeAnteriorView.id,
    hidden: true,
  },
]

/** 부위 전환에 실제로 나오는 것 */
export const VISIBLE_REGIONS: Region[] = REGIONS.filter((r) => !r.hidden)

/** 구조는 부위 단위로 모은다. 같은 구조가 여러 뷰에 나타나므로 뷰별로 쪼개지 않는다 */
export const STRUCTURES: Structure[] = [...footStructures, ...kneeStructures]

export const PLACEMENTS: StructureInView[] = [
  ...footPlantarPlacements,
  ...mirrorPlacements(footPlantarPlacements, footPlantarLeftView.id),
  ...footDorsalPlacements,
  ...mirrorPlacements(footDorsalPlacements, footDorsalLeftView.id),
  ...kneeAnteriorPlacements,
  ...mirrorPlacements(kneeAnteriorPlacements, kneeAnteriorLeftView.id),
  ...kneePosteriorPlacements,
  ...mirrorPlacements(kneePosteriorPlacements, kneePosteriorLeftView.id),
]

export const STRUCTURE_BY_ID: Map<string, Structure> = new Map(
  STRUCTURES.map((s) => [s.id, s]),
)

export function getView(viewId: string): View | undefined {
  return VIEWS.find((v) => v.id === viewId)
}

export function getPlacements(viewId: string): StructureInView[] {
  return PLACEMENTS.filter((p) => p.viewId === viewId)
}

const HIDDEN = new Set(REGIONS.filter((r) => r.hidden).map((r) => r.id))

/** 감춘 부위의 뷰는 역방향 조회에도 나오면 안 된다 — 화면에서 뺀 뜻이 없어진다 */
export function isViewVisible(view: View): boolean {
  return !HIDDEN.has(view.region)
}

/** 이 구조가 어느 뷰의 몇 층에 있는가 */
export interface StructureLocation {
  view: View
  depth: number
  reachable: boolean
}

export function getLocations(structureId: string): StructureLocation[] {
  const out: StructureLocation[] = []

  for (const placement of PLACEMENTS) {
    if (placement.structureId !== structureId) continue

    const view = getView(placement.viewId)
    if (!view || !isViewVisible(view)) continue

    out.push({ view, depth: placement.depth, reachable: placement.reachable })
  }

  return out
}

export interface SearchHit {
  structure: Structure
  locations: StructureLocation[]
}

/**
 * 이름 → 위치. probe의 반대 방향이다.
 *
 * 어디에도 놓이지 않은 구조는 결과에서 뺀다 — 이름은 있는데 짚어줄 자리가
 * 없으면 위치 도구로서 할 말이 없다.
 */
export function searchStructures(query: string, limit = 12): SearchHit[] {
  const needle = normalize(query)
  if (!needle) return []

  const scored: [number, SearchHit][] = []

  for (const structure of STRUCTURES) {
    const score = scoreStructure(needle, structure)
    if (score === null) continue

    const locations = getLocations(structure.id)
    if (locations.length === 0) continue

    scored.push([score, { structure, locations }])
  }

  return scored
    .sort((a, b) => b[0] - a[0])
    .slice(0, limit)
    .map(([, hit]) => hit)
}

/**
 * 이 구조를 보려면 어느 뷰로 가야 하는가. 지금 뷰에 있으면 그대로 두고,
 * 없으면 **같은 쪽(좌우)을 먼저** 찾는다 — 이름을 눌렀다고 반대쪽 발로
 * 건너뛰면 사용자가 보던 발이 바뀐다.
 */
export function pickLocation(
  locations: StructureLocation[],
  current: View,
): StructureLocation | undefined {
  return (
    locations.find((l) => l.view.id === current.id) ??
    locations.find(
      (l) => l.view.region === current.region && l.view.side === current.side,
    ) ??
    locations.find((l) => l.view.region === current.region) ??
    locations[0]
  )
}

/** 같은 부위·같은 면을 좌우로 본 뷰 — 오른쪽 ↔ 왼쪽 전환의 대상 */
export function getSideVariants(view: View): View[] {
  return VIEWS.filter(
    (v) => v.region === view.region && v.aspect === view.aspect,
  )
}

/** 같은 부위·같은 쪽을 다른 면에서 본 뷰 — 발바닥 ↔ 발등 전환의 대상 */
export function getAspectVariants(view: View): View[] {
  return VIEWS.filter((v) => v.region === view.region && v.side === view.side)
}

/**
 * 부위를 바꿀 때 들어갈 뷰. 그 부위의 기본 면으로 가되 **좌우는 유지한다** —
 * 왼발을 보다가 무릎으로 넘어가면 왼쪽 무릎이어야지 오른쪽일 이유가 없다.
 */
export function getRegionEntry(
  regionId: string,
  side: View['side'],
): View | undefined {
  const region = REGIONS.find((r) => r.id === regionId)
  if (!region) return undefined

  const fallback = getView(region.defaultViewId)
  if (!fallback) return undefined

  return (
    VIEWS.find(
      (v) =>
        v.region === regionId &&
        v.aspect === fallback.aspect &&
        v.side === side,
    ) ?? fallback
  )
}

export const DEFAULT_VIEW_ID = footPlantarView.id

/*
  뷰가 둘 이상이 되면 structureId 오타는 예외가 아니라 "조용히 안 그려지는"
  형태로 나타난다. 개발 중에만 확인하고 번들에는 남기지 않는다.

  옵셔널 체이닝인 이유: 이 모듈을 Vite 밖(스크립트·검사용 node)에서 불러올 때
  import.meta.env가 아예 없다. 데이터만 읽으러 온 호출자를 죽일 이유가 없다.
*/
if (import.meta.env?.DEV) {
  const problems: string[] = []

  const seenStructure = new Set<string>()
  for (const s of STRUCTURES) {
    if (seenStructure.has(s.id)) problems.push(`중복 structure id: ${s.id}`)
    seenStructure.add(s.id)
  }

  const seenView = new Set<string>()
  for (const v of VIEWS) {
    if (seenView.has(v.id)) problems.push(`중복 view id: ${v.id}`)
    seenView.add(v.id)
  }

  const regionIds = new Set(REGIONS.map((r) => r.id))
  for (const r of REGIONS) {
    if (!seenView.has(r.defaultViewId)) {
      problems.push(`없는 defaultViewId: ${r.id} → ${r.defaultViewId}`)
    }
  }
  for (const v of VIEWS) {
    // 부위 목록에 없는 뷰는 UI에서 도달할 수 없다 — 조용히 사라지는 실수다
    if (!regionIds.has(v.region)) {
      problems.push(`REGIONS에 없는 region: ${v.id} → ${v.region}`)
    }
  }

  const seenPlacement = new Set<string>()
  for (const p of PLACEMENTS) {
    const key = `${p.viewId}/${p.structureId}`

    if (!seenView.has(p.viewId)) problems.push(`없는 viewId 참조: ${key}`)
    if (!STRUCTURE_BY_ID.has(p.structureId)) {
      problems.push(`없는 structureId 참조: ${key}`)
    }
    if (seenPlacement.has(key)) problems.push(`중복 placement: ${key}`)
    seenPlacement.add(key)

    const view = getView(p.viewId)
    if (view && !view.layers.some((l) => l.depth === p.depth)) {
      problems.push(`뷰에 없는 depth: ${key} → L${p.depth}`)
    }
  }

  if (problems.length > 0) {
    console.error(`[data] 무결성 문제 ${problems.length}건\n` + problems.join('\n'))
  }
}
