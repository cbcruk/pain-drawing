import { useCallback, useEffect, useRef, useState } from 'react'

interface UseCopyResult {
  copiedKey: string | null
  copy: (text: string, key: string) => void
}

export function useCopy(resetMs = 1600): UseCopyResult {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = useCallback(
    (text: string, key: string) => {
      if (!text) return

      const done = (): void => {
        setCopiedKey(key)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopiedKey(null), resetMs)
      }

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => {})

        return
      }

      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()

      try {
        document.execCommand('copy')
        done()
      } finally {
        document.body.removeChild(textarea)
      }
    },
    [resetMs],
  )

  return { copiedKey, copy }
}
