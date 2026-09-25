// Content for the "input-group" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const InputGroupDemo = React.lazy(() => import("@/components/demo/input-group-demo").then((m) => ({ default: m.InputGroupDemo })));

const content = {
  variants: [
      {
        id: "input-group-default",
        name: "Add-ons",
        description: "A leading icon, a trailing unit, and a trailing action button.",
        preview: <InputGroupDemo />,
        source: dm("input-group-demo"),
      },
    ],
};

export default content;
