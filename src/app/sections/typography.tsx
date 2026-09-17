"use client"

// Content for the "typography" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

function TypeList({
  items,
  align = "baseline",
}: {
  items: { sample: React.ReactNode; note: string }[];
  align?: "baseline" | "center";
}) {
  return (
    <dl className="flex flex-col rounded-lg border border-border px-4">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Separator />}
          <div
            className={cn(
              "flex justify-between gap-6 py-3",
              align === "center" ? "items-center" : "items-baseline"
            )}
          >
            <dt className="min-w-0">{item.sample}</dt>
            <dd className="shrink-0 text-caption text-muted-foreground">
              {item.note}
            </dd>
          </div>
        </React.Fragment>
      ))}
    </dl>
  );
}

function TokenHint({
  token,
  children,
}: {
  token: string;
  children: React.ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="top">
        <code className="font-mono">{token}</code>
      </TooltipContent>
    </Tooltip>
  );
}

const content = {
  node: (
      <div className="flex max-w-2xl flex-col gap-8">
        <p className="text-sm text-muted-foreground">
          Typeface <span className="font-medium text-foreground">Inter</span> —
          used across every weight and role in the system.
        </p>

        <div id="typo-scale" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Semantic scale — size · line-height · weight baked into one token
          </span>
          <TypeList
            items={[
              { sample: <span className="text-display">Energy that adds up</span>, note: "text-display · 36 / 40 · 700" },
              { sample: <span className="text-heading">Energy that adds up</span>, note: "text-heading · 24 / 30 · 600" },
              { sample: <span className="text-title">Energy that adds up</span>, note: "text-title · 18 / 24 · 600" },
              { sample: <span className="text-body-lg">Energy that adds up</span>, note: "text-body-lg · 16 / 24" },
              { sample: <span className="text-body">Energy that adds up</span>, note: "text-body · 14 / 22" },
              { sample: <span className="text-caption">Energy that adds up</span>, note: "text-caption · 12 / 16 · 500" },
            ]}
          />
        </div>

        <div id="typo-tabular" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Tabular figures — <code className="font-mono">tabular</code> utility aligns
            numeric columns (meter readouts, KPIs)
          </span>
          <div className="grid max-w-md grid-cols-2 gap-x-8 rounded-lg border border-border p-4">
            <div className="flex flex-col gap-1">
              <span className="text-caption text-muted-foreground">default</span>
              {["1,284.05", "942.10", "37,001.98"].map((n) => (
                <span key={n} className="text-body">{n} kWh</span>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-caption text-muted-foreground">.tabular</span>
              {["1,284.05", "942.10", "37,001.98"].map((n) => (
                <span key={n} className="text-body tabular">{n} kWh</span>
              ))}
            </div>
          </div>
        </div>

        <div id="typo-headings" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Headings</span>
          <TypeList
            items={[
              { sample: <h1 className="text-4xl font-extrabold tracking-tight">Energy that adds up</h1>, note: "h1 · text-4xl font-extrabold" },
              { sample: <h2 className="text-3xl font-semibold tracking-tight">Peak demand at a glance</h2>, note: "h2 · text-3xl font-semibold" },
              { sample: <h3 className="text-2xl font-semibold tracking-tight">Site overview</h3>, note: "h3 · text-2xl font-semibold" },
              { sample: <h4 className="text-xl font-semibold tracking-tight">Meter details</h4>, note: "h4 · text-xl font-semibold" },
            ]}
          />
        </div>

        <div id="typo-prose" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Prose</span>
          <TypeList
            items={[
              { sample: <p className="text-xl text-muted-foreground">Track consumption, cost, and emissions across every facility.</p>, note: "lead · text-xl" },
              { sample: <p className="leading-7">A demand charge is based on the highest 15-minute average load recorded during the billing period. Shaving that peak by even a few percent can meaningfully lower the bill.</p>, note: "p · leading-7" },
              { sample: <blockquote className="border-l-2 border-border pl-6 italic">&ldquo;You can&rsquo;t manage what you don&rsquo;t measure.&rdquo;</blockquote>, note: "blockquote" },
            ]}
          />
        </div>

        <div id="typo-text" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Text styles</span>
          <TypeList
            items={[
              { sample: <p className="text-lg font-semibold">1.24 MW current load</p>, note: "large · text-lg font-semibold" },
              { sample: <p className="text-sm font-medium leading-none">Updated 2 minutes ago</p>, note: "small · text-sm font-medium" },
              { sample: <p className="text-sm text-muted-foreground">Averaged over 15-minute intervals.</p>, note: "muted · text-sm" },
              {
                sample: (
                  <p className="leading-7">
                    Set the threshold with{" "}
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      --demand-threshold
                    </code>
                    .
                  </p>
                ),
                note: "inline code",
              },
            ]}
          />
        </div>

        <div id="typo-examples" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Examples — styles composed into real UI (hover any line for its token)
          </span>
          <TooltipProvider>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 rounded-lg border border-border p-6">
                <TokenHint token="text-caption text-muted-foreground">
                  <span className="w-fit text-caption text-muted-foreground">
                    Site report · July 2026
                  </span>
                </TokenHint>
                <TokenHint token="text-heading">
                  <h3 className="w-fit text-heading">Peak demand at a glance</h3>
                </TokenHint>
                <TokenHint token="text-body-lg text-muted-foreground">
                  <p className="text-body-lg text-muted-foreground">
                    Track consumption, cost, and emissions across every facility in
                    one view.
                  </p>
                </TokenHint>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border border-border p-6">
                <TokenHint token="text-caption text-muted-foreground">
                  <span className="w-fit text-caption text-muted-foreground">
                    Current load
                  </span>
                </TokenHint>
                <TokenHint token="text-display tabular">
                  <span className="w-fit text-display tabular">1.24 MW</span>
                </TokenHint>
                <TokenHint token="text-caption text-success-emphasis">
                  <span className="w-fit text-caption text-success-emphasis">
                    ↓ 12% vs. last peak
                  </span>
                </TokenHint>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border border-border p-6 sm:col-span-2">
                <TokenHint token="text-title">
                  <h4 className="w-fit text-title">Understanding demand charges</h4>
                </TokenHint>
                <TokenHint token="text-body">
                  <p className="text-body">
                    A demand charge is based on the highest 15-minute average load
                    recorded during the billing period. Shaving that peak by even a
                    few percent can meaningfully lower the bill.
                  </p>
                </TokenHint>
                <TokenHint token="text-caption text-muted-foreground">
                  <span className="w-fit text-caption text-muted-foreground">
                    Updated 2 minutes ago
                  </span>
                </TokenHint>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    ),
};

export default content;
