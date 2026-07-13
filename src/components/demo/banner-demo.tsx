import { Banner, BannerContent } from "@/components/ui/banner"

export function BannerDemo() {
  return (
    <Banner>
      <BannerContent>
        <div className="flex w-full items-center gap-x-4 text-sm">
          <p className="flex-1 text-center">
            <a
              href="#"
              className="font-semibold underline-offset-4 hover:underline"
            >
              Introducing the AI CoPilot for energy insights
            </a>
            <span className="hidden sm:inline">
              {" "}
              — Ask questions about consumption, cost, and emissions.
            </span>
          </p>
        </div>
      </BannerContent>
    </Banner>
  )
}
