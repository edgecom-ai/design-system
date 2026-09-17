"use client"

// Content for the "toggle" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip";
import { dm, ss } from "./shared";

const ToggleFilledIcon = React.lazy(() => import("@/components/shadcn-studio/toggle/toggle-05"));

const ToggleIconPattern = React.lazy(() => import("@/components/shadcn-studio/toggle/toggle-07"));

const ToggleGroupSizes = React.lazy(() => import("@/components/shadcn-studio/toggle-group/toggle-group-03"));

const ToggleGroupLayout = React.lazy(() => import("@/components/shadcn-studio/toggle-group/toggle-group-08"));

const ToggleGroupTooltip = React.lazy(() => import("@/components/shadcn-studio/toggle-group/toggle-group-09"));

const ToggleFormattingDemo = React.lazy(() => import("@/components/demo/toggle-formatting-demo").then((m) => ({ default: m.ToggleFormattingDemo })));

const content = {
  variants: [
      {
        id: "toggle-formatting",
        name: "Formatting toolbar",
        description: "Text-formatting toggles for bold, italic, and alignment.",
        preview: <ToggleFormattingDemo />,
        source: dm("toggle-formatting-demo"),
      },
      {
        id: "toggle-filled-icon",
        name: "Filled icon",
        description: "An icon toggle that fills when pressed.",
        preview: <ToggleFilledIcon />,
        source: ss("toggle/toggle-05"),
      },
      {
        id: "toggle-icon-pattern",
        name: "Icon pattern",
        description: "A recommended icon-plus-label toggle pattern.",
        preview: <ToggleIconPattern />,
        source: ss("toggle/toggle-07"),
      },
      {
        id: "toggle-group-sizes",
        name: "Group sizes",
        description: "A toggle group shown across the size scale.",
        preview: <ToggleGroupSizes />,
        source: ss("toggle-group/toggle-group-03"),
      },
      {
        id: "toggle-group-layout",
        name: "Group layout",
        description: "Horizontal and vertical toggle group arrangements.",
        preview: <ToggleGroupLayout />,
        source: ss("toggle-group/toggle-group-08"),
      },
      {
        id: "toggle-group-tooltip",
        name: "Group with tooltips",
        description: "A toggle group where each option has a tooltip.",
        preview: (
          <TooltipProvider>
            <ToggleGroupTooltip />
          </TooltipProvider>
        ),
        source: ss("toggle-group/toggle-group-09"),
      },
    ],
};

export default content;
