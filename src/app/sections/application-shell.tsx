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
        name: "Dashboard shell",
        description:
          "Sidebar navigation, a top bar with search and account menus, and a scrollable content area — composed from registry primitives.",
        preview: <ApplicationShellPreview />,
        source: dm("application-shell-demo"),
      },
    ],
};

export default content;
