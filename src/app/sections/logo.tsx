// Content for the "logo" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import { Logo } from "@/components/ui/logo";



const content = {
  node: (
      <div className="flex max-w-3xl flex-col gap-8">
        <p className="text-sm text-muted-foreground">
          The Edgecom brand mark. The colored (gradient) artwork is the default;
          it swaps to the flat-white version automatically in dark mode. Size it
          with <code className="font-mono">className</code> (e.g.{" "}
          <code className="font-mono">h-8 w-auto</code>) — never re-color or
          rebuild it by hand.
        </p>

        <div id="logo-combination" className="flex scroll-mt-24 flex-col gap-2">
          <span className="text-xs text-muted-foreground">
            Combination lockup · <code className="font-mono">variant=&quot;combination&quot;</code> (default)
          </span>
          <div className="flex flex-wrap items-center gap-8 rounded-lg border border-border p-8">
            <Logo className="h-10" />
            <Logo className="h-6" />
          </div>
        </div>

        <div id="logo-mark" className="flex scroll-mt-24 flex-col gap-2">
          <span className="text-xs text-muted-foreground">
            Mark only · <code className="font-mono">variant=&quot;mark&quot;</code>
          </span>
          <div className="flex flex-wrap items-center gap-8 rounded-lg border border-border p-8">
            <Logo variant="mark" className="h-14" />
            <Logo variant="mark" className="h-9" />
            <Logo variant="mark" className="h-6" />
          </div>
        </div>

        <div id="logo-dark" className="flex scroll-mt-24 flex-col gap-2">
          <span className="text-xs text-muted-foreground">
            On a dark surface (white variant) — always rendered here for reference
          </span>
          <div className="dark flex flex-wrap items-center gap-8 rounded-lg border border-border bg-background p-8">
            <Logo className="h-10" />
            <Logo variant="mark" className="h-14" />
          </div>
        </div>
      </div>
    ),
};

export default content;
