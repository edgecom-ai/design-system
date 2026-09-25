// Content for the "switch" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const SwitchCardDemo = React.lazy(() => import("@/components/shadcn-studio/switch/switch-16"));

const SwitchListGroupDemo = React.lazy(() => import("@/components/shadcn-studio/switch/switch-18"));

const SwitchBasicDemo = React.lazy(() => import("@/components/demo/switch-basic-demo").then((m) => ({ default: m.SwitchBasicDemo })));

const content = {
  variants: [
      {
        id: "switch-basic",
        name: "Labels and disabled",
        description: "Switches with labels, including a disabled example.",
        preview: <SwitchBasicDemo />,
        source: dm("switch-basic-demo"),
      },
      {
        id: "switch-card",
        name: "Card",
        description: "A switch presented inside a selectable card.",
        preview: <SwitchCardDemo />,
        source: ss("switch/switch-16"),
      },
      {
        id: "switch-list-group",
        name: "List group",
        description: "A grouped list of settings, each with a switch.",
        preview: <SwitchListGroupDemo />,
        source: ss("switch/switch-18"),
      },
    ],
};

export default content;
