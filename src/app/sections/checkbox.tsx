// Content for the "checkbox" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const CheckboxDemo = React.lazy(() => import("@/components/shadcn-studio/checkbox/checkbox-01"));

const CheckboxDescriptionDemo = React.lazy(() => import("@/components/shadcn-studio/checkbox/checkbox-07"));

const CheckboxHorizontalGroupDemo = React.lazy(() => import("@/components/shadcn-studio/checkbox/checkbox-08"));

const CheckboxCardDemo = React.lazy(() => import("@/components/shadcn-studio/checkbox/checkbox-13"));

const CheckboxTreeDemo = React.lazy(() => import("@/components/shadcn-studio/checkbox/checkbox-15"));

const content = {
  variants: [
      {
        id: "checkbox-default",
        name: "Default",
        description: "A single checkbox with a label.",
        preview: <CheckboxDemo />,
        source: ss("checkbox/checkbox-01"),
      },
      {
        id: "checkbox-description",
        name: "With description",
        description: "A checkbox with supporting helper text.",
        preview: <CheckboxDescriptionDemo />,
        source: ss("checkbox/checkbox-07"),
      },
      {
        id: "checkbox-horizontal-group",
        name: "Horizontal group",
        description: "A row of related checkboxes.",
        preview: <CheckboxHorizontalGroupDemo />,
        source: ss("checkbox/checkbox-08"),
      },
      {
        id: "checkbox-cards",
        name: "Cards",
        description: "Selectable cards backed by checkboxes.",
        preview: (
          <div className="w-full max-w-md">
            <CheckboxCardDemo />
          </div>
        ),
        source: ss("checkbox/checkbox-13"),
      },
      {
        id: "checkbox-tree",
        name: "Tree (indeterminate)",
        description: "A nested checkbox tree with an indeterminate parent state.",
        preview: <CheckboxTreeDemo />,
        source: ss("checkbox/checkbox-15"),
      },
    ],
};

export default content;
