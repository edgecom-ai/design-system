import { CategoryBar } from "@/components/ui/category-bar"

export function CategoryBarDemo() {
  return (
    <CategoryBar
      className="w-full max-w-md"
      values={[45, 25, 20, 10]}
      colors={["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"]}
      marker={{ value: 62 }}
    />
  )
}
