"use client"

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
          "The one frame every portal screen renders inside: pass the navigation, the active item, the user and the buildings, and the page as children. The rail collapses to icons, submenus become hover flyouts, and on a phone the rail becomes a sheet behind the toggle.",
        preview: <ApplicationShellPreview />,
        source: dm("application-shell-demo"),
      },
    ],
};

export default content;
