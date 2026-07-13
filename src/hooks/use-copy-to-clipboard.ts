"use client"

import { useCallback, useRef, useState } from "react"

/**
 * Copies text to the clipboard and briefly flips `copied` to true.
 * Extracted from the copy-state pattern in shadcn-studio/button/button-28.tsx.
 */
export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        if (timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(() => setCopied(false), resetMs)
      } catch (err) {
        console.error("Failed to copy text: ", err)
      }
    },
    [resetMs]
  )

  return { copied, copy }
}
