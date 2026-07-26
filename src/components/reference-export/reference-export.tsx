import { useCopy } from '@/hooks/use-copy'

interface ReferenceExportProps {
  block: string
  url: string
}

function CopyButton({
  label,
  copied,
  onClick,
}: {
  label: string
  copied: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border px-2.5 py-1 font-mono text-[11px]"
      style={{
        borderColor: 'var(--color-accent)',
        color: copied ? 'var(--color-paper)' : 'var(--color-accent)',
        background: copied ? 'var(--color-accent)' : 'transparent',
      }}
    >
      {copied ? '복사됨' : label}
    </button>
  )
}

export function ReferenceExport({ block, url }: ReferenceExportProps) {
  const { copiedKey, copy } = useCopy()

  return (
    <section className="border-t pt-6" style={{ borderColor: 'var(--color-rule)' }}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div
          className="font-mono text-[10px] tracking-[0.16em] uppercase"
          style={{ color: 'var(--color-muted)' }}
        >
          내보내기
        </div>
        <div className="flex gap-1.5">
          <CopyButton
            label="URL"
            copied={copiedKey === 'url'}
            onClick={() => copy(url, 'url')}
          />
          <CopyButton
            label="블록 복사"
            copied={copiedKey === 'block'}
            onClick={() => copy(block, 'block')}
          />
        </div>
      </div>

      <pre
        className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed whitespace-pre"
        style={{ background: 'var(--color-well)', color: 'var(--color-ink)' }}
      >
        {block}
      </pre>

      <p
        className="mt-2 text-[11.5px] leading-relaxed"
        style={{ color: 'var(--color-muted)' }}
      >
        이 블록을 사람이나 LLM에게 그대로 넘기면 "엄지발가락 라인 발바닥 근육"
        같은 표현을 대체할 수 있습니다.
      </p>
    </section>
  )
}
