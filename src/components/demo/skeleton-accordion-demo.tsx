import { Skeleton } from "@/components/ui/skeleton"

// Alarm rules grouped by site, while they load: the accordion's rows drawn
// without the accordion. A placeholder is not a control, so there is nothing
// to expand yet — the first group shows its body open, the way the loaded
// list opens its first group. Row padding and dividers match AccordionItem.
const groups = ["w-40", "w-52", "w-36", "w-44"]

export function SkeletonAccordionDemo() {
  return (
    <div className="flex w-full flex-col" aria-busy="true">
      <span className="sr-only">Loading alarm rules</span>
      {groups.map((width, i) => (
        <div key={i} className="flex flex-col gap-2.5 py-2.5 not-last:border-b">
          <div className="flex h-5 items-center justify-between gap-4">
            <Skeleton className={`h-4 ${width}`} />
            <Skeleton className="size-4 rounded-sm" />
          </div>
          {i === 0 && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
