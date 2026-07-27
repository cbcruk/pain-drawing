import type { ReactNode } from 'react'

export function Panel({
  title,
  aside,
  children,
}: {
  title: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section
      className="border-t pt-4"
      style={{ borderColor: 'var(--color-rule)' }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2
          className="font-mono text-[10px] tracking-[0.16em] uppercase"
          style={{ color: 'var(--color-muted)' }}
        >
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function Button({
  children,
  onClick,
  active = false,
  disabled = false,
  title,
}: {
  children: ReactNode
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="border px-2.5 py-1 font-mono text-[11px] disabled:opacity-40"
      style={{
        borderColor: active ? 'var(--color-accent)' : 'var(--color-rule)',
        background: active ? 'var(--color-accent)' : 'transparent',
        color: active ? 'var(--color-paper)' : 'var(--color-dim)',
      }}
    >
      {children}
    </button>
  )
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  mono = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  mono?: boolean
}) {
  return (
    <label className="flex flex-col gap-1">
      <span
        className="font-mono text-[10px] tracking-[0.12em] uppercase"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`border px-2 py-1 text-[12.5px] ${mono ? 'font-mono' : ''}`}
        style={{
          borderColor: 'var(--color-rule)',
          background: 'var(--color-paper)',
          color: 'var(--color-ink)',
        }}
      />
    </label>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  rows = 2,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  rows?: number
}) {
  return (
    <label className="flex flex-col gap-1">
      <span
        className="font-mono text-[10px] tracking-[0.12em] uppercase"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
        {hint && <span className="normal-case"> · {hint}</span>}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="border px-2 py-1 text-[12.5px] leading-relaxed"
        style={{
          borderColor: 'var(--color-rule)',
          background: 'var(--color-paper)',
          color: 'var(--color-ink)',
        }}
      />
    </label>
  )
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[11.5px] leading-relaxed"
      style={{ color: 'var(--color-muted)' }}
    >
      {children}
    </p>
  )
}
