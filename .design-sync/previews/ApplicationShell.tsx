// ApplicationShell preview — the docs site's own demo: the portal frame around
// a page, fed from data. Rendered as a single wide card (see cfg.overrides), so
// the frame fills the card's viewport instead of stopping at the page's height.
import { ApplicationShellDemo } from "@/components/demo/application-shell-demo"

export function Default() {
  return <ApplicationShellDemo className="h-svh w-full" />
}
