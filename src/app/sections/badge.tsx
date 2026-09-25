// Content for the "badge" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { Button } from "@/components/ui/button";
import { dm, ss } from "./shared";

const BadgeVariantsDemo = React.lazy(() => import("@/components/demo/badge-variants").then((m) => ({ default: m.BadgeVariantsDemo })));

const BadgeCommoditiesDemo = React.lazy(() => import("@/components/demo/badge-commodities").then((m) => ({ default: m.BadgeCommoditiesDemo })));

const BadgeClosableDemo = React.lazy(() => import("@/components/shadcn-studio/badge/badge-12"));

const BadgeInProgressDemo = React.lazy(() => import("@/components/shadcn-studio/badge/badge-16"));

const BadgeBlockedDemo = React.lazy(() => import("@/components/shadcn-studio/badge/badge-17"));

const BadgeCompletedDemo = React.lazy(() => import("@/components/shadcn-studio/badge/badge-18"));

const BadgeDotDemo = React.lazy(() => import("@/components/shadcn-studio/badge/badge-05"));

function ClosableBadgeDemo() {
  const [key, setKey] = React.useState(0);
  return (
    <div className="flex items-center gap-2">
      <BadgeClosableDemo key={key} />
      <Button size="sm" variant="ghost" onClick={() => setKey((k) => k + 1)}>
        Reset
      </Button>
    </div>
  );
}

const content = {
  variants: [
      {
        id: "badge-variants",
        name: "Variants",
        description: "Semantic tones for state and severity.",
        preview: <BadgeVariantsDemo />,
        source: dm("badge-variants"),
      },
      {
        id: "badge-commodities",
        name: "Commodities",
        description: "Per-commodity color coding used across dashboards.",
        preview: <BadgeCommoditiesDemo />,
        source: dm("badge-commodities"),
      },
      {
        id: "badge-dot",
        name: "Dot badge",
        description: "Minimal badge with a leading status dot.",
        preview: <BadgeDotDemo />,
        source: ss("badge/badge-05"),
      },
      {
        id: "badge-in-progress",
        name: "Status tag — in progress",
        description: "A tag indicating work that is underway.",
        preview: <BadgeInProgressDemo />,
        source: ss("badge/badge-16"),
      },
      {
        id: "badge-blocked",
        name: "Status tag — blocked",
        description: "A tag flagging an item that is blocked.",
        preview: <BadgeBlockedDemo />,
        source: ss("badge/badge-17"),
      },
      {
        id: "badge-completed",
        name: "Status tag — completed",
        description: "A tag confirming finished work.",
        preview: <BadgeCompletedDemo />,
        source: ss("badge/badge-18"),
      },
      {
        id: "badge-dismissible",
        name: "Dismissible",
        description: "A badge with a close button to remove it.",
        preview: <ClosableBadgeDemo />,
        source: ss("badge/badge-12"),
      },
    ],
};

export default content;
