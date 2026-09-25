// Content for the "authorization" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const AuthorizationDemo = React.lazy(() => import("@/components/demo/authorization-demo").then((m) => ({ default: m.AuthorizationDemo })));

const AuthorizationRequestDemo = React.lazy(() => import("@/components/demo/authorization-request-demo").then((m) => ({ default: m.AuthorizationRequestDemo })));

const content = {
  variants: [
      {
        id: "authorization-connecting",
        name: "Connecting",
        description: "A card that tracks each step of a utility connection while it runs.",
        preview: <AuthorizationDemo />,
        source: dm("authorization-demo"),
      },
      {
        id: "authorization-request",
        name: "Access request",
        description: "An OAuth-style consent card with a searchable utility selector.",
        preview: <AuthorizationRequestDemo />,
        source: dm("authorization-request-demo"),
      },
    ],
};

export default content;
