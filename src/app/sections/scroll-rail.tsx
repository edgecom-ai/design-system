// Content for the "scroll-rail" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const ScrollRailDemo = React.lazy(() => import("@/components/demo/scroll-rail-demo").then((m) => ({ default: m.ScrollRailDemo })));

const ScrollRailLoadingDemo = React.lazy(() => import("@/components/demo/scroll-rail-loading-demo").then((m) => ({ default: m.ScrollRailLoadingDemo })));

const ScrollRailEmptyDemo = React.lazy(() => import("@/components/demo/scroll-rail-empty-demo").then((m) => ({ default: m.ScrollRailEmptyDemo })));

const content = {
  variants: [
      {
        id: "scroll-rail-live",
        name: "Tile rail with paging arrows",
        description:
          "A fortnight of small-card tiles on a ScrollRail: the rail snaps by tile, pages by whole tiles with no edge fade, and carries the pill scrollbar in its foot. It bleeds 2px so no tile's ring is clipped by the scroll box. The arrows live in the host card's CardAction and each shows only while tiles are off screen on its side — useScrollRailEdges watches the first and last tile. The days of extreme UV take the destructive tint and the emphasis text.",
        preview: <ScrollRailDemo />,
        source: dm("scroll-rail-demo"),
      },
      {
        id: "scroll-rail-loading",
        name: "Loading",
        description:
          "The same rail with a Skeleton at each tile's shape, so the card is already the height of the answer and the tiles drop straight in.",
        preview: <ScrollRailLoadingDemo />,
        source: dm("scroll-rail-loading-demo"),
      },
      {
        id: "scroll-rail-empty",
        name: "Empty or error",
        description:
          "Nothing to show: the skeleton rail is held invisible under a centred muted body-text message, so the card keeps its height instead of collapsing. An error is the same holder with the error's message.",
        preview: <ScrollRailEmptyDemo />,
        source: dm("scroll-rail-empty-demo"),
      },
    ],
};

export default content;
