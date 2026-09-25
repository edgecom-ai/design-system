// Content for the "label-textarea" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm, ss } from "./shared";

const TextareaInvalidDemo = React.lazy(() => import("@/components/shadcn-studio/textarea/textarea-05"));

const TextareaRequiredDemo = React.lazy(() => import("@/components/shadcn-studio/textarea/textarea-07"));

const TextareaWithButtonDemo = React.lazy(() => import("@/components/shadcn-studio/textarea/textarea-16"));

const TextareaNoteDemo = React.lazy(() => import("@/components/demo/textarea-note-demo").then((m) => ({ default: m.TextareaNoteDemo })));

const content = {
  variants: [
      {
        id: "textarea-note",
        name: "Label + textarea",
        description: "A labelled multi-line text area.",
        preview: <TextareaNoteDemo />,
        source: dm("textarea-note-demo"),
      },
      {
        id: "textarea-required",
        name: "Required",
        description: "A text area marked as required.",
        preview: <TextareaRequiredDemo />,
        source: ss("textarea/textarea-07"),
      },
      {
        id: "textarea-invalid",
        name: "Invalid",
        description: "A text area in an error state with a message.",
        preview: <TextareaInvalidDemo />,
        source: ss("textarea/textarea-05"),
      },
      {
        id: "textarea-with-button",
        name: "With button",
        description: "A text area with an inline submit button.",
        preview: <TextareaWithButtonDemo />,
        source: ss("textarea/textarea-16"),
      },
    ],
};

export default content;
