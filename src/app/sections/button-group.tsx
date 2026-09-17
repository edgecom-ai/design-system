"use client"

// Content for the "button-group" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const ButtonGroupGhostDemo = React.lazy(() => import("@/components/shadcn-studio/button-group/button-group-12"));

const ButtonGroupDropdownDemo = React.lazy(() => import("@/components/shadcn-studio/button-group/button-group-11"));

const content = {
  variants: [
      {
        id: "button-group-ghost",
        name: "Ghost",
        description: "Joined ghost buttons forming a segmented control.",
        preview: <ButtonGroupGhostDemo />,
        source: ss("button-group/button-group-12"),
      },
      {
        id: "button-group-split-dropdown",
        name: "Split dropdown",
        description: "A primary action joined to a dropdown of alternatives.",
        preview: <ButtonGroupDropdownDemo />,
        source: ss("button-group/button-group-11"),
      },
    ],
};

export default content;
