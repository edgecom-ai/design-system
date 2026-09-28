// Content for the "detail-dialog" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { dm } from "./shared";

const UserDetailsDialogDemo = React.lazy(() => import("@/components/demo/user-details-dialog-demo").then((m) => ({ default: m.UserDetailsDialogDemo })));

const CreateAlarmDialogDemo = React.lazy(() => import("@/components/demo/create-alarm-dialog-demo").then((m) => ({ default: m.CreateAlarmDialogDemo })));

const content = {
  variants: [
      {
        id: "detail-dialog-create-alarm",
        name: "Create alarm",
        description: "A grouped, multi-section form dialog for defining a threshold alarm on a sensor, with a live rule summary.",
        preview: <CreateAlarmDialogDemo />,
        source: dm("create-alarm-dialog-demo"),
      },
      {
        id: "detail-dialog-user",
        name: "Edit user details",
        description: "A scrollable record editor combining avatar, inputs, select, calendar, and popover.",
        preview: <UserDetailsDialogDemo />,
        source: dm("user-details-dialog-demo"),
      },
    ],
};

export default content;
