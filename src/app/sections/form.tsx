// Content for the "form" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const FormLayoutPersonalInfo = React.lazy(() => import("@/components/shadcn-studio/blocks/form-layout-01/form-layout-01"));

const FormValidatedTanstack = React.lazy(() => import("@/components/shadcn-studio/blocks/form-validated/form-validated"));

const FormLayoutOnboardingWizard = React.lazy(() => import("@/components/shadcn-studio/blocks/form-layout-09/form-layout-09"));

const content = {
  variants: [
      {
        id: "form-validated",
        name: "Validated form (TanStack Form)",
        description:
          "State, validation, and submission owned by TanStack Form; a zod schema drives inline errors through the Field primitives.",
        preview: <FormValidatedTanstack />,
        source: ss("blocks/form-validated/form-validated"),
      },
      {
        id: "form-personal-info",
        name: "Personal information (single step)",
        description: "A single-step form for capturing basic profile details.",
        preview: <FormLayoutPersonalInfo />,
        source: ss("blocks/form-layout-01/form-layout-01"),
      },
      {
        id: "form-onboarding-wizard",
        name: "Onboarding wizard (multi-step)",
        description: "A guided multi-step flow for onboarding new users.",
        preview: <FormLayoutOnboardingWizard />,
        source: ss("blocks/form-layout-09/form-layout-09"),
      },
    ],
};

export default content;
