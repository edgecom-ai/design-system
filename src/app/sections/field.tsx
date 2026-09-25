// Content for the "field" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const FieldDemo = React.lazy(() => import("@/components/demo/field-demo").then((m) => ({ default: m.FieldDemo })));

const content = {
  variants: [
      {
        id: "field-default",
        name: "Labelled fields",
        description: "Fields with labels, helper text, and an error state.",
        preview: <FieldDemo />,
        source: dm("field-demo"),
      },
    ],
};

export default content;
