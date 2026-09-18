"use client"

// Content for the "phone-input" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const PhoneInputWithLabel = React.lazy(() => import("@/components/shadcn-studio/phone-input/phone-input-02"));

const PhoneInputExtensionDemo = React.lazy(() => import("@/components/demo/phone-input-extension-demo").then((m) => ({ default: m.PhoneInputExtensionDemo })));

const content = {
  variants: [
      {
        id: "phone-input-default",
        name: "With country code",
        description: "A phone field whose country selector keeps the dial code and the number in one value.",
        preview: <PhoneInputWithLabel />,
        source: ss("phone-input/phone-input-02"),
      },
      {
        id: "phone-input-extension",
        name: "With extension",
        description: "A site contact's desk extension kept as a separate value beside the number.",
        preview: <PhoneInputExtensionDemo />,
        source: dm("phone-input-extension-demo"),
      },
    ],
};

export default content;
