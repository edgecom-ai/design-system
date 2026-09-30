// Content for the "multi-select" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const MultipleSelectWithPlaceholderDemo = React.lazy(() => import("@/components/shadcn-studio/select/select-33"));

const MultiSelectPreselectedDemo = React.lazy(() => import("@/components/demo/multi-select-preset-demo").then((m) => ({ default: m.MultiSelectPresetDemo })));

const MultiSelectDemo = React.lazy(() => import("@/components/demo/multi-select-demo").then((m) => ({ default: m.MultiSelectDemo })));

const MultiSelectFixedDemo = React.lazy(() => import("@/components/demo/multi-select-fixed-demo").then((m) => ({ default: m.MultiSelectFixedDemo })));

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
        description: "The same selector opening with values already chosen, with its options grouped by region.",
        preview: <MultiSelectPreselectedDemo />,
        source: dm("multi-select-preset-demo"),
      },
      {
        id: "multi-select-fixed",
        name: "Locked selections",
        description: "An option marked as fixed stays selected: its chip has no remove button, and neither Backspace nor Clear all takes it out.",
        preview: <MultiSelectFixedDemo />,
        source: dm("multi-select-fixed-demo"),
      },
    ],
};

export default content;
