"use client"

// Content for the "stepper" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const StepperInlineDescriptionDemo = React.lazy(() => import("@/components/shadcn-studio/stepper/stepper-05"));

const StepperHorizontalSubmitDemo = React.lazy(() => import("@/components/shadcn-studio/stepper/stepper-08"));

const StepperVerticalDemo = React.lazy(() => import("@/components/shadcn-studio/stepper/stepper-09"));

const content = {
  variants: [
      {
        id: "stepper-inline-descriptions",
        name: "Inline descriptions (responsive)",
        description: "A stepper with per-step descriptions that adapt to width.",
        preview: <StepperInlineDescriptionDemo />,
        source: ss("stepper/stepper-05"),
      },
      {
        id: "stepper-horizontal-submit",
        name: "Horizontal with panel + submit",
        description: "A horizontal stepper with content panels and a submit step.",
        preview: <StepperHorizontalSubmitDemo />,
        source: ss("stepper/stepper-08"),
      },
      {
        id: "stepper-vertical",
        name: "Vertical with panel",
        description: "A vertical stepper with content beneath each step.",
        preview: <StepperVerticalDemo />,
        source: ss("stepper/stepper-09"),
      },
    ],
};

export default content;
