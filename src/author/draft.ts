import type {
  Pt,
  Shape,
  Structure,
  StructureInView,
  StructureInViewBase,
  Tissue,
  TraceSource,
} from '@/types/anatomy.types'
import { usesAttachments } from '@/data/tissue'

/**
 * 편집 중 도형. circle도 p[0]/w[0]을 쓴다 — 선택·드래그 코드를 리본과
 * 공유하려는 것이고, 내보낼 때 스키마 형태로 되돌린다.
 */
export interface DraftShape {
  key: string
  t: 'ribbon' | 'circle'
  p: Pt[]
  w: number[]
  /**
   * 관절을 건너는 도형 — [출발 분절, 도착 분절].
   *
   * 화면에서는 출발 분절의 변환 아래에서 그린다. 첫 점이 출발 쪽 부착부,
   * 마지막 점이 도착 쪽 부착부다. **점 순서가 곧 방향이다.** 내보낼 때
   * 도착 쪽 끝이 그 뼈의 변환으로 옮겨가고 사이는 보간된다.
   */
  span?: [string, string]
}

/** 걸친 도형을 실제 좌표로 푸는 함수 — 정합 정보를 아는 쪽이 넘겨준다 */
export type SpanResolver = (points: Pt[], span: [string, string]) => Pt[]

/** 폼 입력은 전부 문자열로 들고 있다가 내보낼 때만 스키마로 좁힌다 */
export interface Draft {
  key: string
  structureId: string
  ko: string
  koRevised: string
  en: string
  la: string
  kind: Tissue
  origin: string
  insertion: string
  action: string
  nerve: string
  attachA: string
  attachB: string
  /** 근막일 때만 의미가 있다 — 관절낭처럼 방향 없는 근막인가 */
  anchored: boolean
  notes: string
  commonIssues: string
  fmaId: string
  depth: number
  reachable: boolean
  shapes: DraftShape[]
}

export const DEFAULT_WIDTH = 20

const newKey = (): string =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `k${Math.floor(performance.now() * 1000)}`

export function emptyShape(t: DraftShape['t'] = 'ribbon'): DraftShape {
  return { key: newKey(), t, p: [], w: [] }
}

export function emptyDraft(depth: number): Draft {
  return {
    key: newKey(),
    structureId: '',
    ko: '',
    koRevised: '',
    en: '',
    la: '',
    kind: 'muscle',
    origin: '',
    insertion: '',
    action: '',
    nerve: '',
    attachA: '',
    attachB: '',
    anchored: false,
    notes: '',
    commonIssues: '',
    fmaId: '',
    depth,
    reachable: true,
    shapes: [emptyShape()],
  }
}

const lines = (text: string): string[] =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

function toShape(shape: DraftShape, resolve?: SpanResolver): Shape | null {
  if (shape.t === 'circle') {
    const c = shape.p[0]
    if (!c) return null

    // 원은 점 하나라 두 분절에 걸칠 수 없다 — 걸치려면 길이가 있어야 한다
    return { t: 'circle', c, r: shape.w[0] ?? DEFAULT_WIDTH / 2 }
  }

  if (shape.p.length < 2) return null

  return {
    t: 'ribbon',
    p: shape.span && resolve ? resolve(shape.p, shape.span) : shape.p,
    w: shape.p.map((_, i) => shape.w[i] ?? DEFAULT_WIDTH),
  }
}

export function draftShapes(draft: Draft, resolve?: SpanResolver): Shape[] {
  return draft.shapes
    .map((s) => toShape(s, resolve))
    .filter((s): s is Shape => s !== null)
}

/**
 * 이 초안을 부착부 2개로 적을 것인가. 인대·연골은 스키마가 강제하고, 근막만
 * 저작자가 고른다 — 족저건막은 방향이 있고 관절낭은 없기 때문이다.
 */
export function draftIsAnchored(draft: Draft): boolean {
  return usesAttachments(draft.kind) || (draft.kind === 'fascia' && draft.anchored)
}

/** 내보낼 수 없는 이유들 — 비어 있으면 완성된 것이다 */
export function draftProblems(draft: Draft): string[] {
  const problems: string[] = []

  if (!draft.structureId.trim()) problems.push('id가 비어 있다')
  else if (!/^[a-z0-9-]+$/.test(draft.structureId.trim())) {
    problems.push('id는 소문자·숫자·하이픈만')
  }

  if (!draft.ko.trim()) problems.push('한글 이름이 비어 있다')
  if (!draft.en.trim()) problems.push('영문 이름이 비어 있다')
  if (!draft.la.trim()) problems.push('라틴어 이름이 비어 있다')
  if (draftShapes(draft).length === 0) {
    problems.push('도형이 없다 (리본은 점 2개 이상)')
  }

  // 부착부는 하나만 채우면 스키마가 성립하지 않는다 — 2개가 곧 형태다
  if (draftIsAnchored(draft) && !(draft.attachA.trim() && draft.attachB.trim())) {
    problems.push('부착부 2개를 모두 채워야 한다')
  }

  return problems
}

/** 조직 종류가 정하는 두 서술 형태 중 하나로 좁혀서 내보낸다 */
export function toStructure(draft: Draft): Structure {
  const common = {
    id: draft.structureId.trim(),
    name: {
      ko: draft.koRevised.trim()
        ? { classic: draft.ko.trim(), revised: draft.koRevised.trim() }
        : { classic: draft.ko.trim() },
      en: draft.en.trim(),
      la: draft.la.trim(),
    },
    ...optional({ action: draft.action, fmaId: draft.fmaId }),
    ...listed(draft),
  }

  const attachments: [string, string] = [
    draft.attachA.trim(),
    draft.attachB.trim(),
  ]
  const directional = optional({
    origin: draft.origin,
    insertion: draft.insertion,
    nerve: draft.nerve,
  })

  if (draft.kind === 'ligament' || draft.kind === 'cartilage') {
    return { ...common, kind: draft.kind, attachments }
  }

  if (draft.kind === 'fascia') {
    return draft.anchored
      ? { ...common, kind: 'fascia', attachments }
      : { ...common, kind: 'fascia', ...directional }
  }

  return { ...common, kind: draft.kind, ...directional }
}

function optional<K extends string>(
  fields: Record<K, string>,
): Partial<Record<K, string>> {
  const out: Partial<Record<K, string>> = {}

  for (const key of Object.keys(fields) as K[]) {
    const value = fields[key].trim()
    if (value) out[key] = value
  }

  return out
}

function listed(draft: Draft): {
  notes?: string[]
  commonIssues?: string[]
} {
  const notes = lines(draft.notes)
  const issues = lines(draft.commonIssues)

  return {
    ...(notes.length ? { notes } : {}),
    ...(issues.length ? { commonIssues: issues } : {}),
  }
}

/**
 * 출처가 있으면 그 구조만 traced로 표시한다. 뷰 전체가 아니라 지금 찍은
 * 구조에 대한 주장이므로, 층별로 나눠 트레이싱해도 데이터가 정직해진다.
 */
export function toPlacement(
  draft: Draft,
  viewId: string,
  source?: TraceSource,
  resolve?: SpanResolver,
): StructureInView {
  const base: StructureInViewBase = {
    structureId: draft.structureId.trim(),
    viewId,
    depth: draft.depth,
    reachable: draft.reachable,
    shapes: draftShapes(draft, resolve),
  }

  return source ? { ...base, fidelity: 'traced', source } : base
}

/** 기존 데이터를 편집하려고 되돌릴 때 */
export function fromExisting(
  structure: Structure,
  placement: StructureInView | undefined,
): Draft {
  return {
    key: newKey(),
    structureId: structure.id,
    ko: structure.name.ko.classic,
    koRevised: structure.name.ko.revised ?? '',
    en: structure.name.en,
    la: structure.name.la,
    kind: structure.kind,
    origin: structure.origin ?? '',
    insertion: structure.insertion ?? '',
    action: structure.action ?? '',
    nerve: structure.nerve ?? '',
    attachA: structure.attachments?.[0] ?? '',
    attachB: structure.attachments?.[1] ?? '',
    anchored: structure.attachments !== undefined,
    notes: (structure.notes ?? []).join('\n'),
    commonIssues: (structure.commonIssues ?? []).join('\n'),
    fmaId: structure.fmaId ?? '',
    depth: placement?.depth ?? 0,
    reachable: placement?.reachable ?? true,
    shapes: (placement?.shapes ?? []).map((s) =>
      s.t === 'circle'
        ? { key: newKey(), t: 'circle' as const, p: [s.c], w: [s.r] }
        : { key: newKey(), t: 'ribbon' as const, p: s.p, w: s.w },
    ),
  }
}

export function draftLabel(draft: Draft): string {
  return draft.ko.trim() || draft.structureId.trim() || '이름 없음'
}
