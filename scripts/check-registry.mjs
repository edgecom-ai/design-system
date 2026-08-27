// Fails the registry build when a built item imports something its own manifest
// doesn't declare, or declares a registry dependency the registry never emits.
// `shadcn add <item>` installs exactly what the item declares, so an undeclared
// import ships a package that can't resolve in the consumer's tree (#35) — and a
// declared-but-missing sibling is a dependency the CLI follows to nothing.
//
// gen-registry derives both fields from the source, so this is a backstop
// against the derivation regressing (it did once, on quote style) and against
// `shadcn build` dropping a field on the way to public/r. It reads imports
// through the same scanner the generator uses (scripts/lib/imports.mjs) so the
// two can't disagree about what a file imports.

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { specifiersOf, classify } from "./lib/imports.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const builtDir = resolve(root, "public/r");

const problems = [];
const files = readdirSync(builtDir).filter((f) => f.endsWith(".json"));
const items = files.map((f) => JSON.parse(readFileSync(resolve(builtDir, f), "utf8")));
const known = new Set(items.map((i) => i.name));

for (const item of items) {
  const deps = new Set(item.dependencies ?? []);
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
      // "local" (@/lib/utils comes via the theme item) and "ambient" (React,
      // provided by the consuming app) are never declared.
    }
  }

  // A registryDependency with no item behind it breaks the install cascade just
  // as hard as a missing one.
  const dangling = [...registryDeps].filter((d) => !known.has(d));

  if (undeclared.npm.size || undeclared.registry.size || dangling.length) {
    problems.push(
      `  ${item.name}: ` +
        [
          undeclared.npm.size ? `undeclared dependencies ${[...undeclared.npm].join(", ")}` : "",
          undeclared.registry.size
            ? `undeclared registryDependencies ${[...undeclared.registry].join(", ")}`
            : "",
          dangling.length ? `registryDependencies with no item: ${dangling.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join(" · ")
    );
  }
}

if (problems.length) {
  console.error(
    `check-registry — ${problems.length} item(s) don't match their manifest:\n` +
      problems.join("\n") +
      "\n\nDependencies are derived from imports in scripts/gen-registry.mjs — fix the derivation, not the JSON."
  );
  process.exit(1);
}

console.log(
  `check-registry — ${items.length} built items declare every import, and every registry dependency resolves`
);
