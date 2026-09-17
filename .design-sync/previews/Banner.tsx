// Banner preview — both variants via the docs demos, plus a dismissible
// default-variant announcement composed here. (BannerFloatingDemo is a
// hand-rolled floating div and does not render <Banner>, so it is skipped.)
import { Banner, BannerContent } from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

export { BannerDemo as Default } from "@/components/demo/banner-demo"
export { BannerActionDemo as PrimaryWithAction } from "@/components/demo/banner-action-demo"

export function Dismissible() {
  return (
    <Banner>
      <BannerContent>
        <div className="flex w-full items-center justify-between gap-x-4">
          <p className="text-sm leading-6">
            <strong className="font-semibold">Scheduled maintenance</strong>
            <span className="text-muted-foreground"> — Interval data for Ridgeway Utilities accounts may lag up to 2 hours on Saturday 20 September.</span>
          </p>
          <Button variant="ghost" size="icon-sm" aria-label="Dismiss">
            <XIcon />
          </Button>
        </div>
      </BannerContent>
    </Banner>
  )
}
