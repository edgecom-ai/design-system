// Content for the "table" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const TableDemo = React.lazy(() => import("@/components/demo/table-demo").then((m) => ({ default: m.TableDemo })));

const TableCompactDemo = React.lazy(() => import("@/components/demo/table-compact-demo").then((m) => ({ default: m.TableCompactDemo })));

const TableHeaderMutedDemo = React.lazy(() => import("@/components/demo/table-header-muted-demo").then((m) => ({ default: m.TableHeaderMutedDemo })));

const TableHeaderStrongDemo = React.lazy(() => import("@/components/demo/table-header-strong-demo").then((m) => ({ default: m.TableHeaderStrongDemo })));

const TablePinnedDemo = React.lazy(() => import("@/components/demo/table-pinned-demo").then((m) => ({ default: m.TablePinnedDemo })));

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
        description: "`variant=\"muted\"` on `TableHeader` fills the header row with `muted`, so it reads as a band above the body — for a table on `background` only. On a `card` it repeats the page surface; use `strong` there.",
        preview: <TableHeaderMutedDemo />,
        source: dm("table-header-muted-demo"),
      },
      {
        id: "table-header-strong",
        name: "Strong header",
        description: "`variant=\"strong\"` is the default header fill: a light band that steps from whatever the table sits on — a touch darker than the host in light, a touch lighter in dark. It holds on a `card`, a `muted` page or panel, and an overlay, where a `muted` header repeats or vanishes.",
        preview: <TableHeaderStrongDemo />,
        source: dm("table-header-strong-demo"),
      },
      {
        id: "table-pinned",
        name: "Pinned columns",
        description: "`pinned=\"left\"` / `pinned=\"right\"` on a head and its cells keeps the row's identity and its total in view while the twelve months scroll between them. The cells paint the host surface — `surface=\"card\"` on `Table` — under the row's own tint, and show a hairline divider only while columns are hidden past that edge.",
        preview: <TablePinnedDemo />,
        source: dm("table-pinned-demo"),
      },
    ],
};

export default content;
