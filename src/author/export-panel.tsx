import { useMemo, useState } from 'react'
import type { View } from '@/types/anatomy.types'
import { useCopy } from '@/hooks/use-copy'
import { bundleToJson, bundleToTs, viewProvenanceToTs } from '@/lib/serialize'
import { draftLabel, draftProblems, toPlacement, toStructure, type Draft } from './draft'
import { Button, Hint, Panel } from './ui'

interface ExportPanelProps {
  drafts: Draft[]
  view: View
  sourceRef: string
  sourceLicense: string
  sourceTracedAt: string
}

export function ExportPanel({
  drafts,
  view,
  sourceRef,
  sourceLicense,
  sourceTracedAt,
}: ExportPanelProps) {
  const [format, setFormat] = useState<'ts' | 'json'>('ts')
  const { copiedKey, copy } = useCopy()

  const { text, ready, blocked } = useMemo(() => {
    const ok = drafts.filter((d) => draftProblems(d).length === 0)
    const bad = drafts.filter((d) => draftProblems(d).length > 0)

    const bundle = {
      structures: ok.map(toStructure),
      placements: ok.map((d) => toPlacement(d, view.id)),
    }

    if (format === 'json') {
      return { text: bundleToJson(bundle), ready: ok, blocked: bad }
    }

    const blocks = [bundleToTs(bundle)]

    if (sourceRef.trim() && sourceLicense.trim()) {
      const traced: View = {
        ...view,
        fidelity: 'traced',
        source: {
          ref: sourceRef.trim(),
          license: sourceLicense.trim(),
          ...(sourceTracedAt.trim() ? { tracedAt: sourceTracedAt.trim() } : {}),
        },
      }

      blocks.push(`// → data/<region>/<view>/view.ts\n${viewProvenanceToTs(traced)}`)
    }

    return { text: blocks.filter(Boolean).join('\n\n'), ready: ok, blocked: bad }
  }, [drafts, view, format, sourceRef, sourceLicense, sourceTracedAt])

  return (
    <Panel
      title="4 · 내보내기"
      aside={
        <div className="flex gap-1.5">
          <Button onClick={() => setFormat('ts')} active={format === 'ts'}>
            TS
          </Button>
          <Button onClick={() => setFormat('json')} active={format === 'json'}>
            JSON
          </Button>
          <Button onClick={() => copy(text, 'out')} disabled={!text}>
            {copiedKey === 'out' ? '복사됨' : '복사'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="font-mono text-[11px]" style={{ color: 'var(--color-muted)' }}>
          완성 {ready.length} · 미완성 {blocked.length}
        </div>

        {blocked.length > 0 && (
          <ul className="flex flex-col gap-0.5">
            {blocked.map((draft) => (
              <li key={draft.key} className="text-[11.5px]" style={{ color: 'var(--color-mark)' }}>
                {draftLabel(draft)} — {draftProblems(draft).join(', ')}
              </li>
            ))}
          </ul>
        )}

        <pre
          className="max-h-80 overflow-auto p-3 font-mono text-[11px] leading-relaxed whitespace-pre"
          style={{ background: 'var(--color-well)', color: 'var(--color-ink)' }}
        >
          {text || '완성된 구조가 없습니다.'}
        </pre>

        <Hint>
          좌표는 중심선 + 폭으로 나갑니다. path 문자열이 아니라서 그대로
          손으로 고칠 수 있고 diff가 읽힙니다.
        </Hint>
      </div>
    </Panel>
  )
}
