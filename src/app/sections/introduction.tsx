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

      <section id="terms" className="flex scroll-mt-6 flex-col gap-3 border-t border-border pt-8">
        <h2 className="text-title">Terms of use</h2>
        <p className="text-body text-muted-foreground">
          This site and the registry behind it are public so that our product teams, and the AI
          tools they build with, can reach them without signing in. Being public doesn&rsquo;t
          change what they are:
        </p>
        <ul className="ml-4 flex list-disc flex-col gap-2 text-body text-muted-foreground marker:text-muted-foreground/60">
          <li>
            <strong className="font-medium text-foreground">A reference, not a service.</strong>{" "}
            Nothing here is an offer, a product, or a promise of service. There is no support,
            uptime, or maintenance commitment, and any part of it — a component, a token, a URL,
            the registry itself — can change, break, or be withdrawn without notice.
          </li>
          <li>
            <strong className="font-medium text-foreground">Provided as is.</strong> The code and
            guidance come with no warranty of any kind, and you use them at your own risk. To the
            fullest extent the law allows, Edgecom Energy is not liable for any loss arising from
            their use.
          </li>
          <li>
            <strong className="font-medium text-foreground">Example data is invented.</strong> Every
            company, site, person, meter reading, cost, and savings figure in the examples is made
            up for illustration. None of it is customer data, a measurement, or a performance or
            savings claim, and none of it is energy, engineering, or financial advice.
          </li>
          <li>
            <strong className="font-medium text-foreground">Not a roadmap.</strong> A component or
            pattern shown here doesn&rsquo;t mean a feature exists, will ship, or is available in
            dataTrack™, pTrack®, NeuraCharge™, or any other Edgecom product.
          </li>
          <li>
            <strong className="font-medium text-foreground">Public is not open source.</strong>{" "}
            Unless a file says otherwise, the code and content are © Edgecom Energy, all rights
            reserved. Third-party code keeps its own license: examples adapted from{" "}
            <a
              className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
              href="https://shadcnstudio.com"
              target="_blank"
              rel="noreferrer"
            >
              shadcn/studio
            </a>
            &rsquo;s free components stay under{" "}
            <a
              className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
              href="https://github.com/edgecom-ai/design-system/blob/main/src/components/shadcn-studio/LICENSE"
              target="_blank"
              rel="noreferrer"
            >
              its license
            </a>
            .
          </li>
          <li>
            <strong className="font-medium text-foreground">Trademarks.</strong> dataTrack™,
            pTrack®, and NeuraCharge™ are trademarks of Edgecom Energy. Access to this code grants
            no right to use them, or to suggest that your work comes from or is endorsed by
            Edgecom. Other names belong to their owners.
          </li>
          <li>
            <strong className="font-medium text-foreground">No tracking.</strong> The site runs no
            analytics or tracking scripts and asks for no personal information. It is hosted on
            GitHub Pages, which keeps its own server logs under{" "}
            <a
              className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noreferrer"
            >
              GitHub&rsquo;s privacy statement
            </a>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}

const content = {
  node: <IntroductionDoc />,
};

export default content;
