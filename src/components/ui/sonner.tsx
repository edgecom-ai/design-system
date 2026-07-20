"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      richColors
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",

          // Rich-color variants, mapped to the design-system status tokens so
          // they stay on-brand and adapt to dark mode (richColors, above,
          // enables sonner's per-type styling that reads these).
          "--success-bg": "var(--success-subtle)",
          "--success-text": "var(--success-subtle-foreground)",
          "--success-border": "color-mix(in oklab, var(--success) 25%, transparent)",

          "--error-bg": "var(--destructive-subtle)",
          "--error-text": "var(--destructive-subtle-foreground)",
          "--error-border": "color-mix(in oklab, var(--destructive) 25%, transparent)",

          "--warning-bg": "var(--warning-subtle)",
          "--warning-text": "var(--warning-subtle-foreground)",
          "--warning-border": "color-mix(in oklab, var(--warning) 25%, transparent)",

          "--info-bg": "var(--info-subtle)",
          "--info-text": "var(--info-subtle-foreground)",
          "--info-border": "color-mix(in oklab, var(--info) 25%, transparent)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
