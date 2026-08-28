// How a derived package dependency is written into a registry manifest.
//
// The derivation gives a bare package name, and a bare name is what `shadcn
// add` hands the consumer's package manager — so the consumer installs
// whatever `latest` happens to be the day they run it, not the version the
// component was written against. That is how `resizable` broke: it was authored
// against react-resizable-panels v3, v4 renamed `PanelGroup`/`PanelResizeHandle`
// to `Group`/`Separator`, and every fresh install stopped compiling (#40).
//
// So every dependency ships with the range THIS repo builds and tests against.
// An upstream major then becomes a deliberate registry change (bump here,
// migrate the component, regenerate) instead of a silent break in someone
// else's `tsc` run.
//
// Shared with scripts/check-registry.mjs, which re-audits the built items — the
// generator and the audit must agree on how a dependency is spelled.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const pkgJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const declaredRanges = { ...pkgJson.devDependencies, ...pkgJson.dependencies };

// Dependencies deliberately shipped unpinned. `react-dom`'s version is dictated
// by the consumer's own `react`, never by ours (this repo pins React exactly for
// the docs site) — pinning it would let a component install downgrade a
// consumer's React DOM out from under them.
export const UNPINNED = new Set(["react-dom"]);

// The package a manifest dependency refers to: "zod@^3.25.76" -> "zod",
// "@dnd-kit/core@^6.3.1" -> "@dnd-kit/core".
export function pkgName(dep) {
  const at = dep.lastIndexOf("@");
  return at > 0 ? dep.slice(0, at) : dep;
}

// A package name as it should appear in a manifest's `dependencies`.
export function withVersion(pkg) {
  if (UNPINNED.has(pkg)) return pkg;
  const declared = declaredRanges[pkg];
  if (declared) return `${pkg}@${declared}`;
  // Not a direct dependency of this repo (nothing today) — fall back to the
  // version actually installed rather than shipping a bare name.
  try {
    const { version } = JSON.parse(
      readFileSync(resolve(root, "node_modules", pkg, "package.json"), "utf8")
    );
    return `${pkg}@^${version}`;
  } catch {
    return pkg;
  }
}
