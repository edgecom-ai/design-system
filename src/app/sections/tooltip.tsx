"use client"

// Content for the "tooltip" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ss } from "./shared";

const TooltipErrorDemo = React.lazy(() => import("@/components/shadcn-studio/tooltip/tooltip-04"));

const TooltipContentDemo = React.lazy(() => import("@/components/shadcn-studio/tooltip/tooltip-07"));

const TooltipBadgeDemo = React.lazy(() => import("@/components/shadcn-studio/tooltip/tooltip-10"));

const HoverCardStatsDemo = React.lazy(() => import("@/components/shadcn-studio/tooltip/tooltip-12"));

const HoverCardProjectDemo = React.lazy(() => import("@/components/shadcn-studio/tooltip/tooltip-13"));

const HoverCardTasksDemo = React.lazy(() => import("@/components/shadcn-studio/tooltip/tooltip-15"));

const content = {
  variants: [
      {
        id: "tooltip-default",
        name: "Default",
        description: "A short hint revealed on hover or focus.",
        preview: (
          <TooltipProvider>
            <div className="flex flex-wrap items-center gap-3">
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
                <TooltipContent>Sends a test alert to your inbox.</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button size="icon" variant="ghost" aria-label="Info">
                      <Info />
                    </Button>
                  }
                />
                <TooltipContent>Load is averaged over 15 minutes.</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ),
      },
      {
        id: "tooltip-badge",
        name: "On a badge",
        description: "Attach a tooltip to a badge to explain its status.",
        preview: (
          <TooltipProvider>
            <TooltipBadgeDemo />
          </TooltipProvider>
        ),
        source: ss("tooltip/tooltip-10"),
      },
      {
        id: "tooltip-content",
        name: "Rich content",
        description: "Tooltips with headings and multiple lines of detail.",
        preview: (
          <TooltipProvider>
            <TooltipContentDemo />
          </TooltipProvider>
        ),
        source: ss("tooltip/tooltip-07"),
      },
      {
        id: "tooltip-error",
        name: "Error state",
        description: "A destructive-styled tooltip for warnings and errors.",
        preview: (
          <TooltipProvider>
            <TooltipErrorDemo />
          </TooltipProvider>
        ),
        source: ss("tooltip/tooltip-04"),
      },
      {
        id: "hover-card-stats",
        name: "Hover card — stats",
        description: "A rich hover card surfacing key metrics at a glance.",
        preview: <HoverCardStatsDemo />,
        source: ss("tooltip/tooltip-12"),
      },
      {
        id: "hover-card-project",
        name: "Hover card — project",
        description: "Preview project details without leaving the page.",
        preview: <HoverCardProjectDemo />,
        source: ss("tooltip/tooltip-13"),
      },
      {
        id: "hover-card-tasks",
        name: "Hover card — tasks",
        description: "Show a summary task list on hover.",
        preview: <HoverCardTasksDemo />,
        source: ss("tooltip/tooltip-15"),
      },
    ],
};

export default content;
