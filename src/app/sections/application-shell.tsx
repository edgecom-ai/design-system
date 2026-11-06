// Content for the "application-shell" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const ApplicationShellPreview = React.lazy(() => import("@/components/demo/application-shell-preview").then((m) => ({ default: m.ApplicationShellPreview })));

const content = {
  variants: [
      {
        id: "application-shell-dashboard",
        name: "Portal shell",
        description:
          "The one frame every app screen renders inside: pass the navigation, the active item, the user, the buildings, the page's breadcrumb as `heading`, and the page as children. The frame is bound to the viewport, so the top bar stays and the muted content area is the one scrollport; it already pads the page, which adds no padding and no max-width of its own. The rail collapses to icons, submenus become hover flyouts, and on a phone the rail becomes a sheet behind the toggle.",
        preview: <ApplicationShellPreview />,
        source: dm("application-shell-demo"),
      },
    ],
};

export default content;
