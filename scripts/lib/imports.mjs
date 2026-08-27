// The one import scanner. Both the registry generator (which derives an item's
// dependencies from its imports) and the registry checker (which re-audits the
// built items against what they declared) read module specifiers through this
// module — two scanners would drift, and the drift is exactly the bug that let
// #35 ship: a specifier one side sees and the other doesn't is a dependency
// that gets declared but not checked, or checked but not declared.

// The npm package a specifier resolves to (`@dnd-kit/core/foo` -> `@dnd-kit/core`).
export function pkgOf(spec) {
  if (spec.startsWith("@")) {
    const [scope, name] = spec.split("/");
    return `${scope}/${name}`;
  }
  return spec.split("/")[0];
}

// Every module specifier a file imports from. Both quote styles count: the
// vendored components are single-quoted, and a scanner that saw only double
// quotes silently produced an empty dependency set for them (#35).
export function specifiersOf(src, source = "imports") {
  const specs = new Set();
  // `import x from "y"` / `export * from "y"`
  for (const m of src.matchAll(/\bfrom\s*(['"])([^'"]+)\1/g)) specs.add(m[2]);
  // dynamic `import("y")`
  for (const m of src.matchAll(/\bimport\s*\(\s*(['"])([^'"]+)\1\s*\)/g)) specs.add(m[2]);
  // side-effect `import "y"`
  for (const m of src.matchAll(/\bimport\s*(['"])([^'"]+)\1/g)) specs.add(m[2]);

  // Guard against the next parser gap: any import/export-from statement whose
  // specifier we failed to capture is a dependency we would silently drop.
  // (A declaration — `export const x = "…from…"` — is excluded by the `[^=]*?`.)
  const statement = /^\s*(?:import|export)\b[^=]*?\bfrom\s*(['"`])([^'"`]*)\1|^\s*import\s*\(?\s*(['"`])([^'"`]*)\3/;
  for (const line of src.split("\n")) {
    const m = line.match(statement);
    if (!m) continue;
    const spec = m[2] ?? m[4];
    if (!specs.has(spec)) {
      throw new Error(`${source}: could not parse the module specifier in: ${line.trim()}`);
    }
  }
  return specs;
}

// What a specifier means to the registry. `kind`:
//   "ui"      a sibling component -> a registryDependency
//   "hook"    a hook              -> a registryDependency
//   "local"   another local file  -> nothing (@/lib/utils ships with the theme)
//   "ambient" provided by the consuming app (React) -> nothing
//   "pkg"     an npm package      -> a dependency
export function classify(spec) {
  if (spec.startsWith("@/components/ui/")) {
    return { kind: "ui", name: spec.replace("@/components/ui/", "").split("/")[0] };
  }
  if (spec.startsWith("@/hooks/")) {
    return { kind: "hook", name: spec.replace("@/hooks/", "").split("/")[0] };
  }
  if (spec.startsWith("@/") || spec.startsWith(".") || spec.startsWith("/")) {
    return { kind: "local", name: spec };
  }
  if (/^(react|react-dom)(\/|$)/.test(spec)) {
    return { kind: "ambient", name: spec };
  }
  return { kind: "pkg", name: pkgOf(spec) };
}
