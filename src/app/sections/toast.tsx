// Content for the "toast" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const ToastDemo = React.lazy(() => import("@/components/demo/toast-demo").then((m) => ({ default: m.ToastDemo })));

const content = {
  variants: [
      {
        id: "toast-triggers",
        name: "Toast triggers",
        description: "Rich-color success, warning, and error toasts.",
        preview: <ToastDemo />,
        source: dm("toast-demo"),
      },
    ],
};

export default content;
