import { Fragment } from 'react'
import type { Provenance, Structure } from '@/types/anatomy.types'
import { TISSUE } from '@/data/tissue'

interface StructureDetailProps {
  structure: Structure
  provenance: Provenance
}

function metaRows(structure: Structure): Array<[string, string]> {
  if (structure.attachments) {
    return [
      ['부착 A', structure.attachments[0]],
      ['부착 B', structure.attachments[1]],
      ['작용', structure.action ?? '—'],
    ]
  }

  return [
    ['기시', structure.origin ?? '—'],
    ['정지', structure.insertion ?? '—'],
    ['작용', structure.action ?? '—'],
    ['신경', structure.nerve ?? '—'],
  ]
}

export function StructureDetail({
  structure,
  provenance,
}: StructureDetailProps) {
  const tissue = TISSUE[structure.kind]

  return (
    <section
      className="mb-7 border-t pt-6"
      style={{ borderColor: 'var(--color-rule)' }}
    >
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="serif text-2xl">{structure.name.ko.classic}</h2>
        <span
          className="px-1.5 py-0.5 font-mono text-[10px]"
          style={{ background: tissue.fill, color: tissue.onFill }}
        >
          {tissue.label}
        </span>
      </div>

      {structure.name.ko.revised && (
        <div className="text-[13px]" style={{ color: 'var(--color-dim)' }}>
          {structure.name.ko.revised}
        </div>
      )}
      <div
        className="mt-1 font-mono text-[12px]"
        style={{ color: 'var(--color-dim)' }}
      >
        {structure.name.en}
      </div>
      <div
        className="font-mono text-[11px] italic"
        style={{ color: 'var(--color-faint)' }}
      >
        {structure.name.la}
      </div>

      {/* 이 구조의 좌표가 어디서 왔는가 — 뷰가 아니라 구조 단위로 답한다 */}
      <div
        className="mt-2.5 inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10.5px]"
        style={{
          borderColor:
            provenance.fidelity === 'schematic'
              ? 'var(--color-rule)'
              : 'var(--color-accent)',
          color:
            provenance.fidelity === 'schematic'
              ? 'var(--color-muted)'
              : 'var(--color-accent)',
        }}
      >
        {provenance.fidelity === 'traced' && (
          <>트레이싱 · {provenance.source.ref}</>
        )}
        {/* 상대 위치만 옮겼다는 것을 배지에서부터 구분해 말한다 */}
        {provenance.fidelity === 'normalized' && (
          <>상대 위치 · {provenance.source.ref}</>
        )}
        {provenance.fidelity === 'schematic' && <>모식도 — 실측 근거 없음</>}
      </div>

      <dl className="mt-4 grid grid-cols-[70px_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-[13px] leading-relaxed">
        {metaRows(structure).map(([key, value]) => (
          <Fragment key={key}>
            <dt
              className="pt-0.5 font-mono text-[11px]"
              style={{ color: 'var(--color-muted)' }}
            >
              {key}
            </dt>
            <dd>{value}</dd>
          </Fragment>
        ))}
      </dl>

      {structure.notes && structure.notes.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {structure.notes.map((note) => (
            <li
              key={note}
              className="border-l-2 pl-3 text-[12.5px] leading-relaxed"
              style={{
                borderColor: 'var(--color-mark)',
                color: 'var(--color-dim)',
              }}
            >
              {note}
            </li>
          ))}
        </ul>
      )}

      {structure.commonIssues && structure.commonIssues.length > 0 && (
        <div className="mt-4">
          <div
            className="font-mono text-[10px] tracking-[0.16em] uppercase"
            style={{ color: 'var(--color-muted)' }}
          >
            흔히 함께 언급되는 것
          </div>
          <ul className="mt-1.5 space-y-1">
            {structure.commonIssues.map((issue) => (
              <li
                key={issue}
                className="text-[12.5px] leading-relaxed"
                style={{ color: 'var(--color-dim)' }}
              >
                {issue}
              </li>
            ))}
          </ul>
          <p
            className="mt-1.5 text-[11px]"
            style={{ color: 'var(--color-faint)' }}
          >
            참고 텍스트입니다. 이 도구는 원인을 판단하지 않습니다.
          </p>
        </div>
      )}
    </section>
  )
}
