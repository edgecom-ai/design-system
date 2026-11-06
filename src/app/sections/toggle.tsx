// Content for the "toggle" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip";
import { dm, ss } from "./shared";

const ToggleGroupToolbarDemo = React.lazy(() => import("@/components/demo/toggle-group-toolbar-demo").then((m) => ({ default: m.ToggleGroupToolbarDemo })));

const ToggleFilledIcon = React.lazy(() => import("@/components/shadcn-studio/toggle/toggle-05"));

const ToggleIconPattern = React.lazy(() => import("@/components/shadcn-studio/toggle/toggle-07"));

const ToggleGroupSizesDemo = React.lazy(() => import("@/components/demo/toggle-group-sizes-demo").then((m) => ({ default: m.ToggleGroupSizesDemo })));

const ToggleGroupLayout = React.lazy(() => import("@/components/shadcn-studio/toggle-group/toggle-group-08"));

const ToggleGroupRangeTooltipDemo = React.lazy(() => import("@/components/demo/toggle-group-range-tooltip-demo").then((m) => ({ default: m.ToggleGroupRangeTooltipDemo })));

const ToggleFormattingDemo = React.lazy(() => import("@/components/demo/toggle-formatting-demo").then((m) => ({ default: m.ToggleFormattingDemo })));

const TogglePageSurfaceDemo = React.lazy(() => import("@/components/demo/toggle-page-surface-demo").then((m) => ({ default: m.TogglePageSurfaceDemo })));

const content = {
  variants: [
      {
        id: "toggle-group-toolbar",
        name: "Toolbar: connected and spaced",
        description:
          "`layout` is the group's shape. `connected` joins the items into one strip with no frame — the chart header's range presets, the same height as the two-state toggle and the icon buttons beside it, and the default for an outline group. `spaced` sets ghost items a gap apart in a padded frame, for a formatting toolbar. A two-state switch (\"14-day forecast\") is an outline `Toggle`, never a `Button` swapping variants.",
        preview: (
          <TooltipProvider>
            <ToggleGroupToolbarDemo />
          </TooltipProvider>
        ),
        source: dm("toggle-group-toolbar-demo"),
      },
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
        id: "toggle-page-surface",
        name: "On the page body",
        description:
          "An outline toggle or a connected outline group straight on the shell's muted content area takes `surface=\"page\"`, so it rests and hovers like the outline button beside it. Inside a card it keeps `default`; the ghost `default` variant needs nothing either way.",
        preview: <TogglePageSurfaceDemo />,
        source: dm("toggle-page-surface-demo"),
      },
      {
        id: "toggle-group-sizes",
        name: "Group sizes",
        description: "A connected outline group shown across the size scale. Pick the size the rest of the toolbar is on.",
        preview: <ToggleGroupSizesDemo />,
        source: dm("toggle-group-sizes-demo"),
      },
      {
        id: "toggle-group-layout",
        name: "Group layout",
        description: "Icon-only items in a connected strip — a view switcher.",
        preview: <ToggleGroupLayout />,
        source: ss("toggle-group/toggle-group-08"),
      },
      {
        id: "toggle-group-tooltip",
        name: "Group with tooltips",
        description: "Range presets whose tooltips spell out the dates each one covers.",
        preview: (
          <TooltipProvider>
            <ToggleGroupRangeTooltipDemo />
          </TooltipProvider>
        ),
        source: dm("toggle-group-range-tooltip-demo"),
      },
    ],
};

export default content;
