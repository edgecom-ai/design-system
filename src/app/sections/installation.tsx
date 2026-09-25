// Content for the "installation" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { CheckCircle2, XCircle } from "lucide-react";
import { Code, Snippet } from "./shared";

function StepHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {n}
      </span>
      {children}
    </h2>
  );
}

function GetStartedDoc() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="leading-7 text-muted-foreground">
          The Edgecom Design System is a public shadcn registry, distributed straight from{" "}
          <a className="font-medium text-primary dark:text-primary-emphasis underline underline-offset-4" href="https://ui.shadcn.com/docs/registry/github" target="_blank" rel="noreferrer">GitHub</a>.
          It ships our design tokens and <a className="font-medium text-primary dark:text-primary-emphasis underline underline-offset-4" href="https://base-ui.com" target="_blank" rel="noreferrer">Base UI</a> components —
          pull them into your app with the shadcn CLI, no copy-paste and no hardcoded hex.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <StepHeading n={1}>Prerequisites</StepHeading>
        <p className="text-sm text-muted-foreground">
          Your app needs a shadcn-initialized project on{" "}
          <a className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis" href="https://tailwindcss.com" target="_blank" rel="noreferrer">Tailwind&nbsp;v4</a>. If
          you haven&rsquo;t already, run <Code>pnpm dlx shadcn@latest init</Code> — it creates{" "}
          <Code>components.json</Code>, adds <Code>@import &quot;tailwindcss&quot;;</Code> to your CSS,
          and sets up the <Code>@/*</Code> path alias our components import through.
        </p>
        <ul className="ml-4 flex list-disc flex-col gap-1 text-sm text-muted-foreground marker:text-muted-foreground/60">
          <li>Tailwind v4 with <Code>@import &quot;tailwindcss&quot;;</Code> in your CSS entry</li>
          <li>A <Code>@/*</Code> path alias (matching <Code>components.json</Code> aliases)</li>
          <li>React&nbsp;19 / Next&nbsp;16 (or compatible) and the <Code>lucide-react</Code> icon set</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading n={2}>Install straight from GitHub</StepHeading>
        <p className="text-sm text-muted-foreground">
          There&rsquo;s nothing to configure — no <Code>components.json</Code> entry and no token.
          The public repo <em>is</em> the registry: reference any item by its GitHub address,{" "}
          <Code>edgecom-ai/design-system/&lt;name&gt;</Code>, and the CLI fetches it plus everything
          it depends on. Pin to a branch, tag, or commit by appending <Code>#ref</Code>.
        </p>
        <Snippet>{`# address format — no config, no auth
edgecom-ai/design-system/<name>

# pin to a tag, branch, or commit
edgecom-ai/design-system/button#v1.0.0`}</Snippet>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading n={3}>Add components</StepHeading>
        <p className="text-sm text-muted-foreground">
          Add whatever you need — the theme comes with it. Every component depends on{" "}
          <Code>theme</Code>, so the first install automatically writes the OKLCH tokens
          into your <Code>globals.css</Code> and drops <Code>cn</Code> into <Code>lib/utils.ts</Code>.
          Cross-component dependencies, hooks, and package deps all resolve on their own — adding{" "}
          <Code>sidebar</Code>, for example, pulls its sub-components and the{" "}
          <Code>use-mobile</Code> hook too.
        </p>
        <Snippet>{`# theme + tokens ride along on the first component you add
pnpm dlx shadcn@latest add edgecom-ai/design-system/button edgecom-ai/design-system/card

# want just the tokens (no component)? add the theme on its own
pnpm dlx shadcn@latest add edgecom-ai/design-system/theme`}</Snippet>
        <p className="text-sm text-muted-foreground">
          Re-running is safe: files already present are skipped, so shared pieces like the theme and{" "}
          <Code>button</Code> are never duplicated. Pass <Code>--overwrite</Code> only when you mean
          to discard local edits.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading n={4}>Build with semantic tokens — never hardcode</StepHeading>
        <p className="text-sm text-muted-foreground">
          Every color is a token that tracks light/dark automatically. Use the utility, not the hex.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border border-success/40 bg-success/5 p-4">
            <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-success">
              <CheckCircle2 className="size-3.5" /> Do
            </span>
            <Code>{`<Button className="bg-primary text-primary-foreground" />`}</Code>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
            <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-destructive">
              <XCircle className="size-3.5" /> Don&rsquo;t
            </span>
            <Code>{`<button className="bg-[#0966C0] text-white" />`}</Code>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Token families:{" "}
          <Code>primary</Code> <Code>accent</Code> <Code>secondary</Code> <Code>muted</Code>{" "}
          <Code>success</Code> <Code>warning</Code> <Code>info</Code> <Code>destructive</Code>{" "}
          <Code>border</Code> <Code>ring</Code> <Code>chart-1…5</Code> — each with a matching{" "}
          <Code>-foreground</Code>. See <span className="font-medium text-foreground">Foundations → Semantic colors</span>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <StepHeading n={5}>Compose with Base UI, not Radix</StepHeading>
        <p className="text-sm text-muted-foreground">
          Our primitives are built on Base UI. Pass a trigger via the <Code>render</Code> prop —
          there is no <Code>asChild</Code>.
        </p>
        <Snippet>{`// ✅ Base UI — pass the trigger element via \`render\`
<DialogTrigger render={<Button>Open</Button>} />

// ❌ not Radix-style asChild
<DialogTrigger asChild><Button>Open</Button></DialogTrigger>`}</Snippet>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">What&rsquo;s inside</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Foundations</p>
            <p className="mt-1 text-xs text-muted-foreground">Colors, chart ramp, typography</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Components</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Buttons, inputs, tables, overlays &amp; more
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Blocks</p>
            <p className="mt-1 text-xs text-muted-foreground">Charts &amp; data tables</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Browse the groups in the sidebar to preview every item in light and dark.
        </p>
      </section>
    </div>
  );
}

const content = {
  node: <GetStartedDoc />,
};

export default content;
