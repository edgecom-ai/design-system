import { Banner, BannerContent } from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

export function BannerActionDemo() {
  return (
    <Banner variant="primary">
      <BannerContent>
        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-sm leading-6">
            <strong className="font-semibold">Demand-response season is here</strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline size-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            Enroll your sites now to earn peak-demand savings this summer.
          </p>
          <Button size="sm" variant="secondary">
            Enroll sites
            <ArrowRightIcon />
          </Button>
        </div>
      </BannerContent>
    </Banner>
  )
}
