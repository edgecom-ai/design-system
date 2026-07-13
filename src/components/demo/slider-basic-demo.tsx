import { Slider } from "@/components/ui/slider"

export function SliderBasicDemo() {
  return (
    <div className="w-full sm:max-w-sm">
      <Slider defaultValue={40} />
    </div>
  )
}
