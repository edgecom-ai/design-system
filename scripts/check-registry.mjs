// Two audits of the BUILT registry, both failing the build:
//
// 1. Manifests — an item that imports something it doesn't declare, declares a
//    dependency without a version range, or declares a registry dependency the
//    registry never emits.
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
import { pkgName, UNPINNED } from "./lib/deps.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const builtDir = resolve(root, "public/r");

const problems = [];
const files = readdirSync(builtDir).filter((f) => f.endsWith(".json"));
const items = files.map((f) => JSON.parse(readFileSync(resolve(builtDir, f), "utf8")));
const known = new Set(items.map((i) => i.name));

for (const item of items) {
  const declared = item.dependencies ?? [];
  const deps = new Set(declared.map(pkgName));
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
  const unpinned = declared.filter((d) => pkgName(d) === d && !UNPINNED.has(d));

  if (undeclared.npm.size || undeclared.registry.size || dangling.length || unpinned.length) {
    problems.push(
      `  ${item.name}: ` +
        [
          undeclared.npm.size ? `undeclared dependencies ${[...undeclared.npm].join(", ")}` : "",
          undeclared.registry.size
            ? `undeclared registryDependencies ${[...undeclared.registry].join(", ")}`
            : "",
          dangling.length ? `registryDependencies with no item: ${dangling.join(", ")}` : "",
          unpinned.length ? `dependencies with no version range: ${unpinned.join(", ")}` : "",
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
  // Longest first: `text-body` must not match inside `text-body-sm`.
  .sort((a, b) => b.length - a.length)
  .map((name) => name.replace(/^text-/, ""));
const weightTokens = new Set(
  typeTokens.filter((t) => `text-${t}--font-weight` in themeVars)
);

// A utility, optionally variant-prefixed (`group-data-[x]:leading-6`) and
// optionally with a trailing modifier (`text-body/relaxed`).
const utility = (body) => new RegExp(`(?:^|[\\s"'\`])(?:[\\w[\\]-]+:)*${body}`);
const LEADING = utility("leading-[\\w./[\\]-]+");
const WEIGHT = utility(
  "font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\\[[^\\]]*\\])"
);

const typeProblems = [];
for (const item of items) {
  for (const f of item.files ?? []) {
    const lines = (f.content ?? "").split("\n");
    lines.forEach((line, i) => {
      const found = typeTokens.filter((t) =>
        utility(`text-${t}(?:/[\\w.[\\]-]+)?(?![\\w-])`).test(line)
      );
      if (!found.length) return;
      const token = found[0]; // longest match wins
      const where = `  ${f.path}:${i + 1} (${item.name})`;
      const sliced = utility(`text-${token}/[\\w.[\\]-]+`).test(line);
      if (sliced) {
        typeProblems.push(`${where}: text-${token}/… overrides the line-height the token owns`);
      } else if (LEADING.test(line)) {
        typeProblems.push(`${where}: text-${token} paired with a leading-* utility`);
      }
      if (weightTokens.has(token) && WEIGHT.test(line)) {
        typeProblems.push(`${where}: text-${token} paired with a font-weight it already sets`);
      }
    });
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
  `check-registry — ${items.length} built items declare every import at a pinned version, ` +
    `every registry dependency resolves, and no source overrides a type token's line box`
);
