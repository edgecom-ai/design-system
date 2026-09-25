// Content for the "accessibility" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import { cn } from "@/lib/utils";
import { Code } from "./shared";

function AccessibilityDoc() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Accessibility</h1>
        <p className="leading-7 text-muted-foreground">
          Accessibility is the practice of building interfaces that everyone can perceive,
          operate, and understand — regardless of vision, motor, or cognitive ability, input
          device, or environment. We treat it as a baseline rather than a feature for a subset of
          users, because designing with accessibility in mind produces a product that is clearer
          for <em>everyone</em>. The high-contrast color, legible type, and predictable focus
          states that a screen-reader or keyboard user relies on are the same qualities that help
          an operator reading a dashboard on a glare-washed phone outside a substation, or anyone
          scanning quickly at the end of a long shift. Accessible design is simply better design,
          and the entire user base benefits from it.
        </p>
      </div>

      <section id="a11y-color" className="flex scroll-mt-24 flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Color &amp; contrast</h2>
        <p className="leading-7 text-muted-foreground">
          Every semantic color pair is tuned against the{" "}
          <a
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="https://www.w3.org/WAI/WCAG21/quickref/"
            target="_blank"
            rel="noreferrer"
          >
            WCAG&nbsp;2.1
          </a>{" "}
          contrast guidelines. The goal is <strong>AA at a minimum</strong> (4.5:1 for body text,
          3:1 for large text and UI boundaries) and <strong>AAA wherever the palette allows</strong>{" "}
          (7:1). In practice the surfaces you read most clear AAA comfortably — body, card, and
          popover text land near 19:1 in light mode and 18:1 in dark, while secondary, accent, and
          muted helper text stay at or above AA in both themes. For contrast-sensitive cases such
          as text links or labels on tinted fills, dedicated <Code>*-emphasis</Code> token variants
          (for example <Code>primary-emphasis</Code>) push separation further. Light and dark are
          held to the same bar.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Body / background", ratio: "≈19:1 · AAA", cls: "border border-border bg-background text-foreground" },
            { label: "Muted surface", ratio: "helper text ≥4.5:1 · AA", cls: "border border-border bg-muted text-muted-foreground" },
            { label: "Primary", ratio: "≈5.5:1 · AA", cls: "bg-primary text-primary-foreground" },
            { label: "Success", ratio: "≈4.7:1 · AA", cls: "bg-success text-success-foreground" },
            { label: "Warning", ratio: "≈7.7:1 · AAA", cls: "bg-warning text-warning-foreground" },
            { label: "Info", ratio: "≈4.6:1 · AA", cls: "bg-info text-info-foreground" },
          ].map((s) => (
            <div key={s.label} className={cn("flex flex-col justify-between gap-4 rounded-lg p-4", s.cls)}>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs opacity-80">{s.ratio}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="a11y-balance" className="flex scroll-mt-24 flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Balancing visual design &amp; accessibility
        </h2>
        <p className="leading-7 text-muted-foreground">
          Accessibility and visual polish are treated as one problem, not competing ones. Rather
          than flattening the palette to force contrast, the system keeps the Edgecom blue and its
          semantic hues and pairs each with a foreground chosen to clear the threshold. Tuned{" "}
          <Code>*-emphasis</Code> and <Code>*-subtle</Code> variants give designers room to hit
          contrast targets — a darker text tone here, a lighter tint there — without abandoning the
          brand. The result is an interface that still looks like Edgecom and reads cleanly for
          everyone.
        </p>
      </section>

      <section id="a11y-type" className="flex scroll-mt-24 flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Scalable, legible type</h2>
        <p className="leading-7 text-muted-foreground">
          The type scale is defined in relative units. Every size — from captions to display
          headings — is expressed in <Code>rem</Code> and inherits from the browser&rsquo;s root
          font size; nothing in the scale is pinned to a fixed pixel value. When a reader raises
          their default font size or zooms the page, the whole interface scales with them instead
          of clipping or overflowing. Sizes are paired with comfortable line heights, and a single
          sans-serif family (Inter) is used throughout for consistent, legible rendering across
          platforms. See <span className="font-medium text-foreground">Typography</span> for the
          full scale.
        </p>
      </section>
    </div>
  );
}

const content = {
  node: <AccessibilityDoc />,
};

export default content;
