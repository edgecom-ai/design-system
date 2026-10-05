// Content for the "table" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const TableDemo = React.lazy(() => import("@/components/demo/table-demo").then((m) => ({ default: m.TableDemo })));

const TableCompactDemo = React.lazy(() => import("@/components/demo/table-compact-demo").then((m) => ({ default: m.TableCompactDemo })));

const TableHeaderMutedDemo = React.lazy(() => import("@/components/demo/table-header-muted-demo").then((m) => ({ default: m.TableHeaderMutedDemo })));

const TableHeaderStrongDemo = React.lazy(() => import("@/components/demo/table-header-strong-demo").then((m) => ({ default: m.TableHeaderStrongDemo })));

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
      {
        id: "table-header-muted",
        name: "Muted header",
        description: "`variant=\"muted\"` on `TableHeader` fills the header row with `muted`, so it reads as a band above the body — for a table on `background` or `card`.",
        preview: <TableHeaderMutedDemo />,
        source: dm("table-header-muted-demo"),
      },
      {
        id: "table-header-strong",
        name: "Strong header",
        description: "`variant=\"strong\"` is a deeper band that steps from whatever the table sits on — darker on white or on a `muted` page in light, lighter on any surface in dark. Use it where a `muted` header would vanish: a `muted` page or panel, or an overlay in dark.",
        preview: <TableHeaderStrongDemo />,
        source: dm("table-header-strong-demo"),
      },
    ],
};

export default content;
