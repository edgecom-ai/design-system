"use client"

// Content for the "colors" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import * as React from "react"
import { Link } from "@/components/docs/link"
import { cn } from "@/lib/utils";
import { Code } from "./shared";

const swatches: { name: string; className: string; fgClass: string; bg: string; fg: string }[] = [
  { name: "primary", className: "bg-primary", fgClass: "text-primary-foreground", bg: "var(--primary)", fg: "var(--primary-foreground)" },
  { name: "accent", className: "bg-accent", fgClass: "text-accent-foreground", bg: "var(--accent)", fg: "var(--accent-foreground)" },
  { name: "secondary", className: "bg-secondary", fgClass: "text-secondary-foreground", bg: "var(--secondary)", fg: "var(--secondary-foreground)" },
  { name: "muted", className: "bg-muted", fgClass: "text-muted-foreground", bg: "var(--muted)", fg: "var(--muted-foreground)" },
  { name: "destructive", className: "bg-destructive", fgClass: "text-white", bg: "var(--destructive)", fg: "white" },
  { name: "success", className: "bg-success", fgClass: "text-success-foreground", bg: "var(--success)", fg: "var(--success-foreground)" },
  { name: "warning", className: "bg-warning", fgClass: "text-warning-foreground", bg: "var(--warning)", fg: "var(--warning-foreground)" },
  { name: "info", className: "bg-info", fgClass: "text-info-foreground", bg: "var(--info)", fg: "var(--info-foreground)" },
  { name: "card", className: "bg-card border border-border", fgClass: "text-card-foreground", bg: "var(--card)", fg: "var(--card-foreground)" },
];

const subtleSurfaces = [
  { name: "primary", box: "bg-primary-subtle text-primary-subtle-foreground", bg: "var(--primary-subtle)", fg: "var(--primary-subtle-foreground)" },
  { name: "success", box: "bg-success-subtle text-success-subtle-foreground", bg: "var(--success-subtle)", fg: "var(--success-subtle-foreground)" },
  { name: "warning", box: "bg-warning-subtle text-warning-subtle-foreground", bg: "var(--warning-subtle)", fg: "var(--warning-subtle-foreground)" },
  { name: "info", box: "bg-info-subtle text-info-subtle-foreground", bg: "var(--info-subtle)", fg: "var(--info-subtle-foreground)" },
  { name: "destructive", box: "bg-destructive-subtle text-destructive-subtle-foreground", bg: "var(--destructive-subtle)", fg: "var(--destructive-subtle-foreground)" },
];

const emphasisText = [
  { name: "primary", fg: "var(--primary)" },
  { name: "success-emphasis", fg: "var(--success-emphasis)" },
  { name: "warning-emphasis", fg: "var(--warning-emphasis)" },
  { name: "info-emphasis", fg: "var(--info-emphasis)" },
  { name: "destructive-emphasis", fg: "var(--destructive-emphasis)" },
];

const chartLines = [
  { name: "chart-legacy-line-teal", also: "" },
  { name: "chart-legacy-line-green", also: "" },
  { name: "chart-legacy-line-brown", also: "" },
  { name: "chart-legacy-line-orange", also: "" },
  { name: "chart-legacy-line-red", also: "legacy-peak-3" },
  { name: "chart-legacy-line-magenta", also: "legacy-peak-1" },
  { name: "chart-legacy-line-sky", also: "legacy-peak-2" },
  { name: "chart-legacy-line-yellow", also: "legacy-peak-4" },
  { name: "chart-legacy-line-lime", also: "legacy-peak-5" },
  { name: "chart-legacy-line-wine", also: "legacy-peak-6" },
  { name: "chart-legacy-line-olive", also: "legacy-peak-7" },
  { name: "chart-legacy-line-steel", also: "" },
];

const surfaces = [
  { name: "muted", cls: "bg-muted" },
  { name: "background", cls: "bg-background" },
  { name: "card", cls: "bg-card" },
  { name: "elevated", cls: "bg-elevated" },
];

function resolveRgb(expr: string): [number, number, number] | null {
  const probe = document.createElement("div");
  probe.style.color = expr;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  if (!resolved) return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillStyle = resolved; // canvas resolves oklch()/rgb() to sRGB bytes
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function useContrast(fg: string, bg: string): number | null {
  const [ratio, setRatio] = React.useState<number | null>(null);
  React.useEffect(() => {
    const compute = () => {
      const a = resolveRgb(fg);
      const b = resolveRgb(bg);
      if (!a || !b) return setRatio(null);
      const l1 = relLuminance(a);
      const l2 = relLuminance(b);
      setRatio((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
    };
    compute();
    const obs = new MutationObserver(compute);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, [fg, bg]);
  return ratio;
}

function ContrastBadge({
  fg,
  bg,
  large = false,
  className,
}: {
  fg: string;
  bg: string;
  large?: boolean;
  className?: string;
}) {
  const ratio = useContrast(fg, bg);
  if (ratio == null) return null;
  const aa = large ? 3 : 4.5;
  const aaa = large ? 4.5 : 7;
  const [label, tone] =
    ratio >= aaa
      ? ["AAA", "bg-success-subtle text-success-subtle-foreground"]
      : ratio >= aa
        ? ["AA", "bg-success-subtle text-success-subtle-foreground"]
        : ratio >= 3
          ? ["AA Large", "bg-warning-subtle text-warning-subtle-foreground"]
          : ["Fail", "bg-destructive-subtle text-destructive-subtle-foreground"];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular",
        tone,
        className
      )}
    >
      {ratio.toFixed(2)}:1 · {label}
    </span>
  );
}

function ColorsPage() {
  return (
    <div className="flex flex-col gap-10">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Live WCAG 2.1 contrast, measured from rendered pixels in the current theme.
        Toggle{" "}
        <span className="font-medium text-foreground">light / dark</span> above to
        recompute. Targets:{" "}
        <span className="font-medium text-foreground">AA ≥ 4.5:1</span> for text,{" "}
        <span className="font-medium text-foreground">3:1</span> for large text / UI.
      </p>

      <section id="colors-usage" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Reach for a token by meaning</h3>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every color here is a semantic token named for a{" "}
          <span className="font-medium text-foreground">role</span> (a surface, a
          status, a piece of emphasis), not for how it looks. Reach for the token
          whose meaning matches the job and it resolves correctly in both themes
          and stays consistent across every screen. Picking by appearance (grabbing
          a red because you want something red) is exactly what breaks dark mode and
          blurs status. That is also why you never hardcode a hex: the token is the
          contract.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Most families carry the same shades, each for one job. The trio exists so
          a single color can play three roles (fill, text, and tint), each already
          paired with a foreground that clears the contrast bar, so you never
          hand-mix a lighter or darker variant:
        </p>
        <ul className="ml-4 flex max-w-2xl list-disc flex-col gap-1.5 text-sm text-muted-foreground marker:text-muted-foreground/60">
          <li>
            <Code>base</Code> fill with its <Code>-foreground</Code>, for a solid
            element and the text or icon on it (a filled button, a solid status
            chip).
          </li>
          <li>
            <Code>-emphasis</Code>, when the color is{" "}
            <span className="font-medium text-foreground">text or a thin icon</span>{" "}
            on a neutral surface. It is tuned to stay legible at small sizes; the
            base fill is too light as text and fails AA.
          </li>
          <li>
            <Code>-subtle</Code> with <Code>-subtle-foreground</Code>, for a{" "}
            <span className="font-medium text-foreground">tinted surface</span>: a
            banner, a selected row, a pill. Never use a base fill color directly as
            a text color.
          </li>
        </ul>
      </section>

      <section id="colors-status" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Status colors carry meaning</h3>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <Code>destructive</Code> = errors and destructive actions ·{" "}
          <Code>success</Code> = positive confirmation · <Code>warning</Code> =
          caution or a negative-but-expected outcome · <Code>info</Code> =
          information. Apply the same token on every surface (badge, alert, toast,
          text, icon) so a color always means the same thing. Never an arbitrary
          red, green, or yellow, and never a status color used decoratively.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">
            <Code>destructive</Code> is the palette&rsquo;s only red that means an
            error or a destructive action.
          </span>{" "}
          The commodity ramps <Code>chart-gas</Code> and <Code>chart-emissions</Code>{" "}
          (on{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="/foundations/charts/"
          >
            Chart ramp
          </Link>
          ) now sit in the same warm-red band, but they tag{" "}
          <span className="font-medium text-foreground">data</span>, never status.
          Keep them apart, since a red data series next to a red error state reads
          as one signal. Pick the token by meaning, not by hue.
        </p>
      </section>

      <section id="colors-solid" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Solid fills</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map((s) => (
            <div
              key={s.name}
              className={cn(
                s.className,
                s.fgClass,
                "flex h-24 flex-col justify-between rounded-lg p-3"
              )}
            >
              <span className="text-xs font-medium">{s.name}</span>
              <ContrastBadge fg={s.fg} bg={s.bg} />
            </div>
          ))}
        </div>
        <p className="text-caption text-muted-foreground">
          Score = label (foreground) legibility on the fill.
        </p>
      </section>

      <section id="colors-subtle" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Status &amp; brand surfaces — subtle</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {subtleSurfaces.map((s) => (
            <div
              key={s.name}
              className={cn(
                s.box,
                "flex h-24 flex-col justify-between rounded-lg border border-border/40 p-3"
              )}
            >
              <span className="text-xs font-medium">{s.name}-subtle</span>
              <ContrastBadge fg={s.fg} bg={s.bg} />
            </div>
          ))}
        </div>
        <p className="text-caption text-muted-foreground">
          Tinted banner / pill background with its <code>-subtle-foreground</code> text.
        </p>
      </section>

      <section id="colors-emphasis" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Emphasis colors as text</h3>
        <div className="flex flex-col gap-2">
          {emphasisText.map((e) => (
            <div key={e.name} className="flex items-center gap-3">
              <span
                className="w-72 text-body font-semibold"
                style={{ color: e.fg }}
              >
                Peak demand shaved 12% — {e.name}
              </span>
              <ContrastBadge fg={e.fg} bg="var(--background)" />
            </div>
          ))}
        </div>
        <p className="text-caption text-muted-foreground">
          On the page background. Use these (not the base fill color) whenever a status
          color is rendered as text or a thin icon.
        </p>
      </section>

      <section id="colors-chart-lines" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Legacy line palette on card</h3>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 dark:text-primary-emphasis"
            href="/foundations/charts/"
          >
            legacy line palette
          </Link>{" "}
          is <span className="font-medium text-foreground">migration only</span>: it
          exists so a product porting plots operators already read by colour can drop
          its literals, and a new feature never draws from it. It is drawn as 1.5–2 px
          plot lines against <Code>card</Code>, so its bar is{" "}
          <span className="font-medium text-foreground">3:1</span>, and every hue must
          clear it in both themes. One row per hue; the peak rank that aliases it is
          listed beside the name.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {chartLines.map((l) => (
            <div
              key={l.name}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
            >
              <span
                aria-hidden
                className="h-0.5 w-16 shrink-0 rounded-full"
                style={{ background: `var(--${l.name})` }}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-mono text-[11px]">{l.name}</span>
                {l.also && (
                  <span className="truncate text-[11px] text-muted-foreground">= {l.also}</span>
                )}
              </div>
              <ContrastBadge fg={`var(--${l.name})`} bg="var(--card)" large />
            </div>
          ))}
        </div>
        <p className="text-caption text-muted-foreground">
          Line hue on the card surface. The peak-window bands are fills read against the
          lines over them, not against the card, so they carry no bar of their own.
        </p>
      </section>

      <section id="colors-elevation" className="flex scroll-mt-24 flex-col gap-3">
        <h3 className="text-title">Elevation surfaces</h3>
        <div className="flex flex-wrap gap-3">
          {surfaces.map((s) => (
            <div
              key={s.name}
              className={cn(
                s.cls,
                "flex h-20 w-40 items-end rounded-lg border border-border p-3 text-xs font-medium"
              )}
            >
              {s.name}
            </div>
          ))}
        </div>
        <p className="text-caption text-muted-foreground">
          Recessed (muted) → page → card → elevated (raised menus / popovers).
        </p>
      </section>
    </div>
  );
}

const content = {
  node: <ColorsPage />,
};

export default content;
