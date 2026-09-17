"use client"

// Content for the "collapsible" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const CollapsibleTreeDemo = React.lazy(() => import("@/components/shadcn-studio/collapsible/collapsible-02"));

const CollapsibleCardDemo = React.lazy(() => import("@/components/shadcn-studio/collapsible/collapsible-07"));

const content = {
  variants: [
      {
        id: "collapsible-tree",
        name: "Site & meter tree",
        description: "Nested collapsible rows for browsing a site, building, and meter hierarchy.",
        preview: <CollapsibleTreeDemo />,
        source: ss("collapsible/collapsible-02"),
      },
      {
        id: "collapsible-card",
        name: "Card with expandable answer",
        description: "A card whose body expands to reveal a longer answer and image.",
        preview: (
          <div className="w-full max-w-md">
            <CollapsibleCardDemo />
          </div>
        ),
        source: ss("collapsible/collapsible-07"),
      },
    ],
};

export default content;
