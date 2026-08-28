// Two audits of the BUILT registry, both failing the build:
//
// 1. Manifests — an item that imports something it doesn't declare, declares a
//    dependency without a version range or without the @types companion it
//    needs, or declares a registry dependency the registry never emits.
// 2. Semantic type tokens — a shipped source that pairs a type token with a
//    `leading-*`, a `text-<token>/<modifier>`, or a weight the token already
//    owns.
// `shadcn add <item>` installs exactly what the item declares, so an undeclared
// import ships a package that can't resolve in the consumer's tree (#35) — and a
// declared-but-missing sibling is a dependency the CLI follows to nothing.
//
// gen-registry derives both fields from the source, so this is a backstop
// against the derivation regressing (it did once, on quote style) and against
// `shadcn build` dropping a field on the way to public/r. It reads imports
// through the same scanner the generator uses (scripts/lib/imports.mjs) so the
// two can't disagree about what a file imports.
//
// The type-token audit is here for the same reason: a registry item installs
// verbatim, so an override of the line-height or weight a token owns can only be
// fought call site by call site in the consumer's app (#45). It reads the token
// list off the built `theme` item, so adding a token to globals.css extends the
// check automatically.

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { specifiersOf, classify } from "./lib/imports.mjs";
import { pkgName, typesFor, UNPINNED } from "./lib/deps.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const builtDir = resolve(root, "public/r");

const problems = [];
const files = readdirSync(builtDir).filter((f) => f.endsWith(".json"));
const items = files.map((f) => JSON.parse(readFileSync(resolve(builtDir, f), "utf8")));
const known = new Set(items.map((i) => i.name));

for (const item of items) {
  const declared = item.dependencies ?? [];
  const declaredDev = item.devDependencies ?? [];
  const deps = new Set(declared.map(pkgName));
  const devDeps = new Set(declaredDev.map(pkgName));
  // Registry deps are full addresses (`edgecom-ai/design-system/button`).
  const registryDeps = new Set((item.registryDependencies ?? []).map((d) => d.split("/").pop()));
  const undeclared = { npm: new Set(), registry: new Set() };

  for (const f of item.files ?? []) {
    for (const spec of specifiersOf(f.content ?? "", `${item.name} (${f.path})`)) {
      const { kind, name } = classify(spec);
      if (kind === "ui" || kind === "hook") {
        if (name !== item.name && !registryDeps.has(name)) undeclared.registry.add(name);
      } else if (kind === "pkg" && !deps.has(name)) {
        undeclared.npm.add(name);
      }
      // "local" (@/lib/utils comes via the theme item) and "ambient" (React
      // itself, which every consumer has by definition) are never declared.
    }
  }

  // A registryDependency with no item behind it breaks the install cascade just
  // as hard as a missing one.
  const dangling = [...registryDeps].filter((d) => !known.has(d));

  // A dependency with no version range installs whatever `latest` is the day a
  // consumer runs `shadcn add` — which is how a component written against v3 of
  // a package met v4 in someone else's tree (#40).
  const unpinned = [...declared, ...declaredDev].filter(
    (d) => pkgName(d) === d && !UNPINNED.has(d)
  );

  // Shipping a runtime package whose types live in a separate @types package,
  // without that companion, leaves a strict consumer with a TS7016 on the file
  // we just installed for them — #41's failure one step further along.
  const missingTypes = [...deps]
    .map(typesFor)
    .filter((t) => t && !devDeps.has(t));

  if (
    undeclared.npm.size ||
    undeclared.registry.size ||
    dangling.length ||
    unpinned.length ||
    missingTypes.length
  ) {
    problems.push(
      `  ${item.name}: ` +
        [
          undeclared.npm.size ? `undeclared dependencies ${[...undeclared.npm].join(", ")}` : "",
          undeclared.registry.size
            ? `undeclared registryDependencies ${[...undeclared.registry].join(", ")}`
            : "",
          dangling.length ? `registryDependencies with no item: ${dangling.join(", ")}` : "",
          unpinned.length ? `dependencies with no version range: ${unpinned.join(", ")}` : "",
          missingTypes.length
            ? `dependencies missing their type companion: ${missingTypes.join(", ")}`
            : "",
        ]
          .filter(Boolean)
          .join(" · ")
    );
  }
}

// --- audit 2: semantic type tokens own their line box (and some their weight) --
// `--text-body-lg` also carries `--text-body-lg--line-height`, so `text-body-lg
// leading-none` renders 1rem/1rem — the token's whole purpose, overridden. Same
// for the slash form (`text-body/relaxed`) and for a weight on a token that sets
// one (`text-caption font-normal` drops caption's 500).
const themeVars = items.find((i) => i.name === "theme")?.cssVars?.theme ?? {};
const typeTokens = Object.keys(themeVars)
  .filter((k) => k.startsWith("text-") && !k.includes("--"))
  .map((name) => name.replace(/^text-/, ""))
  // Longest first so the `$`-anchored alternation prefers `body-sm` over `body`.
  .sort((a, b) => b.length - a.length);
const weightTokens = new Set(
  typeTokens.filter((t) => `text-${t}--font-weight` in themeVars)
);

// One whitespace-separated class at a time, so any variant prefix is skipped
// whatever it contains (`group-data-[state=open]:leading-6`, `[&>p]:text-body`)
// and a color with an alpha (`text-foreground/60`) can't pose as a type token.
const TOKEN = new RegExp(`(?:^|:)text-(${typeTokens.join("|")})(/[^\\s:]+)?$`);
const LEADING = /(?:^|:)leading-[^\s:]+$/;
const WEIGHT =
  /(?:^|:)font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[[^\]]*\])$/;

// Which element a class lands on, so only classes that meet on the SAME element
// are compared. A selector-bearing prefix (`[&>span]:`, `**:`, `*:`) retargets
// the class at a descendant — calendar's `[&>span]:text-caption` beside a bare
// `font-normal` is two elements, and the span keeps the weight its own token
// sets. State prefixes (`hover:`, `group-data-[…]:`) stay on the element, so a
// `hover:leading-6` really does override the token's line box and still counts.
const elementOf = (cls) =>
  cls
    .split(":")
    .slice(0, -1)
    .filter((segment) => /[&*]/.test(segment))
    .join(":");

// Class expressions, not source lines. `cn("text-caption", "leading-none")`
// wrapped across two lines applies both classes at runtime, and a line-at-a-time
// scan waves it through — so consecutive string literals separated by nothing
// but whitespace and commas are audited as the one expression they compose into.
// (Classes that meet only across cva variants, or across files through a shared
// base like `buttonVariants`, are out of reach of any static grouping.)
function classExpressions(content) {
  const literals = [...content.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)];
  const expressions = [];
  let current = null;
  let prevEnd = -1;
  for (const m of literals) {
    const joins = prevEnd !== -1 && /^[\s,]*$/.test(content.slice(prevEnd, m.index));
    if (current && joins) {
      current.classes.push(m[1] ?? m[2] ?? "");
    } else {
      current = { index: m.index, classes: [m[1] ?? m[2] ?? ""] };
      expressions.push(current);
    }
    prevEnd = m.index + m[0].length;
  }
  return expressions;
}

const typeProblems = [];
for (const item of items) {
  for (const f of item.files ?? []) {
    const content = f.content ?? "";
    for (const expression of classExpressions(content)) {
      const classes = expression.classes.join(" ").split(/\s+/).filter(Boolean);
      const byElement = new Map();
      for (const cls of classes) {
        const element = elementOf(cls);
        if (!byElement.has(element)) byElement.set(element, []);
        byElement.get(element).push(cls);
      }
      const line = content.slice(0, expression.index).split("\n").length;
      const where = `  ${f.path}:${line} (${item.name})`;

      for (const [element, onElement] of byElement) {
        const tokenHit = onElement.map((c) => c.match(TOKEN)).find(Boolean);
        if (!tokenHit) continue;
        const [, token, modifier] = tokenHit;
        const on = element ? ` on \`${element}:\`` : "";
        if (modifier) {
          typeProblems.push(
            `${where}: text-${token}${modifier}${on} overrides the line-height the token owns`
          );
        } else if (onElement.some((c) => LEADING.test(c))) {
          typeProblems.push(
            `${where}: text-${token}${on} paired with a leading-* utility`
          );
        }
        if (weightTokens.has(token) && onElement.some((c) => WEIGHT.test(c))) {
          typeProblems.push(
            `${where}: text-${token}${on} paired with a font-weight it already sets`
          );
        }
      }
    }
  }
}

if (problems.length || typeProblems.length) {
  if (problems.length) {
    console.error(
      `check-registry — ${problems.length} item(s) don't match their manifest:\n` +
        problems.join("\n") +
        "\n\nDependencies are derived from imports in scripts/gen-registry.mjs — fix the derivation, not the JSON."
    );
  }
  if (typeProblems.length) {
    console.error(
      `check-registry — ${typeProblems.length} type-token override(s):\n` +
        typeProblems.join("\n") +
        "\n\nThe type tokens carry their own line-height and weight (design.md → Typography).\n" +
        "Drop the override; if a tighter line box is genuinely wanted, add a token for it in globals.css."
    );
  }
  process.exit(1);
}

console.log(
  `check-registry — ${items.length} built items declare every import at a pinned version ` +
    `with its types, every registry dependency resolves, and no source overrides a type token's line box`
);
