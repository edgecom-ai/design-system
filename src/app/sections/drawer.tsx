"use client"

// Content for the "drawer" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const DrawerWithSides = React.lazy(() => import("@/components/shadcn-studio/drawer/drawer-04"));

const content = {
  variants: [
      {
        id: "drawer-sides",
        name: "Swipe direction (top · right · bottom · left)",
        description: "A drawer that can open from any of the four edges.",
        preview: <DrawerWithSides />,
        source: ss("drawer/drawer-04"),
      },
    ],
};

export default content;
