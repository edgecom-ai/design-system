// Logo preview — the two lockups (combination wordmark and standalone mark),
// a height sweep, the flat-white artwork on a dark surface (driven by a `.dark`
// ancestor, as the primitive documents), and the mark in a collapsed rail.
import { Logo } from "@/components/ui/logo"

export function Combination() {
  return <Logo className="h-8 w-auto" />
}

export function Mark() {
  return <Logo variant="mark" className="h-8 w-auto" />
}

export function Sizes() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Logo className="h-5 w-auto" />
      <Logo className="h-8 w-auto" />
      <Logo className="h-12 w-auto" />
    </div>
  )
}

export function OnDark() {
  return (
    <div className="dark flex items-center gap-8 rounded-xl bg-background p-6">
      <Logo className="h-8 w-auto" />
      <Logo variant="mark" className="h-8 w-auto" />
    </div>
  )
}

export function InRail() {
  return (
    <div className="flex items-stretch gap-6">
      <div className="flex w-14 flex-col items-center gap-3 rounded-xl border border-border bg-sidebar py-3">
        <Logo variant="mark" className="h-7 w-auto" />
        <div className="h-px w-8 bg-border" />
        <div className="size-8 rounded-md bg-muted" />
        <div className="size-8 rounded-md bg-muted" />
        <div className="size-8 rounded-md bg-muted" />
      </div>
      <div className="flex w-56 flex-col gap-3 rounded-xl border border-border bg-sidebar px-3 py-3">
        <Logo className="h-7 w-auto" />
        <div className="h-px w-full bg-border" />
        <div className="h-8 w-full rounded-md bg-muted" />
        <div className="h-8 w-full rounded-md bg-muted" />
        <div className="h-8 w-full rounded-md bg-muted" />
      </div>
    </div>
  )
}
