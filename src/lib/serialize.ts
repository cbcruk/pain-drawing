import type {
  Pt,
  Shape,
  Structure,
  StructureInView,
  TraceSource,
  View,
} from '@/types/anatomy.types'

const round2 = (n: number): number => Math.round(n * 100) / 100

/** 저장 형식이 손으로 고칠 수 있어야 하므로 출력도 사람이 읽는 모양이어야 한다 */
function quote(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function pointList(points: Pt[]): string {
  return `[${points.map((p) => `[${round2(p[0])}, ${round2(p[1])}]`).join(', ')}]`
}

function numberList(values: number[]): string {
  return `[${values.map(round2).join(', ')}]`
}

function shapeToTs(shape: Shape, indent: string): string {
  if (shape.t === 'circle') {
    return [
      `${indent}{`,
      `${indent}  t: 'circle',`,
      `${indent}  c: [${round2(shape.c[0])}, ${round2(shape.c[1])}],`,
      `${indent}  r: ${round2(shape.r)},`,
      `${indent}},`,
    ].join('\n')
  }

  return [
    `${indent}{`,
    `${indent}  t: 'ribbon',`,
    `${indent}  p: ${pointList(shape.p)},`,
    `${indent}  w: ${numberList(shape.w)},`,
    `${indent}},`,
  ].join('\n')
}

function stringArray(values: string[], indent: string): string {
  const inline = `[${values.map(quote).join(', ')}]`
  if (inline.length + indent.length < 78) return inline

  return [
    '[',
    ...values.map((v) => `${indent}  ${quote(v)},`),
    `${indent}]`,
  ].join('\n')
}

export function structureToTs(structure: Structure): string {
  const lines = [`  {`, `    id: ${quote(structure.id)},`, `    name: {`]

  const ko = structure.name.ko.revised
    ? `{ classic: ${quote(structure.name.ko.classic)}, revised: ${quote(structure.name.ko.revised)} }`
    : `{ classic: ${quote(structure.name.ko.classic)} }`

  lines.push(
    `      ko: ${ko},`,
    `      en: ${quote(structure.name.en)},`,
    `      la: ${quote(structure.name.la)},`,
    `    },`,
    `    kind: ${quote(structure.kind)},`,
  )

  const optional: [string, string | undefined][] = [
    ['origin', structure.origin],
    ['insertion', structure.insertion],
    ['action', structure.action],
    ['nerve', structure.nerve],
    ['fmaId', structure.fmaId],
  ]

  for (const [key, value] of optional) {
    if (value) lines.push(`    ${key}: ${quote(value)},`)
  }

  if (structure.attachments) {
    const [a, b] = structure.attachments
    lines.push(`    attachments: [${quote(a)}, ${quote(b)}],`)
  }

  if (structure.notes?.length) {
    lines.push(`    notes: ${stringArray(structure.notes, '    ')},`)
  }

  if (structure.commonIssues?.length) {
    lines.push(`    commonIssues: ${stringArray(structure.commonIssues, '    ')},`)
  }

  lines.push(`  },`)

  return lines.join('\n')
}

function sourceToTs(source: TraceSource, indent: string): string[] {
  const lines = [
    `${indent}source: {`,
    `${indent}  ref: ${quote(source.ref)},`,
    `${indent}  license: ${quote(source.license)},`,
  ]

  if (source.tracedAt) lines.push(`${indent}  tracedAt: ${quote(source.tracedAt)},`)
  lines.push(`${indent}},`)

  return lines
}

export function placementToTs(placement: StructureInView): string {
  const provenance: string[] =
    placement.fidelity === 'traced'
      ? [`    fidelity: 'traced',`, ...sourceToTs(placement.source, '    ')]
      : placement.fidelity === 'schematic'
        ? [`    fidelity: 'schematic',`]
        : []

  return [
    `  {`,
    `    structureId: ${quote(placement.structureId)},`,
    `    viewId: ${quote(placement.viewId)},`,
    `    depth: ${placement.depth},`,
    `    reachable: ${placement.reachable},`,
    ...provenance,
    `    shapes: [`,
    ...placement.shapes.map((s) => shapeToTs(s, '      ')),
    `    ],`,
    `  },`,
  ].join('\n')
}

/** 뷰 자신의 기하(윤곽·뼈 참조)를 트레이싱했을 때만 갱신한다 */
export function viewProvenanceToTs(view: View): string {
  if (view.fidelity === 'schematic') return `  fidelity: 'schematic',`

  return [`  fidelity: 'traced',`, ...sourceToTs(view.source, '  ')].join('\n')
}

export function landmarksToTs(landmarks: Record<string, Pt>): string {
  const entries = Object.entries(landmarks).map(
    ([key, p]) => `    ${quote(key)}: [${round2(p[0])}, ${round2(p[1])}],`,
  )

  return [`  landmarks: {`, ...entries, `  },`].join('\n')
}

export interface ExportBundle {
  structures: Structure[]
  placements: StructureInView[]
}

/** structures.ts / placements.ts에 그대로 붙여넣는 형태 */
export function bundleToTs(bundle: ExportBundle): string {
  const blocks: string[] = []

  if (bundle.structures.length > 0) {
    blocks.push(
      `// → data/<region>/structures.ts`,
      bundle.structures.map(structureToTs).join('\n'),
    )
  }

  if (bundle.placements.length > 0) {
    blocks.push(
      `// → data/<region>/<view>/placements.ts`,
      bundle.placements.map(placementToTs).join('\n'),
    )
  }

  return blocks.join('\n\n')
}

export function bundleToJson(bundle: ExportBundle): string {
  const shapes = (list: Shape[]): Shape[] =>
    list.map((s) =>
      s.t === 'circle'
        ? { t: 'circle', c: [round2(s.c[0]), round2(s.c[1])], r: round2(s.r) }
        : {
            t: 'ribbon',
            p: s.p.map((p): Pt => [round2(p[0]), round2(p[1])]),
            w: s.w.map(round2),
          },
    )

  return JSON.stringify(
    {
      structures: bundle.structures,
      placements: bundle.placements.map((p) => ({ ...p, shapes: shapes(p.shapes) })),
    },
    null,
    2,
  )
}
