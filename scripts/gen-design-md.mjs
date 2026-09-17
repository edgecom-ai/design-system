// Regenerates the token front-matter of design.md from the OKLCH tokens in
// src/app/globals.css, then mirrors the file to public/design.md so it serves
// at https://design.edgecom.ai/design.md.
//
// Only the block between the `# @@GENERATED:tokens` and `# @@GENERATED:end`
// markers (colors / typography / rounded) is rewritten — the hand-authored
// front-matter keys (name/description/components) and the entire markdown body
// are preserved. globals.css is the single source of truth; this keeps the
// design-language spec from drifting away from the runtime tokens.
//
// Parsing mirrors gen-registry.mjs (blockVars): :root is the canonical light
// token set; dark deltas are documented in the body, not the front-matter.

import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { readBlocks } from "./lib/tokens.mjs";
import { freshness, forced } from "./lib/stale.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Skip the work when nothing this generator reads has moved (see lib/stale.mjs).
// `--force` / DOCS_GEN_FORCE=1 rebuilds regardless.
const stamp = freshness({
  name: "design-md",
  inputs: ["src/app/globals.css", "scripts/gen-design-md.mjs"],
  outputs: ["design.md", "public/design.md"],
});
if (stamp.fresh && !forced()) {
  console.log("gen-design-md — up to date — skipped");
  process.exit(0);
}

const css = readFileSync(resolve(root, "src/app/globals.css"), "utf8");
const designPath = resolve(root, "design.md");
const publicPath = resolve(root, "public/design.md");

// --- parse globals.css (same approach as gen-registry.mjs) ------------------
const { theme: themeVars, light: lightVars } = readBlocks(css);

// Semantic colors surfaced in the front-matter (role order), each pulling its
// light/canonical value from :root. Comments group them for readability.
const COLOR_GROUPS = [
  { comment: null, keys: ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground", "elevated", "elevated-foreground", "scrim"] },
  { comment: "Brand blue — deliberately identical in light and dark", keys: ["primary", "primary-foreground", "primary-emphasis", "primary-subtle"] },
  { comment: null, keys: ["secondary", "secondary-foreground", "muted", "muted-foreground", "accent", "accent-foreground"] },
  { comment: "Status — each also has -foreground / -subtle-foreground (see body)", keys: ["success", "success-emphasis", "success-subtle", "warning", "warning-emphasis", "warning-subtle", "info", "info-emphasis", "info-subtle", "destructive", "destructive-emphasis", "destructive-subtle"] },
  { comment: null, keys: ["border", "input", "ring"] },
];
const COMMODITIES = ["electricity", "water", "gas", "temperature", "emissions", "misc"];
// Legacy line palette (migration only): neutral colour names, peak-rank
// aliases, and window bands. No `--color-*` mapping, so read straight off :root.
const LEGACY_TOKENS = [
  "legacy-line-teal", "legacy-line-green", "legacy-line-brown", "legacy-line-orange", "legacy-line-red", "legacy-line-magenta",
  "legacy-line-sky", "legacy-line-yellow", "legacy-line-lime", "legacy-line-wine", "legacy-line-olive", "legacy-line-steel",
  "legacy-peak-1", "legacy-peak-2", "legacy-peak-3", "legacy-peak-4", "legacy-peak-5", "legacy-peak-6", "legacy-peak-7",
  "legacy-window-high", "legacy-window-normal", "legacy-window-low",
];
const TYPE_SCALE = ["caption", "body-sm", "body", "body-lg", "title", "heading", "display"];
const RADII = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

function val(name) {
  const v = lightVars[name];
  if (v == null) throw new Error(`gen-design-md: token --${name} not found in :root`);
  // Follow an alias (`var(--other)`) to the value it shares, so the spec
  // shows a colour, not a pointer.
  const alias = v.match(/^var\(--([\w-]+)\)$/);
  return alias ? val(alias[1]) : v;
}

// --- build the generated block ----------------------------------------------
const lines = [];
lines.push(
  "# @@GENERATED:tokens — colors/typography/rounded are generated from src/app/globals.css by scripts/gen-design-md.mjs (run `pnpm docs:gen`); do not hand-edit until the closing marker. Light (canonical) OKLCH values; dark deltas are in the body."
);

lines.push("colors:");
for (const group of COLOR_GROUPS) {
  if (group.comment) lines.push(`  # ${group.comment}`);
  for (const k of group.keys) lines.push(`  ${k}: ${val(k)}`);
}
lines.push("  # Commodity categorical ramp (chart series) — mode-independent");
for (const c of COMMODITIES) lines.push(`  chart-${c}: ${val(`chart-${c}-500`)}`);
lines.push("  # LEGACY line palette — migration of existing plots only, never a new feature (light values; dark re-tunes in the body)");
for (const r of LEGACY_TOKENS) lines.push(`  chart-${r}: ${val(`chart-${r}`)}`);

lines.push("typography:");
lines.push("  font-family: SF Pro / system-ui sans (var --font-sans)");
lines.push("  font-family-mono: SF Mono / ui-monospace (var --font-mono)");
for (const name of TYPE_SCALE) {
  const size = themeVars[`text-${name}`];
  const lh = themeVars[`text-${name}--line-height`];
  const weight = themeVars[`text-${name}--font-weight`] || "400";
  const tracking = themeVars[`text-${name}--letter-spacing`];
  const parts = [`size: ${size}`, `line-height: ${lh}`, `weight: ${weight}`];
  if (tracking) parts.push(`tracking: ${tracking}`);
  lines.push(`  ${name}: { ${parts.join(", ")} }`);
}

lines.push("rounded:");
const base = val("radius"); // e.g. "0.625rem"
const baseNum = parseFloat(base);
lines.push(`  base: ${base}   # --radius`);
for (const r of RADII) {
  const expr = themeVars[`radius-${r}`] || "";
  const m = expr.match(/\*\s*([\d.]+)/);
  const mult = m ? parseFloat(m[1]) : 1;
  const rem = +(baseNum * mult).toFixed(4);
  lines.push(`  ${r}: ${rem}rem${m ? `   # base * ${mult}` : "   # base"}`);
}

lines.push("# @@GENERATED:end");
const block = lines.join("\n");

// --- inject into design.md, then mirror to public/ --------------------------
const md = readFileSync(designPath, "utf8");
// `# @@GENERATED:end` (with the `# ` prefix) so this does not match a bare
// `@@GENERATED:end` mentioned inside the start marker.
const re = /# @@GENERATED:tokens[\s\S]*?\n# @@GENERATED:end/;
if (!re.test(md)) {
  throw new Error("gen-design-md: @@GENERATED:tokens…@@GENERATED:end markers not found in design.md");
}
const out = md.replace(re, block);
writeFileSync(designPath, out);
copyFileSync(designPath, publicPath);

const colorCount = COLOR_GROUPS.reduce((n, g) => n + g.keys.length, 0) + COMMODITIES.length + LEGACY_TOKENS.length;
console.log(
  `gen-design-md — ${colorCount} colors + ${TYPE_SCALE.length} type steps + ${RADII.length + 1} radii → design.md (+ public/design.md)`
);

stamp.save();
