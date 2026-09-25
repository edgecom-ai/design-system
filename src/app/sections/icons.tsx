// Content for the "icons" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { Code, Snippet } from "./shared";



const content = {
  node: (
      <div className="flex max-w-2xl flex-col gap-8">
        <p className="text-sm leading-6 text-muted-foreground">
          We use{" "}
          <a
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="https://lucide.dev/icons/"
            target="_blank"
            rel="noreferrer"
          >
            Lucide
          </a>{" "}
          — an open-source set of 1,600+ icons drawn on a consistent 24×24 grid with a uniform
          stroke, so glyphs stay balanced at any size. Each icon is a React component; size it with a
          Tailwind <Code>size-*</Code> utility and it inherits the current text color via{" "}
          <Code>currentColor</Code>, so a semantic text token colors the icon too.
        </p>

        <div id="icons-sizes" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Sizes — Tailwind <Code>size-*</Code> utilities (rem-based, so they scale with the root
            font size)
          </span>
          <div className="flex flex-wrap items-end gap-8 rounded-lg border border-border p-6">
            {[
              { cls: "size-3", px: "12px", use: "dense / inline" },
              { cls: "size-3.5", px: "14px", use: "small buttons" },
              { cls: "size-4", px: "16px", use: "default" },
              { cls: "size-5", px: "20px", use: "large buttons" },
              { cls: "size-6", px: "24px", use: "feature / empty state" },
            ].map((s) => (
              <div key={s.cls} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-6 items-center">
                  <Gauge className={cn(s.cls, "text-foreground")} />
                </div>
                <span className="text-caption font-medium text-foreground">{s.cls}</span>
                <span className="text-caption text-muted-foreground">
                  {s.px} · {s.use}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <Code>size-4</Code> (16px) is the default — it&rsquo;s what buttons, menu items, and
            inputs apply automatically.
          </p>
        </div>

        <div id="icons-usage" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Usage</span>
          <Snippet>{`import { Gauge, Zap } from "lucide-react"

// Size with a Tailwind size-* utility; color follows the text token.
<Gauge className="size-4 text-muted-foreground" />
<Zap className="size-5 text-warning" />`}</Snippet>
        </div>

        <div id="icons-install" className="flex scroll-mt-24 flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">Installation</span>
          <p className="text-sm leading-6 text-muted-foreground">
            <Code>lucide-react</Code> is a runtime dependency, not part of the CSS theme. You
            don&rsquo;t add it by hand — the shadcn CLI installs it automatically whenever you add an
            Edgecom component that uses an icon (<Code>components.json</Code> sets{" "}
            <Code>iconLibrary: &quot;lucide&quot;</Code>). To use icons on their own, add it directly:
          </p>
          <Snippet>{`pnpm add lucide-react`}</Snippet>
        </div>
      </div>
    ),
};

export default content;
