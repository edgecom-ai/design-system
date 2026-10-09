// Builds the design system as a Claude "Design System" artifact: the files a
// design canvas copies into itself, and the page a designer browses.
//
//   .design-sync/artifact/project/
//     README.md                     the instruction a design agent reads first
//     tokens.json                   every colour (light + dark), the type scale, the radii
//     guidelines/design.md          design.md, a further section of the page
//     components/bundle.js          one classic script assigning window.EdgecomDS
//     components/bundle.css         the compiled stylesheet (tokens + utilities)
//     components/index.d.ts         every component's props, as documentation
//     components/<Name>/README.md   per-component guide
//     components/<Name>/preview.html  live card, for the 77 authored previews
//     components/Cover/preview.html the system's cover (.design-sync/cover.html)
//     _system.json                  version, commit, digest — copied into every canvas
//     _manifest.example.json        the design manifest a canvas starts from
//     design-system.json            the index fields this build owns; the publish
//                                   step merges them into the live index
//
// Inputs, all regenerated before this runs (`pnpm design:build`, then the
// converter driver for the guides and types):
//   dist/index.js                         the package entry (`design:entry`)
//   .design-sync/.cache/styles.css        the stylesheet (`design:css`)
//   .design-sync/bundle/                  _system.json, _manifest.example.json (`design:sync`)
//   .design-sync/previews/*.tsx           authored preview cells
//   ds-bundle/components/general/<Name>/  the converter's guide (.prompt.md) and types (.d.ts)
//   public/tokens.json, src/app/globals.css
//
// The format is the Design System type's own (its SKILL.md and format.md):
// the caps below are its caps, and a build that would cross one fails here
// rather than at publish. The bundle is ours, not the converter's, because a
// canvas runs React 18 and the bundle carries the adapter that makes React 19
// components work there — see scripts/lib/design-bundle.mjs.
//
// Output is git-ignored. Run via `pnpm design:artifact`.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { buildDesignBundle, buildPreview } from "./lib/design-bundle.mjs"
import { parseSections } from "./lib/sections.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const out = resolve(root, ".design-sync/artifact")
const project = join(out, "project")
const NS = "EdgecomDS"
const TITLE = "Edgecom Energy Design System V3"

const inputs = {
  entry: resolve(root, "dist/index.js"),
  css: resolve(root, ".design-sync/.cache/styles.css"),
  system: resolve(root, ".design-sync/bundle/_system.json"),
  example: resolve(root, ".design-sync/bundle/_manifest.example.json"),
  previews: resolve(root, ".design-sync/previews"),
  cover: resolve(root, ".design-sync/cover.html"),
  converted: resolve(root, "ds-bundle/components/general"),
  conventions: resolve(root, ".design-sync/conventions.md"),
  designMd: resolve(root, "public/design.md"),
  tokens: resolve(root, "public/tokens.json"),
  globals: resolve(root, "src/app/globals.css"),
  sections: resolve(root, "src/app/sections.tsx"),
  contracts: resolve(root, "public/contracts/index.json"),
  config: resolve(root, ".design-sync/config.json"),
}
for (const [name, p] of Object.entries(inputs)) {
  if (name === "config") continue
  if (!existsSync(p)) {
    console.error(`gen-design-artifact: missing ${relative(root, p)} — run \`pnpm design:build\` and the converter driver first`)
    process.exit(1)
  }
}

// The Design System type's limits (format.md, SKILL.md).
const CAPS = {
  files: 1008,
  bundle: 6 * 1024 * 1024,
  css: 2 * 1024 * 1024,
  dts: 1.5 * 1024 * 1024,
  readme: 200 * 1024,
  guide: 64 * 1024,
  preview: 256 * 1024,
  tokens: 512 * 1024,
}

const written = new Map() // project path → bytes
const write = (path, text) => {
  const file = join(project, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, text)
  written.set(path, Buffer.byteLength(text))
}
const fail = (msg) => {
  console.error(`gen-design-artifact: ${msg}`)
  process.exit(1)
}
const read = (p) => readFileSync(p, "utf8")

rmSync(out, { recursive: true, force: true })
mkdirSync(project, { recursive: true })

const system = JSON.parse(read(inputs.system))

// ---- bundle ------------------------------------------------------------------
const { code, exports } = await buildDesignBundle({ entry: inputs.entry, namespace: NS, root })
if (/<\/script|<!--/i.test(code)) fail("components/bundle.js holds `</script` or `<!--`, which ends an inlined script")

// The component catalogue is the converter's: every component it wrote a guide
// and types for. Each must be a real export of the bundle we just built.
const converted = readdirSync(inputs.converted).filter((d) => statSync(join(inputs.converted, d)).isDirectory()).sort()
const exported = new Set(exports)
const missing = converted.filter((c) => !exported.has(c))
if (missing.length) fail(`the converter documents components the bundle does not export (stale ds-bundle/?): ${missing.join(", ")}`)
const undocumented = exports.filter((e) => /^[A-Z]/.test(e) && e !== "Recharts" && !converted.includes(e))
if (undocumented.length) console.warn(`gen-design-artifact: exported but not in the converter output (no guide): ${undocumented.join(", ")}`)

const header = { format: 4, namespace: NS, components: converted.map((name) => ({ name })) }
write("components/bundle.js", `/* @ds-bundle: ${JSON.stringify(header)} */\n${code}`)

// ---- stylesheet ----------------------------------------------------------------
const css = read(inputs.css)
if (/<\/style/i.test(css)) fail("components/bundle.css holds `</style`")
write("components/bundle.css", css)

// ---- types -------------------------------------------------------------------
// Documentation, not type-checked: the page reads `<Name>Props` from here.
const reactImport = /^import \* as React from 'react';\n/m
let dts = "import * as React from 'react';\n"
for (const c of converted) {
  const p = join(inputs.converted, c, `${c}.d.ts`)
  if (existsSync(p)) dts += `\n${read(p).replace(reactImport, "").trim()}\n`
}
write("components/index.d.ts", dts)

// ---- guides ------------------------------------------------------------------
// The converter's guide opens with a line about its own layout ("Use via …
// bundle loaded from the root `_ds_bundle.js`"); the page takes a guide's first
// sentence as the component's summary, so that line goes and a part with no
// prose of its own is introduced by the contract that owns it.
const contracts = JSON.parse(read(inputs.contracts)).components ?? []
const sections = parseSections(read(inputs.sections))
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
// The barrel renames a few exports (motion-tabs' Tabs → MotionTabs): file stem
// → { name in the file: name on the global }.
const fromBundle = {}
for (const m of read(inputs.entry).matchAll(/^export \{([^}]*)\} from "\.\.\/src\/components\/ui\/([\w-]+)";$/gm)) {
  for (const spec of m[1].split(",")) {
    const [from, to] = spec.trim().split(/\s+as\s+/)
    if (to) (fromBundle[m[2]] ??= {})[from] = to
  }
}
const renamedFrom = new Map(Object.entries(fromBundle).flatMap(([stem, names]) => Object.entries(names).map(([from, to]) => [to, { stem, from }])))
// Part → owning contract, by the name the part has on the global: motion-tabs'
// TabsList is MotionTabsList there, so plain TabsList stays tabs'.
const ownerOf = new Map()
for (const k of contracts) {
  for (const part of k.parts ?? []) {
    const global = fromBundle[k.id]?.[part] ?? part
    if (!ownerOf.has(global)) ownerOf.set(global, k)
  }
}
const contractOf = (name) => {
  const r = renamedFrom.get(name)
  if (r) return [contracts.find((k) => k.id === r.stem), r.from]
  const byId = contracts.find((k) => k.id === kebab(name) || (k.aliases ?? []).includes(kebab(name)))
  return [contracts.find((k) => k.label === name) ?? ownerOf.get(name) ?? byId, name]
}
// A contract's summary, else the blurb of its docs page. A page of its own (or
// one that installs it alone) describes it; a page shared with other
// primitives is quoted as that page's, so it is not read as this one's.
const blurb = (id) => {
  const own = sections.find((s) => s.id === id) ?? sections.find((s) => s.install.length === 1 && s.install[0] === id)
  const shared = own ? null : sections.find((s) => s.install.includes(id))
  const text = (own ?? shared)?.description.replace(/\\"/g, '"')
  if (!text) return null
  return own ? text : `Documented on the ${shared.label} page: ${text}`
}
const summaryOf = (name) => {
  const [k, local] = contractOf(name)
  const text = k ? k.summary || blurb(k.id) : blurb(kebab(name))
  if (!text) return null
  if (!k || k.label === name || (k.parts ?? [])[0] === local) return text
  const root = renamedFrom.has(name) ? fromBundle[k.id]?.[k.parts[0]] ?? k.parts[0] : k.parts[0]
  return `A part of ${k.label}. ${text} See \`components/${root}/README.md\`.`
}
for (const c of converted) {
  const p = join(inputs.converted, c, `${c}.prompt.md`)
  let body = existsSync(p) ? read(p) : ""
  body = body.replace(/^.*from edgecom-design-system\. Use via .*\n+/, "")
  body = body.replace(/\(bundle loaded from the root `_ds_bundle\.js`\)/g, "")
  if (!/^# /m.test(body.split("\n").find((l) => l.trim()) ?? "")) {
    const summary = summaryOf(c) ?? `${c}, from the Edgecom design system.`
    body = `# ${c}\n\n${summary}\n\n${body}`
  }
  write(`components/${c}/README.md`, `${body.trim()}\n`)
}

// ---- previews ----------------------------------------------------------------
// A preview importing a renamed file's own names gets the renamed exports
// (`fromBundle`, above).
const sectionGroup = new Map()
for (const s of sections) {
  for (const id of [s.id, ...s.install]) if (!sectionGroup.has(id)) sectionGroup.set(id, s.group)
}
const config = existsSync(inputs.config) ? JSON.parse(read(inputs.config)) : {}

// Mounts every PascalCase export of the preview module as a labelled cell. The
// frame preloads React, the stylesheet and the bundle and marks the theme on
// <html data-theme>; the system's dark tokens hang off `.dark`, so the class
// follows the attribute.
const mount = `;(function () {
  var html = document.documentElement
  function theme() { html.classList.toggle("dark", html.getAttribute("data-theme") === "dark") }
  theme(); new MutationObserver(theme).observe(html, { attributes: true, attributeFilter: ["data-theme"] })
  var h = React.createElement, P = window.__dsPreview || {}, g = document.getElementById("cells")
  var names = Object.keys(P).filter(function (k) { return /^[A-Z]/.test(k) && typeof P[k] === "function" })
  var single = g.getAttribute("data-mode") === "single"
  names.forEach(function (k, i) {
    if (single && i > 0) return
    var cell = document.createElement("section")
    cell.className = single ? "" : "rounded-lg border border-border p-3 min-w-0"
    if (!single) { var t = document.createElement("h4"); t.className = "mb-2 text-caption text-muted-foreground"; t.textContent = k; cell.appendChild(t) }
    var slot = document.createElement("div"); cell.appendChild(slot); g.appendChild(cell)
    try { ReactDOM.createRoot(slot).render(h(P[k])) } catch (e) { slot.textContent = "Preview failed: " + (e && e.message || e) }
  })
})()`

const previews = readdirSync(inputs.previews).filter((f) => f.endsWith(".tsx")).map((f) => f.replace(/\.tsx$/, "")).sort()
for (const name of previews) {
  if (!converted.includes(name)) fail(`preview ${name}.tsx has no component of that name in the bundle`)
  const script = await buildPreview({ entry: join(inputs.previews, `${name}.tsx`), namespace: NS, root, fromBundle })
  if (/<\/script|<!--/i.test(script)) fail(`preview ${name} holds \`</script\` or \`<!--\``)
  const o = config.overrides?.[name] ?? {}
  const [vw, vh] = (o.viewport ?? "").split("x").map(Number)
  const single = o.cardMode === "single"
  const group = sectionGroup.get(kebab(name)) ?? "Components"
  const marker = `<!-- @dsCard group="${group}"${vh ? ` height=${vh}` : ""}${vw ? ` width=${vw}` : ""} -->`
  const layout = single
    ? `style="min-height:${vh || 320}px"`
    : `class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));align-items:start"`
  write(
    `components/${name}/preview.html`,
    `${marker}
<!doctype html>
<html><head><meta charset="utf-8"><title>${name}</title></head>
<body class="bg-background text-foreground" style="margin:0;padding:16px">
<div id="cells" data-mode="${single ? "single" : "grid"}" ${layout}></div>
<script>
${script}
${mount}
</script>
</body></html>
`,
  )
}

// The cover: authored, not generated (.design-sync/cover.html). Its folder
// stays bare — a guide or a bundle export beside it would make it a component.
if (converted.includes("Cover")) fail("a component named Cover would turn the cover into an ordinary card")
write("components/Cover/preview.html", read(inputs.cover))

// ---- tokens ------------------------------------------------------------------
const published = JSON.parse(read(inputs.tokens)).tokens
const byId = new Map(published.map((t) => [t.id, t]))
const globals = read(inputs.globals)

// Colour values the page can read: OKLCH as written, an alias of another colour
// token as `{name}`. `transparent` and `color-mix(…, transparent)` it cannot;
// both are written as the colour they compute to.
const OKLCH = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/
const alpha = (a) => (a == null ? 1 : a.endsWith("%") ? parseFloat(a) / 100 : parseFloat(a))
const fmt = (n) => String(Math.round(n * 1000) / 1000)
function colour(value, theme, seen = new Set()) {
  if (value == null) return null
  const v = value.trim()
  if (v === "transparent") return "oklch(0 0 0 / 0)"
  const ref = v.match(/^var\(--([\w-]+)\)$/)
  if (ref) return byId.get(ref[1])?.type === "color" || byId.has(ref[1]) ? `{${ref[1]}}` : null
  const mix = v.match(/^color-mix\(in oklab,\s*var\(--([\w-]+)\)\s+([\d.]+)%,\s*transparent\)$/)
  if (mix) {
    if (seen.has(mix[1])) return null
    const base = byId.get(mix[1])
    const resolved = colour(theme === "dark" ? (base?.dark ?? base?.light) : base?.light, theme, new Set([...seen, mix[1]]))
    const m = resolved?.match(OKLCH)
    if (!m) return null
    return `oklch(${m[1]} ${m[2]} ${m[3]} / ${fmt(alpha(m[4]) * (parseFloat(mix[2]) / 100) * 100)}%)`
  }
  return OKLCH.test(v) ? v : null
}

const FAMILY_NOTE = {
  brand: "Brand colour",
  surface: "Surface",
  neutral: "Neutral",
  status: "Status colour — by meaning only (success, warning, info, destructive)",
  interaction: "Interaction state of quiet controls",
  "relative-surface": "Surface one step from its container",
  chart: "Chart series colour — data only, never UI chrome",
  legacy: "Legacy palette — migration only, for ported plots",
  sidebar: "Sidebar",
}
// Only utilities the compiled stylesheet holds: a class that is not in it does
// nothing, so a note naming one would teach a silent no-op.
const compiled = (cls) => new RegExp(`\\.${cls.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}[\\s{,:]`).test(css)
const usage = (t) => {
  const utils = ["bg", "text", "border", "fill", "stroke"].map((p) => `${p}-${t.id}`).filter(compiled)
  const util = utils.length ? ` Utilities: ${utils.map((u) => `\`${u}\``).join(", ")}.` : ` In markup: \`var(--${t.id})\`.`
  const alias = t.aliasOf ? ` Follows \`${t.aliasOf}\`.` : ""
  return `${FAMILY_NOTE[t.family] ?? "Token"}.${alias}${util}`
}

const colours = []
const unplaced = []
for (const t of published) {
  if (t.family === "typography" || t.family === "radius") continue
  const light = colour(t.light, "light")
  const dark = t.dark == null ? null : colour(t.dark, "dark")
  if (!light || (t.dark != null && !dark)) {
    unplaced.push(t.id)
    continue
  }
  colours.push({ name: t.id, value: dark && dark !== light ? { light, dark } : light, usage: usage(t) })
}
if (unplaced.length) fail(`tokens with no value the page can read: ${unplaced.join(", ")}`)
const colourNames = new Set(colours.map((c) => c.name))
for (const c of colours) {
  for (const v of typeof c.value === "string" ? [c.value] : Object.values(c.value)) {
    const a = v.match(/^\{([\w-]+)\}$/)
    if (a && !colourNames.has(a[1])) fail(`colour ${c.name} aliases ${a[1]}, which is not a colour token`)
  }
}

// The type scale lives in @theme as --text-<step> plus its --line-height,
// --font-weight and --letter-spacing companions.
const styles = []
for (const m of globals.matchAll(/^\s*--text-([\w-]+):\s*([^;]+);/gm)) {
  if (m[1].includes("--")) continue
  const step = m[1]
  const part = (k) => globals.match(new RegExp(`--text-${step}--${k}:\\s*([^;]+);`))?.[1].trim()
  styles.push({
    name: step,
    fontSize: m[2].trim(),
    lineHeight: part("line-height"),
    fontWeight: Number(part("font-weight") ?? 400),
    ...(part("letter-spacing") ? { letterSpacing: part("letter-spacing") } : {}),
    usage: `\`text-${step}\` — carries its own line height and weight; never pair with \`leading-*\`.`,
  })
}
if (styles.length < 7) fail(`expected the 7-step type scale in globals.css, found ${styles.length}`)

const stack = (id) => byId.get(id)?.light.replace(/\s+/g, " ").trim()
const families = { sans: stack("font-sans"), mono: stack("font-mono") }
for (const [k, v] of Object.entries(families)) if (!v || v.length > 200 || /[;{}<>\\()]/.test(v)) fail(`font stack ${k} is not one the page can read`)

// Radius: --radius plus the @theme steps derived from it.
const base = parseFloat(byId.get("radius").light)
const radii = [{ name: "radius", value: `${base}rem`, usage: "The base radius every step derives from." }]
for (const m of globals.matchAll(/^\s*--radius-([\w-]+):\s*([^;]+);/gm)) {
  const k = m[2].match(/calc\(var\(--radius\)\s*\*\s*([\d.]+)\)/)
  const value = k ? `${fmt(base * parseFloat(k[1]))}rem` : m[2].trim() === "var(--radius)" ? `${base}rem` : null
  if (!value) fail(`radius-${m[1]} is not a step of --radius`)
  radii.push({ name: `radius-${m[1]}`, value, usage: `\`rounded-${m[1]}\`.` })
}

const tokens = {
  name: TITLE,
  version: 1,
  meta: {
    source: "github",
    repo: "edgecom-ai/design-system",
    ref: `main@${system.designSystemCommit.slice(0, 7)}`,
    paths: { tokens: ["src/app/globals.css"] },
    synced: system.generatedAt,
  },
  color: { themes: [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }], tokens: colours },
  type: { fonts: [], families, groups: [{ name: "Type scale", family: "sans", styles }] },
  radius: { tokens: radii },
}
write("tokens.json", `${JSON.stringify(tokens, null, 2)}\n`)

// ---- README, sections, identity --------------------------------------------
write("README.md", read(inputs.conventions))
write("guidelines/design.md", read(inputs.designMd))
write("_system.json", read(inputs.system))
write("_manifest.example.json", read(inputs.example))

// ---- index -------------------------------------------------------------------
write(
  "design-system.json",
  `${JSON.stringify(
    {
      v: 3,
      layout: "files",
      title: TITLE,
      namespace: NS,
      libraries: [
        { name: "react", version: "18" },
        { name: "react-dom", version: "18" },
      ],
      docs: { readme: "project/README.md", sections: ["project/guidelines/design.md"] },
      lastChange: {
        by: "Claude",
        at: new Date().toISOString(),
        via: `Claude Code · edgecom-ai/design-system@${system.designSystemCommit.slice(0, 7)}`,
        note: `Built from ${system.designSystemVersion} (${system.designSystemCommit.slice(0, 7)}), digest ${system.designSystemDigest}.`,
      },
    },
    null,
    2,
  )}\n`,
)

// ---- caps --------------------------------------------------------------------
const over = []
const cap = (path, limit) => (written.get(path) ?? 0) > limit && over.push(`${path} ${written.get(path)} > ${limit} bytes`)
cap("components/bundle.js", CAPS.bundle)
cap("components/bundle.css", CAPS.css)
cap("components/index.d.ts", CAPS.dts)
cap("README.md", CAPS.readme)
cap("tokens.json", CAPS.tokens)
for (const p of written.keys()) {
  if (/^components\/\w+\/README\.md$/.test(p)) cap(p, CAPS.guide)
  if (/^components\/\w+\/preview\.html$/.test(p)) cap(p, CAPS.preview)
}
if (written.size > CAPS.files) over.push(`${written.size} files > ${CAPS.files}`)
if (over.length) fail(`over the Design System type's caps:\n  ${over.join("\n  ")}`)

const total = [...written.values()].reduce((a, b) => a + b, 0)
console.log(
  `gen-design-artifact — ${written.size} files, ${(total / 1024 / 1024).toFixed(2)} MiB → ${relative(root, project)}/\n` +
    `  bundle ${(written.get("components/bundle.js") / 1024 / 1024).toFixed(2)} MiB, ${converted.length} components, ${previews.length} previews, ` +
    `${colours.length} colours, ${styles.length} type steps, ${radii.length} radii`,
)
