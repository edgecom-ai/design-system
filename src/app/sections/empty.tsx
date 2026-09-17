"use client"

// Content for the "empty" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const EmptyDemo = React.lazy(() => import("@/components/demo/empty-demo").then((m) => ({ default: m.EmptyDemo })));

const EmptySearchDemo = React.lazy(() => import("@/components/demo/empty-search-demo").then((m) => ({ default: m.EmptySearchDemo })));

const EmptyTableDemo = React.lazy(() => import("@/components/demo/empty-table-demo").then((m) => ({ default: m.EmptyTableDemo })));

const content = {
  variants: [
      {
        id: "empty-default",
        name: "With action",
        description: "Icon, title, description, and a primary call to action.",
        preview: <EmptyDemo />,
        source: dm("empty-demo"),
      },
      {
        id: "empty-search",
        name: "No search results",
        description: "The zero-results state for a filtered or searched list.",
        preview: <EmptySearchDemo />,
        source: dm("empty-search-demo"),
      },
      {
        id: "empty-in-table",
        name: "In a data table",
        description:
          "Composed inside a table frame as its zero-state — the recommended pattern for data components.",
        preview: <EmptyTableDemo />,
        source: dm("empty-table-demo"),
      },
    ],
};

export default content;
