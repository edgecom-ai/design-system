// Emits one HTML file per route, so every URL the site publishes resolves to a
// real file on GitHub Pages — which has no server-side fallback for a SPA.
//
// This reproduces exactly what the Next static export produced. Next's
// `output: "export"` did not prerender content here either: `DocsShell` is a
// client component and the `[group]/[slug]` page returned `null`, so the
// exported HTML was the app shell and every section rendered client-side. (Said
// plainly at the top of scripts/verify-docs.mjs: "the page shells are empty and
// every section renders client-side".) So shell-per-route is parity, not a
// regression — and `pnpm verify:docs` is what proves the routes actually render,
// in a real browser, as it did before.
//
// Routes come from the same generated list the Next build's
// `generateStaticParams` used (scripts/gen-routes.mjs), so llms.txt and the
// emitted files cannot disagree.
//
//   out/index.html                            ->  /
//   out/{group}/{slug}/index.html             ->  /{group}/{slug}/
//   out/statistics-component-NN/index.html    ->  standalone block previews
//
// Output: files written into out/. Run after `vite build`.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "out");
const shellPath = join(outDir, "index.html");

if (!existsSync(shellPath)) {
  console.error("prerender — out/index.html is missing; run `vite build` first");
  process.exit(1);
}
const shell = readFileSync(shellPath, "utf8");

// The docs routes, from the generated list. Read as text rather than imported:
// routes.ts is TypeScript, and this script runs in plain node.
const routesTs = readFileSync(
  resolve(root, "src/docs/generated/routes.ts"),
  "utf8",
);
// Anchor on the `= [` that opens the array literal. Neither the first "[" in
// the file nor the first after the declaration name works: both land in the
// `{ group: string; slug: string }[]` type annotation.
const assign = /=\s*\[/.exec(routesTs);
if (!assign) {
  console.error("prerender — no array literal found in routes.ts; run `pnpm docs:gen`");
  process.exit(1);
}
const open = assign.index + assign[0].indexOf("[");
const json = routesTs.slice(open, routesTs.lastIndexOf("]") + 1);
/** @type {{ group: string, slug: string }[]} */
const docsRoutes = JSON.parse(json);
if (docsRoutes.length === 0) {
  console.error("prerender — routes.ts parsed to zero routes; run `pnpm docs:gen`");
  process.exit(1);
}

// The standalone block previews, discovered rather than listed, so adding one
// directory is all it takes. Keep in sync with src/router.tsx.
const blockPreviews = readdirSync(resolve(root, "src/app"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith("statistics-component-"))
  .map((d) => d.name)
  .sort();

const paths = [
  ...docsRoutes.map((r) => `${r.group}/${r.slug}`),
  ...blockPreviews,
];

for (const p of paths) {
  const dir = join(outDir, p);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), shell);
}

console.log(
  `prerender — ${paths.length + 1} HTML files (1 root + ${docsRoutes.length} docs + ${blockPreviews.length} block previews)`,
);
