// Content for the "popover" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover";
import { ss } from "./shared";

const PopoverAboutDemo = React.lazy(() => import("@/components/shadcn-studio/popover/popover-05"));

const PopoverDeleteFileDemo = React.lazy(() => import("@/components/shadcn-studio/popover/popover-07"));

const PopoverFeedbackDemo = React.lazy(() => import("@/components/shadcn-studio/popover/popover-08"));

const PopoverFilterDemo = React.lazy(() => import("@/components/shadcn-studio/popover/popover-09"));

const PopoverSearchDemo = React.lazy(() => import("@/components/shadcn-studio/popover/popover-10"));

const PopoverNotificationsDemo = React.lazy(() => import("@/components/shadcn-studio/popover/popover-11"));

const content = {
  variants: [
      {
        id: "popover-form",
        name: "With form field",
        description: "A popover containing a labelled input to edit a value.",
        preview: (
          <Popover>
            <PopoverTrigger render={<Button variant="outline">Demand threshold</Button>} />
            <PopoverContent className="w-72">
              <PopoverTitle>Demand threshold</PopoverTitle>
              <PopoverDescription>
                Alerts fire when 15-minute load exceeds this value.
              </PopoverDescription>
              <div className="mt-3 grid gap-2">
                <Label htmlFor="threshold">Threshold (kW)</Label>
                <Input id="threshold" defaultValue="1100" />
              </div>
            </PopoverContent>
          </Popover>
        ),
      },
      {
        id: "popover-about",
        name: "About card",
        description: "A popover surfacing summary details about an item.",
        preview: <PopoverAboutDemo />,
        source: ss("popover/popover-05"),
      },
      {
        id: "popover-delete-file",
        name: "Delete confirmation",
        description: "A popover confirming a destructive delete action.",
        preview: <PopoverDeleteFileDemo />,
        source: ss("popover/popover-07"),
      },
      {
        id: "popover-feedback",
        name: "Feedback",
        description: "A popover with a quick feedback form.",
        preview: <PopoverFeedbackDemo />,
        source: ss("popover/popover-08"),
      },
      {
        id: "popover-filter",
        name: "Filter",
        description: "A popover housing filter controls for a list or table.",
        preview: <PopoverFilterDemo />,
        source: ss("popover/popover-09"),
      },
      {
        id: "popover-search",
        name: "Search",
        description: "A popover with a search field and results.",
        preview: <PopoverSearchDemo />,
        source: ss("popover/popover-10"),
      },
      {
        id: "popover-notifications",
        name: "Notifications",
        description: "A popover listing recent notifications.",
        preview: <PopoverNotificationsDemo />,
        source: ss("popover/popover-11"),
      },
    ],
};

export default content;
