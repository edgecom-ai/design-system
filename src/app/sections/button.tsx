"use client"

// Content for the "button" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const ButtonVariantsDemo = React.lazy(() => import("@/components/demo/button-variants-demo").then((m) => ({ default: m.ButtonVariantsDemo })));

const ButtonSizesDemo = React.lazy(() => import("@/components/demo/button-sizes-demo").then((m) => ({ default: m.ButtonSizesDemo })));

const ButtonIconsDemo = React.lazy(() => import("@/components/demo/button-icons-demo").then((m) => ({ default: m.ButtonIconsDemo })));

const ButtonIconButtonsDemo = React.lazy(() => import("@/components/demo/button-icon-buttons-demo").then((m) => ({ default: m.ButtonIconButtonsDemo })));

const ButtonRowActionDemo = React.lazy(() => import("@/components/demo/button-row-action-demo").then((m) => ({ default: m.ButtonRowActionDemo })));

const ButtonLoadingDemo = React.lazy(() => import("@/components/demo/button-loading-demo").then((m) => ({ default: m.ButtonLoadingDemo })));

const ButtonGhostDemo = React.lazy(() => import("@/components/shadcn-studio/button/button-16"));

const ButtonPromiseDemo = React.lazy(() => import("@/components/shadcn-studio/button/button-26"));

const ButtonCopyStateDemo = React.lazy(() => import("@/components/shadcn-studio/button/button-28"));

const content = {
  variants: [
      {
        id: "button-variants",
        name: "Variants",
        description: "The full set of visual styles: neutral variants (including the quiet ghost-destructive), then each semantic in a solid fill and a subtle tint.",
        preview: <ButtonVariantsDemo />,
        source: dm("button-variants-demo"),
      },
      {
        id: "button-sizes",
        name: "Sizes",
        description: "Small, default, and large heights, plus the disabled state.",
        preview: <ButtonSizesDemo />,
        source: dm("button-sizes-demo"),
      },
      {
        id: "button-with-icons",
        name: "With icons",
        description: "Leading or trailing icons paired with a text label.",
        preview: <ButtonIconsDemo />,
        source: dm("button-icons-demo"),
      },
      {
        id: "button-icon-only",
        name: "Icon buttons",
        description: "Square icon-only buttons across sizes, with accessible labels.",
        preview: <ButtonIconButtonsDemo />,
        source: dm("button-icon-buttons-demo"),
      },
      {
        id: "button-row-actions",
        name: "Destructive row action",
        description: "Quiet ghost-destructive icon buttons in a table row — red at rest, tinted on hover, and gated behind a confirmation.",
        preview: <ButtonRowActionDemo />,
        source: dm("button-row-action-demo"),
      },
      {
        id: "button-loading",
        name: "Loading",
        description: "A spinner and disabled state while an action is in flight.",
        preview: <ButtonLoadingDemo />,
        source: dm("button-loading-demo"),
      },
      {
        id: "button-ghost-animated",
        name: "Ghost with animated icon",
        description: "A subtle ghost button whose icon animates on hover.",
        preview: <ButtonGhostDemo />,
        source: ss("button/button-16"),
      },
      {
        id: "button-promise",
        name: "Async / promise state",
        description: "Tracks a promise through loading, success, and error states.",
        preview: <ButtonPromiseDemo />,
        source: ss("button/button-26"),
      },
      {
        id: "button-copy",
        name: "Copy to clipboard",
        description: "Copies text and swaps to a checkmark to confirm.",
        preview: <ButtonCopyStateDemo />,
        source: ss("button/button-28"),
      },
    ],
};

export default content;
