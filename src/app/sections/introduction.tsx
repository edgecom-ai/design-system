// Content for the "introduction" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import { Link } from "@/components/docs/link"

function IntroductionDoc() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>
        <p className="leading-7 text-muted-foreground">
          This is <strong className="text-foreground">Edgecom Energy&rsquo;s design system</strong>{" "}
          for our software products — the shared foundation of design tokens, components, and
          patterns behind dataTrack™, pTrack®, and the tools around them. Its purpose is a
          cohesive, consistent experience across every Edgecom application, so that a chart, a
          table, or a control looks and behaves the same way no matter which product a user is in.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Built for industrial energy applications
        </h2>
        <p className="leading-7 text-muted-foreground">
          Energy monitoring is a data-dense domain: interval meter reads, demand curves, cost and
          emissions breakdowns, power-quality traces, and alarms — often spanning many sites and
          thousands of channels at once. The system is built for that scale. Its data tables, chart
          ramp, and semantic colors are tuned to keep large volumes of data and heavy visualization
          legible and calm rather than noisy, and to stay consistent whether you are looking at a
          single submeter or an entire portfolio.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Based on shadcn</h2>
        <p className="leading-7 text-muted-foreground">
          It is built on{" "}
          <a
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
          >
            shadcn
          </a>{" "}
          and distributed as a public registry from{" "}
          <a className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis" href="https://ui.shadcn.com/docs/registry/github" target="_blank" rel="noreferrer">GitHub</a>:
          you install real, owned components straight into your app with the shadcn CLI instead of
          copying markup or taking on a black-box dependency. Under the hood the primitives are composed with{" "}
          <a
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="https://base-ui.com"
            target="_blank"
            rel="noreferrer"
          >
            Base UI
          </a>
          . Head to{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="/getting-started/installation"
          >
            Installation
          </Link>{" "}
          to install it and start building.
        </p>
      </section>
    </div>
  );
}

const content = {
  node: <IntroductionDoc />,
};

export default content;
