"use client"

// Content for the "input-otp" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { ss } from "./shared";

const InputOTPNumberDemo = React.lazy(() => import("@/components/shadcn-studio/input-otp/input-otp-01"));

const content = {
  variants: [
      {
        id: "input-otp-default",
        name: "Segmented entry",
        description: "A one-time passcode split into slots, so the length of the code is visible before it is typed.",
        preview: <InputOTPNumberDemo />,
        source: ss("input-otp/input-otp-01"),
      },
    ],
};

export default content;
