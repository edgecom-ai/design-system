import { Skeleton } from "@/components/ui/skeleton"

// A monthly report summary while it loads: a title, a meta line, then two
// paragraphs. Each paragraph's last line runs short, so the block reads as
// prose rather than as a stack of bars.
const paragraphs = [
  ["w-full", "w-full", "w-4/5"],
  ["w-full", "w-11/12", "w-1/2"],
]

export function SkeletonTextDemo() {
  return (
    <div className="flex w-full flex-col gap-5 sm:max-w-sm" aria-busy="true">
      <span className="sr-only">Loading the report summary</span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      {paragraphs.map((lines, p) => (
        <div key={p} className="flex flex-col gap-2">
          {lines.map((width, i) => (
            <Skeleton key={i} className={`h-4 ${width}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
