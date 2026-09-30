// Content for the "stepper" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const StepperEnrollmentDemo = React.lazy(() => import("@/components/demo/stepper-enrollment-demo").then((m) => ({ default: m.StepperEnrollmentDemo })));

const StepperHorizontalSubmitDemo = React.lazy(() => import("@/components/shadcn-studio/stepper/stepper-08"));

const StepperVerticalDemo = React.lazy(() => import("@/components/shadcn-studio/stepper/stepper-09"));

const content = {
  variants: [
      {
        id: "stepper-inline-descriptions",
        name: "Inline descriptions (responsive)",
        description: "A stepper with a description under each title — a row from md up, stacked below it with `responsive`.",
        preview: <StepperEnrollmentDemo />,
        source: dm("stepper-enrollment-demo"),
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
