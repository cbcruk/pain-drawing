import type {
  Pt,
  Shape,
  Structure,
  StructureInView,
  StructureInViewBase,
  Tissue,
  TraceSource,
} from '@/types/anatomy.types'

/**
 * 편집 중 도형. circle도 p[0]/w[0]을 쓴다 — 선택·드래그 코드를 리본과
 * 공유하려는 것이고, 내보낼 때 스키마 형태로 되돌린다.
 */
export interface DraftShape {
  key: string
  t: 'ribbon' | 'circle'
  p: Pt[]
  w: number[]
}

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

function toShape(shape: DraftShape): Shape | null {
  if (shape.t === 'circle') {
    const c = shape.p[0]
    if (!c) return null

    return { t: 'circle', c, r: shape.w[0] ?? DEFAULT_WIDTH / 2 }
  }

  if (shape.p.length < 2) return null

  return {
    t: 'ribbon',
    p: shape.p,
    w: shape.p.map((_, i) => shape.w[i] ?? DEFAULT_WIDTH),
  }
}

export function draftShapes(draft: Draft): Shape[] {
  return draft.shapes.map(toShape).filter((s): s is Shape => s !== null)
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

  return problems
}

export function toStructure(draft: Draft): Structure {
  const structure: Structure = {
    id: draft.structureId.trim(),
    name: {
      ko: draft.koRevised.trim()
        ? { classic: draft.ko.trim(), revised: draft.koRevised.trim() }
        : { classic: draft.ko.trim() },
      en: draft.en.trim(),
      la: draft.la.trim(),
    },
    kind: draft.kind,
  }

  if (draft.origin.trim()) structure.origin = draft.origin.trim()
  if (draft.insertion.trim()) structure.insertion = draft.insertion.trim()
  if (draft.action.trim()) structure.action = draft.action.trim()
  if (draft.nerve.trim()) structure.nerve = draft.nerve.trim()
  if (draft.fmaId.trim()) structure.fmaId = draft.fmaId.trim()

  if (draft.attachA.trim() && draft.attachB.trim()) {
    structure.attachments = [draft.attachA.trim(), draft.attachB.trim()]
  }

  const notes = lines(draft.notes)
  if (notes.length) structure.notes = notes

  const issues = lines(draft.commonIssues)
  if (issues.length) structure.commonIssues = issues

  return structure
}

/**
 * 출처가 있으면 그 구조만 traced로 표시한다. 뷰 전체가 아니라 지금 찍은
 * 구조에 대한 주장이므로, 층별로 나눠 트레이싱해도 데이터가 정직해진다.
 */
export function toPlacement(
  draft: Draft,
  viewId: string,
  source?: TraceSource,
): StructureInView {
  const base: StructureInViewBase = {
    structureId: draft.structureId.trim(),
    viewId,
    depth: draft.depth,
    reachable: draft.reachable,
    shapes: draftShapes(draft),
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
