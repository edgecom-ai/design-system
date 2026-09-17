"use client"

// Content for the "combobox" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const ComboboxDemo = React.lazy(() => import("@/components/shadcn-studio/combobox/combobox-01"));

const ComboboxOptionGroupDemo = React.lazy(() => import("@/components/shadcn-studio/combobox/combobox-02"));

const ComboboxWithSearchAndButtonDemo = React.lazy(() => import("@/components/shadcn-studio/combobox/combobox-06"));

const ComboboxMultipleExpandableDemo = React.lazy(() => import("@/components/shadcn-studio/combobox/combobox-11"));

const content = {
  variants: [
      {
        id: "combobox-default",
        name: "Default",
        description: "A searchable single-select combobox.",
        preview: (
          <div className="w-full max-w-xs">
            <ComboboxDemo />
          </div>
        ),
        source: ss("combobox/combobox-01"),
      },
      {
        id: "combobox-option-groups",
        name: "Option groups",
        description: "A combobox whose results are split into groups.",
        preview: <ComboboxOptionGroupDemo />,
        source: ss("combobox/combobox-02"),
      },
      {
        id: "combobox-search-add",
        name: "Search with add button",
        description: "A combobox that lets users create a new option.",
        preview: <ComboboxWithSearchAndButtonDemo />,
        source: ss("combobox/combobox-06"),
      },
      {
        id: "combobox-multiple",
        name: "Multiple (expandable chips)",
        description: "A multi-select combobox showing selections as chips.",
        preview: <ComboboxMultipleExpandableDemo />,
        source: ss("combobox/combobox-11"),
      },
    ],
};

export default content;
