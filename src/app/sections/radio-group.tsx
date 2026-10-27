// Content for the "radio-group" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const CheckboxSurfacesDemo = React.lazy(() => import("@/components/demo/checkbox-surfaces-demo").then((m) => ({ default: m.CheckboxSurfacesDemo })));

const RadioGroupDemo = React.lazy(() => import("@/components/shadcn-studio/radio-group/radio-group-01"));

const RadioGroupHorizontalDemo = React.lazy(() => import("@/components/shadcn-studio/radio-group/radio-group-02"));

const RadioGroupCardRadioDemo = React.lazy(() => import("@/components/shadcn-studio/radio-group/radio-group-11"));

const RadioGroupCardVerticalRadioDemo = React.lazy(() => import("@/components/shadcn-studio/radio-group/radio-group-13"));

const content = {
  variants: [
      {
        id: "radio-group-default",
        name: "Default (vertical)",
        description: "A vertical stack of radio options.",
        preview: <RadioGroupDemo />,
        source: ss("radio-group/radio-group-01"),
      },
      {
        id: "radio-group-horizontal",
        name: "Horizontal",
        description: "Radio options laid out in a row.",
        preview: <RadioGroupHorizontalDemo />,
        source: ss("radio-group/radio-group-02"),
      },
      {
        id: "radio-group-surfaces",
        name: "On every surface",
        description:
          "An unselected item rests on the same opaque face as a checkbox — `outline-surface` — so its ring stays visible straight on the muted page body and beside the boxes on a tinted row. Nothing here sets a surface.",
        preview: <CheckboxSurfacesDemo />,
        source: dm("checkbox-surfaces-demo"),
      },
      {
        id: "radio-group-cards",
        name: "Cards",
        description: "Radio options rendered as selectable cards.",
        preview: <RadioGroupCardRadioDemo />,
        source: ss("radio-group/radio-group-11"),
      },
      {
        id: "radio-group-cards-vertical",
        name: "Cards (vertical, with icons)",
        description: "Stacked card options each led by an icon.",
        preview: <RadioGroupCardVerticalRadioDemo />,
        source: ss("radio-group/radio-group-13"),
      },
    ],
};

export default content;
