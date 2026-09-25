// Content for the "separator" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const SeparatorDemo = React.lazy(() => import("@/components/demo/separator-demo").then((m) => ({ default: m.SeparatorDemo })));

const content = {
  variants: [
      {
        id: "separator-default",
        name: "Default",
        description: "A horizontal rule between blocks, plus vertical rules in a row.",
        preview: <SeparatorDemo />,
        source: dm("separator-demo"),
      },
    ],
};

export default content;
