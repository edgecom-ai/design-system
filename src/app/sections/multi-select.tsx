// Content for the "multi-select" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const MultipleSelectWithPlaceholderDemo = React.lazy(() => import("@/components/shadcn-studio/select/select-33"));

const MultiSelectPreselectedDemo = React.lazy(() => import("@/components/shadcn-studio/select/select-32"));

const MultiSelectDemo = React.lazy(() => import("@/components/demo/multi-select-demo").then((m) => ({ default: m.MultiSelectDemo })));

const content = {
  variants: [
      {
        id: "multi-select-listbox",
        name: "Listbox",
        description: "A trigger plus a searchable checkbox listbox with Select all / Clear — the control chart toolbars use to pick which device series to plot.",
        preview: <MultiSelectDemo />,
        source: dm("multi-select-demo"),
      },
      {
        id: "multi-select-tags",
        name: "Tags with placeholder",
        description: "The tag-style selector: chosen values stay in the field as removable chips.",
        preview: <MultipleSelectWithPlaceholderDemo />,
        source: ss("select/select-33"),
      },
      {
        id: "multi-select-preselected",
        name: "Tags with preset values",
        description: "The same selector opening with values already chosen.",
        preview: <MultiSelectPreselectedDemo />,
        source: ss("select/select-32"),
      },
    ],
};

export default content;
