// Content for the "accordion" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const AccordionDemo = React.lazy(() => import("@/components/shadcn-studio/accordion/accordion-01"));

const AccordionOutlineDemo = React.lazy(() => import("@/components/shadcn-studio/accordion/accordion-09"));

const AccordionMultilevelIconDemo = React.lazy(() => import("@/components/shadcn-studio/accordion/accordion-16"));

const content = {
  variants: [
      {
        id: "accordion-default",
        name: "Default",
        description: "Single-open collapsible panels.",
        preview: (
          <div className="w-full max-w-md">
            <AccordionDemo />
          </div>
        ),
        source: ss("accordion/accordion-01"),
      },
      {
        id: "accordion-outline",
        name: "Outline",
        description: "Separated panels, each in its own bordered card.",
        preview: (
          <div className="w-full max-w-md">
            <AccordionOutlineDemo />
          </div>
        ),
        source: ss("accordion/accordion-09"),
      },
      {
        id: "accordion-multilevel",
        name: "Multi-level",
        description: "Category panels that expand to reveal nested, individually collapsible FAQ items.",
        preview: (
          <div className="w-full max-w-md">
            <AccordionMultilevelIconDemo />
          </div>
        ),
        source: ss("accordion/accordion-16"),
      },
    ],
};

export default content;
