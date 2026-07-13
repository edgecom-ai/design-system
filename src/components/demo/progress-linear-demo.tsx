import { Progress } from "@/components/ui/progress"

export function ProgressLinearDemo() {
  return (
    <div className="flex w-full flex-col gap-3 sm:max-w-sm">
      <Progress value={30} />
      <Progress value={66} />
    </div>
  )
}
