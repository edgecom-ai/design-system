// Content for the "sheet" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const SheetDemo = React.lazy(() => import("@/components/demo/sheet-demo").then((m) => ({ default: m.SheetDemo })));

const content = {
  variants: [
      {
        id: "sheet-default",
        name: "Side panel",
        description: "A right-side sheet with a header, form fields, and footer actions.",
        preview: <SheetDemo />,
        source: dm("sheet-demo"),
      },
    ],
};

export default content;
