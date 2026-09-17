// Builds the package entry the Claude Design converter (`/design-sync`) bundles:
//
//   dist/index.js       ESM barrel re-exporting every primitive in src/components/ui
//   dist/index.d.ts     the matching type barrel
//   dist/types/**       .d.ts emitted by `tsc -p tsconfig.design-sync.json`
//
// Why this exists: the repo is a shadcn registry, not a library — it ships
// sources, not a built package. The converter can synthesize an entry from
// src/ on its own, but then it has no declaration files to read and every
// component's props contract comes out as `[key: string]: unknown`. That
// contract is what the design agent codes against, so it has to be real.
//
// Two things the barrel handles that a plain `export *` would get wrong:
//   - Name collisions. `motion-tabs.tsx` exports Tabs/TabsList/TabsTrigger/
//     TabsContent like `tabs.tsx` does; `export *` from both makes esbuild drop
//     the ambiguous names silently. Colliding names are re-exported under the
//     file's PascalCase name as prefix (Tabs → MotionTabs, TabsList →
//     MotionTabsList), which is also what the docs call the item.
//   - `@/…` imports in the emitted .d.ts. tsc does not rewrite path aliases,
//     and the converter's type project has none, so they are rewritten to
//     relative paths after emit.
//
// dist/ is git-ignored build output. Run via `pnpm design:build`.

import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const uiDir = resolve(root, "src/components/ui")
const dist = resolve(root, "dist")

const pascal = (s) => s.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase())

// --- export lists per primitive -----------------------------------------------
// Shorter stems first, so the canonical file owns the plain names and the
// variant file (`motion-tabs` after `tabs`) is the one that gets aliased.
const files = readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx"))
  .sort((a, b) => a.length - b.length || a.localeCompare(b))
// → [{ name, isType }]. `type X` specifiers belong in the .d.ts barrel only —
// a plain .js entry can't carry them.
const exportsOf = (file) => {
  const src = readFileSync(join(uiDir, file), "utf8")
  const seen = new Map()
  for (const m of src.matchAll(/^export \{([^}]*)\}/gm)) {
    for (const part of m[1].split(",")) {
      const t = part.trim()
      if (!t) continue
      const isType = /^type\s+/.test(t)
      const name = t.replace(/^type\s+/, "").split(/\s+as\s+/).pop()
      if (name) seen.set(name, isType)
    }
  }
  for (const m of src.matchAll(/^export (?:function|const|class) (\w+)/gm)) seen.set(m[1], false)
  for (const m of src.matchAll(/^export (?:type|interface) (\w+)/gm)) seen.set(m[1], true)
  // `export default X` (multi-select.tsx) is invisible to `export *` — surface it by name.
  const def = src.match(/^export default (\w+)/m)?.[1]
  return { entries: [...seen].map(([name, isType]) => ({ name, isType })), def }
}

const taken = new Map() // name → file that owns it
const jsLines = []
const dtsLines = []
const aliased = []
for (const file of files) {
  const stem = file.replace(/\.tsx$/, "")
  const { entries, def } = exportsOf(file)
  if (def && !taken.has(def)) {
    taken.set(def, file)
    jsLines.push(`export { default as ${def} } from "../src/components/ui/${stem}";`)
    dtsLines.push(`export { default as ${def} } from "./types/components/ui/${stem}";`)
  }
  const clashes = entries.filter((e) => taken.has(e.name))
  if (!clashes.length) {
    for (const e of entries) taken.set(e.name, file)
    jsLines.push(`export * from "../src/components/ui/${stem}";`)
    dtsLines.push(`export * from "./types/components/ui/${stem}";`)
    continue
  }
  // Prefix every clashing name with the file's PascalCase name, trimming the
  // file's own root export from the front so Tabs → MotionTabs, not MotionTabsTabs.
  const prefix = pascal(stem)
  const rootName = entries.filter((e) => !e.isType).map((e) => e.name).sort((a, b) => a.length - b.length)[0]
  const js = []
  const dts = []
  for (const e of entries) {
    let spec = e.name
    if (clashes.includes(e)) {
      const alias = prefix + (e.name.startsWith(rootName) ? e.name.slice(rootName.length) : e.name)
      aliased.push(`${e.name} → ${alias} (${file})`)
      taken.set(alias, file)
      spec = `${e.name} as ${alias}`
    } else {
      taken.set(e.name, file)
    }
    dts.push(e.isType ? `type ${spec}` : spec)
    if (!e.isType) js.push(spec)
  }
  jsLines.push(`export { ${js.join(", ")} } from "../src/components/ui/${stem}";`)
  dtsLines.push(`export { ${dts.join(", ")} } from "./types/components/ui/${stem}";`)
}

// Runtime helpers the design system expects its host to call, re-exported so
// a consumer that only has the bundle can reach them: `toast()` drives the
// `Toaster` primitive and must be the SAME sonner instance the bundle mounts.
const helpers = [['toast', 'sonner']]
for (const [name, from] of helpers) {
  if (taken.has(name)) continue
  taken.set(name, from)
  jsLines.push(`export { ${name} } from "${from}";`)
  dtsLines.push(`export { ${name} } from "${from}";`)
}
// recharts as a namespace: `ChartContainer` and the chart primitives share a
// React context, so a consumer of the bundle must draw with the SAME recharts
// copy the bundle carries — `window.EdgecomDS.Recharts.AreaChart`, never its own.
taken.set('Recharts', 'recharts')
jsLines.push('export * as Recharts from "recharts";')
dtsLines.push('export * as Recharts from "recharts";')

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })
const banner = "// Generated by scripts/gen-design-entry.mjs — the design-system package entry. Do not hand-edit.\n"
writeFileSync(join(dist, "index.js"), banner + jsLines.join("\n") + "\n")
writeFileSync(join(dist, "index.d.ts"), banner + dtsLines.join("\n") + "\n")

// --- declarations --------------------------------------------------------------
execFileSync("pnpm", ["exec", "tsc", "-p", "tsconfig.design-sync.json"], { cwd: root, stdio: "inherit" })

// tsc keeps `@/x` specifiers verbatim; rewrite them to relative paths so a
// consumer without our path alias (the converter's ts-morph project) resolves them.
const typesRoot = join(dist, "types")
let rewritten = 0
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith(".d.ts")) {
      const before = readFileSync(p, "utf8")
      const after = before.replace(/(["'])@\/([^"']+)\1/g, (_, q, spec) => {
        let rel = relative(dirname(p), join(typesRoot, spec)).split("\\").join("/")
        if (!rel.startsWith(".")) rel = `./${rel}`
        rewritten++
        return `${q}${rel}${q}`
      })
      if (after !== before) writeFileSync(p, after)
    }
  }
}
if (!existsSync(typesRoot)) throw new Error("tsc emitted nothing to dist/types")
walk(typesRoot)

console.log(
  `gen-design-entry — ${files.length} primitives, ${taken.size} exports` +
    (aliased.length ? ` (${aliased.length} aliased: ${aliased.join(", ")})` : "") +
    `, ${rewritten} alias imports rewritten → dist/`,
)
