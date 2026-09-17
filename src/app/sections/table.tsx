"use client"

// Content for the "table" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const TableDemo = React.lazy(() => import("@/components/demo/table-demo").then((m) => ({ default: m.TableDemo })));

const TableCompactDemo = React.lazy(() => import("@/components/demo/table-compact-demo").then((m) => ({ default: m.TableCompactDemo })));

const content = {
  variants: [
      {
        id: "table-basic",
        name: "Consumption by site",
        description: "Header, body rows, a caption, and right-aligned numeric cells.",
        preview: <TableDemo />,
        source: dm("table-demo"),
      },
      {
        id: "table-compact",
        name: "Compact density",
        description: "The `density=\"compact\"` prop tightens row padding for dense, text-heavy datasets.",
        preview: <TableCompactDemo />,
        source: dm("table-compact-demo"),
      },
    ],
};

export default content;
