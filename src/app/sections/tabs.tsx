"use client"

// Content for the "tabs" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const AnimatedUnderlineTabsDemo = React.lazy(() => import("@/components/shadcn-studio/tabs/tabs-29"));

const AnimatedTabsDemo = React.lazy(() => import("@/components/shadcn-studio/tabs/tabs-27"));

const TabsDemo = React.lazy(() => import("@/components/demo/tabs-demo").then((m) => ({ default: m.TabsDemo })));

const TabsScrollableDemo = React.lazy(() => import("@/components/demo/tabs-scrollable-demo").then((m) => ({ default: m.TabsScrollableDemo })));

const TabsSurfacesDemo = React.lazy(() => import("@/components/demo/tabs-surfaces-demo").then((m) => ({ default: m.TabsSurfacesDemo })));

const content = {
  variants: [
      {
        id: "tabs-default",
        name: "Default",
        description: "Standard tabs — the active tab gets a raised surface.",
        preview: <TabsDemo />,
        source: dm("tabs-demo"),
      },
      {
        id: "tabs-scrollable",
        name: "Overflowing strip",
        description:
          "More tabs than the container fits — the list scrolls itself instead of widening the page, fades the edge that still hides a tab, and pulls a newly activated tab into view.",
        preview: <TabsScrollableDemo />,
        source: dm("tabs-scrollable-demo"),
      },
      {
        id: "tabs-surfaces",
        name: "On a tinted surface",
        description:
          "The default variant reads as a group by lightness alone — an absolute muted track with the active tab raised on it — so it needs a plain host: on a muted or secondary panel, a bg-muted/50 card footer, or (in dark) inside any overlay, the track lands on its own value and the strip disappears. The adaptive variant is the same strip in a second colour set whose track and thumb are an alpha over whatever is behind them, so the two steps survive any surface; line, which signals the active tab with a bar instead, needs no step at all.",
        preview: <TabsSurfacesDemo />,
        source: dm("tabs-surfaces-demo"),
      },
      {
        id: "tabs-animated-underline",
        name: "Animated underline",
        description:
          "TabsIndicator inside a line-variant TabsList — one bar slides to the active tab.",
        preview: <AnimatedUnderlineTabsDemo />,
        source: ss("tabs/tabs-29"),
      },
      {
        id: "tabs-motion",
        name: "Motion",
        description:
          "The separate motion-tabs item: a spring-animated highlight behind the active tab, with height-animated panels.",
        preview: <AnimatedTabsDemo />,
        source: ss("tabs/tabs-27"),
        install: "@edgecom/motion-tabs",
      },
    ],
};

export default content;
