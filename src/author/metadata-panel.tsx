import type { Tissue, View } from '@/types/anatomy.types'
import { TISSUE, usesAttachments } from '@/data/tissue'
import type { Draft } from './draft'
import { draftIsAnchored } from './draft'
import { Field, Hint, Panel, TextArea } from './ui'

interface MetadataPanelProps {
  draft: Draft | null
  view: View
  onChange: (patch: Partial<Draft>) => void
}

const TISSUE_KEYS = Object.keys(TISSUE) as Tissue[]

const selectStyle = {
  borderColor: 'var(--color-rule)',
  background: 'var(--color-paper)',
  color: 'var(--color-ink)',
}

export function MetadataPanel({ draft, view, onChange }: MetadataPanelProps) {
  if (!draft) {
    return (
      <Panel title="3 · 메타데이터">
        <Hint>구조를 먼저 만들거나 선택하세요.</Hint>
      </Panel>
    )
  }

  const anchored = draftIsAnchored(draft)
  const forced = usesAttachments(draft.kind)

  return (
    <Panel title="3 · 메타데이터">
      <div className="flex flex-col gap-2.5">
        <Field
          label="id"
          value={draft.structureId}
          onChange={(structureId) => onChange({ structureId })}
          placeholder="extensor-digitorum-brevis"
          mono
        />

        <div className="grid grid-cols-2 gap-2">
          <Field
            label="한글 (전통)"
            value={draft.ko}
            onChange={(ko) => onChange({ ko })}
            placeholder="단지신근"
          />
          <Field
            label="한글 (개정)"
            value={draft.koRevised}
            onChange={(koRevised) => onChange({ koRevised })}
            placeholder="짧은발가락폄근"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field
            label="영문"
            value={draft.en}
            onChange={(en) => onChange({ en })}
            placeholder="extensor digitorum brevis"
          />
          <Field
            label="라틴어"
            value={draft.la}
            onChange={(la) => onChange({ la })}
            placeholder="musculus extensor..."
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <label className="flex flex-col gap-1">
            <span
              className="font-mono text-[10px] tracking-[0.12em] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              조직
            </span>
            <select
              value={draft.kind}
              onChange={(event) =>
                onChange({ kind: event.target.value as Tissue })
              }
              className="border px-2 py-1 text-[12.5px]"
              style={selectStyle}
            >
              {TISSUE_KEYS.map((kind) => (
                <option key={kind} value={kind}>
                  {TISSUE[kind].label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span
              className="font-mono text-[10px] tracking-[0.12em] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              층
            </span>
            <select
              value={draft.depth}
              onChange={(event) => onChange({ depth: Number(event.target.value) })}
              className="border px-2 py-1 text-[12.5px]"
              style={selectStyle}
            >
              {view.layers.map((layer) => (
                <option key={layer.depth} value={layer.depth}>
                  L{layer.depth} · {layer.ko}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span
              className="font-mono text-[10px] tracking-[0.12em] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              도달 가능
            </span>
            <div className="flex h-[30px] items-center">
              <input
                type="checkbox"
                checked={draft.reachable}
                onChange={(event) => onChange({ reachable: event.target.checked })}
              />
              <span
                className="ml-2 text-[12px]"
                style={{ color: 'var(--color-dim)' }}
              >
                {draft.reachable ? '표면에서 도달' : '도달 불가'}
              </span>
            </div>
          </label>
        </div>

        {/*
          근막만 저작자가 고른다. 족저건막은 종골에서 나와 발가락으로 퍼지므로
          방향이 있고, 관절낭은 관절을 둘러 걸쳐 있을 뿐이라 없다.
        */}
        {draft.kind === 'fascia' && (
          <label className="flex items-center gap-2 text-[12px]">
            <input
              type="checkbox"
              checked={draft.anchored}
              onChange={(event) => onChange({ anchored: event.target.checked })}
            />
            <span style={{ color: 'var(--color-dim)' }}>
              방향 없는 근막 (관절낭처럼 부착부 2개로 적는다)
            </span>
          </label>
        )}

        {anchored ? (
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="부착부 A"
              value={draft.attachA}
              onChange={(attachA) => onChange({ attachA })}
            />
            <Field
              label="부착부 B"
              value={draft.attachB}
              onChange={(attachB) => onChange({ attachB })}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="기시"
                value={draft.origin}
                onChange={(origin) => onChange({ origin })}
              />
              <Field
                label="정지"
                value={draft.insertion}
                onChange={(insertion) => onChange({ insertion })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="작용"
                value={draft.action}
                onChange={(action) => onChange({ action })}
              />
              <Field
                label="신경"
                value={draft.nerve}
                onChange={(nerve) => onChange({ nerve })}
              />
            </div>
          </>
        )}

        {anchored && (
          <Hint>
            {forced
              ? '인대·연골은 기시/정지가 아니라 부착부 2개를 씁니다. 스키마가 다르고, 타입이 강제합니다.'
              : '부착부 2개로 내보냅니다. 순서에 뜻은 없고, 부착 대상이 뼈가 아니어도 됩니다.'}
          </Hint>
        )}

        <TextArea
          label="메모"
          hint="한 줄에 하나"
          value={draft.notes}
          onChange={(notes) => onChange({ notes })}
        />
        <TextArea
          label="흔히 언급되는 문제"
          hint="참고용, 진단 아님"
          value={draft.commonIssues}
          onChange={(commonIssues) => onChange({ commonIssues })}
        />
        <Field
          label="FMA id"
          value={draft.fmaId}
          onChange={(fmaId) => onChange({ fmaId })}
          mono
        />
      </div>
    </Panel>
  )
}
