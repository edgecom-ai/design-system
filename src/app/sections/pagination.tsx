// Content for the "pagination" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const PaginationDemo = React.lazy(() => import("@/components/demo/pagination-demo").then((m) => ({ default: m.PaginationDemo })));

const PaginationBoundaryDemo = React.lazy(() => import("@/components/demo/pagination-boundary-demo").then((m) => ({ default: m.PaginationBoundaryDemo })));

const content = {
  variants: [
      {
        id: "pagination-basic",
        name: "Basic",
        description: "Previous / next controls with page numbers and an ellipsis.",
        preview: <PaginationDemo />,
        source: dm("pagination-demo"),
      },
      {
        id: "pagination-boundary",
        name: "At a boundary",
        description:
          "First page — Previous is disabled, so it reads as unavailable and can't be clicked or tabbed to.",
        preview: <PaginationBoundaryDemo />,
        source: dm("pagination-boundary-demo"),
      },
    ],
};

export default content;
