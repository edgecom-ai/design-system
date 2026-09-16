// Builds the Claude Design bundle for the "Edgecom Energy Design System V2"
// project — the design-system context package the plan calls for.
//
// Everything here is DERIVED. The authorities are:
//   src/app/globals.css          tokens (light + dark)
//   design.md                    the design language and usage rules
//   src/app/sections.tsx         which components exist, their group + blurb
//   src/components/ui/*.tsx      cva base + variant class strings
//   src/docs/generated/api.ts    parts and props extracted by gen-api.mjs
//   out/_next/static/chunks/*.css  compiled Tailwind (tokens + utilities)
//
// It writes into .design-sync/bundle/:
//   _system.json          version, commit, digest — so a design can name what it was built against
//   SKILL.md              the invocable entry point (name: edgecom-design)
//   README.md             compiled from design.md
//   _base.css             compiled Tailwind + card layout helpers
//   foundations/*.html    colour / type / radius / elevation cards
//   components/*.html     one variant-matrix card per component
//   components/*.md       one spec per component
//
// The bundle is uploaded by DesignSync under a plan scoped to these paths, so a
// sync can never touch hand-authored `brand/**` material in the project.
//
// Previews are static HTML using the component's REAL utility classes plus the
// compiled stylesheet — no React, no browser, no dev server. A card therefore
// cannot drift from the primitive: if the cva changes, the card changes.

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, copyFileSync } from "node:fs"
import { resolve, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = resolve(root, ".design-sync/bundle")
const read = (p) => readFileSync(resolve(root, p), "utf8")

// --- git identity ------------------------------------------------------------
const git = (...a) => {
  try {
    return execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
  } catch {
    return null
  }
}

// --- inputs ------------------------------------------------------------------
const css = read("src/app/globals.css")
const designMd = read("design.md")
const sectionsSrc = read("src/app/sections.tsx")

// Same parser gen-registry.mjs / gen-design-md.mjs use.
function blockVars(re) {
  const m = css.match(re)
  if (!m) return {}
  const vars = {}
  for (const d of m[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[d[1]] = d[2].trim()
  return vars
}
const light = blockVars(/^:root\s*\{([\s\S]*?)\n\}/m)
const dark = blockVars(/^\.dark\s*\{([\s\S]*?)\n\}/m)

const tokenValue = (name) => {
  let v = light[name]
  for (let i = 0; i < 5 && v; i++) {
    const alias = v.match(/^var\(--([\w-]+)\)$/)
    if (!alias) break
    v = light[alias[1]]
  }
  return v
}

// --- sections (id -> label, group, description) ------------------------------
// Mirrors gen-llms.mjs: top-level fields are indented exactly four spaces.
function parseSections() {
  const lines = sectionsSrc.split("\n")
  const start = lines.findIndex((l) => l.includes("const sections: Section[]"))
  const out = []
  let cur = null
  let awaiting = false
  for (const l of lines.slice(start)) {
    const id = l.match(/^\s{4}id:\s*"([^"]+)"/)
    if (id) {
      cur = { id: id[1], label: id[1], group: null, description: "" }
      out.push(cur)
      awaiting = false
      continue
    }
    if (!cur) continue
    const lab = l.match(/^\s{4}label:\s*"([^"]+)"/)
    if (lab) { cur.label = lab[1]; continue }
    const grp = l.match(/^\s{4}group:\s*"([^"]+)"/)
    if (grp) { cur.group = grp[1]; continue }
    const dIn = l.match(/^\s{4}description:\s*"((?:[^"\\]|\\.)*)"/)
    if (dIn) { cur.description = dIn[1]; continue }
    if (/^\s{4}description:\s*$/.test(l)) { awaiting = true; continue }
    if (awaiting) {
      const piece = l.match(/^\s*"((?:[^"\\]|\\.)*)"/)
      if (piece) { cur.description += piece[1]; if (!l.trimEnd().endsWith("+")) awaiting = false; continue }
      awaiting = false
    }
  }
  return out.filter((s) => s.group)
}
const sections = parseSections()

// --- cva extraction ----------------------------------------------------------
// Pulls the base class string and each variant group's class strings straight
// out of the primitive, so a card renders what the component actually renders.
function braceBody(src, openIdx) {
  let depth = 0
  for (let i = openIdx; i < src.length; i++) {
    if (src[i] === "{") depth++
    else if (src[i] === "}") { depth--; if (depth === 0) return src.slice(openIdx + 1, i) }
  }
  return null
}

function extractCva(src) {
  const at = src.indexOf("cva(")
  if (at === -1) return null

  // base string: first quoted literal after cva(
  const afterOpen = src.slice(at + 4)
  const baseM = afterOpen.match(/^\s*("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/s)
  const base = baseM ? baseM[1].slice(1, -1).replace(/\s+/g, " ").trim() : ""

  const vIdx = src.indexOf("variants:", at)
  if (vIdx === -1) return { base, groups: {}, defaults: {} }
  const vBody = braceBody(src, src.indexOf("{", vIdx))
  if (!vBody) return { base, groups: {}, defaults: {} }

  const groups = {}
  // top-level keys of the variants object
  let depth = 0
  const lines = vBody.split("\n")
  let curGroup = null
  let groupBody = []
  for (const line of lines) {
    if (depth === 0) {
      const g = line.match(/^\s*"?([\w-]+)"?:\s*\{/)
      if (g) { curGroup = g[1]; groupBody = []; depth = 1; continue }
    } else {
      const opens = (line.match(/\{/g) || []).length
      const closes = (line.match(/\}/g) || []).length
      if (depth + opens - closes <= 0) {
        // close of this group
        groups[curGroup] = parseVariantEntries(groupBody.join("\n"))
        curGroup = null
        depth = 0
        continue
      }
      depth += opens - closes
      groupBody.push(line)
    }
  }

  const defaults = {}
  const dIdx = src.indexOf("defaultVariants:", at)
  if (dIdx !== -1) {
    const dBody = braceBody(src, src.indexOf("{", dIdx))
    if (dBody) for (const m of dBody.matchAll(/"?([\w-]+)"?:\s*"([^"]+)"/g)) defaults[m[1]] = m[2]
  }
  return { base, groups, defaults }
}

// `name: "classes"` / `"name": "classes"` / `name:\n  "classes"` — comments dropped.
function parseVariantEntries(body) {
  const clean = body.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "")
  const out = {}
  for (const m of clean.matchAll(/"?([\w-]+)"?:\s*("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/gs)) {
    out[m[1]] = m[2].slice(1, -1).replace(/\s+/g, " ").trim()
  }
  return out
}

// --- compiled Tailwind -------------------------------------------------------
function findCompiledCss() {
  const dir = resolve(root, "out/_next/static/chunks")
  if (!existsSync(dir)) return null
  const files = readdirSync(dir).filter((f) => f.endsWith(".css"))
  let best = null
  for (const f of files) {
    const p = join(dir, f)
    const body = readFileSync(p, "utf8")
    if (body.includes("--primary:") && body.includes(".bg-primary")) {
      if (!best || body.length > best.body.length) best = { path: p, body }
    }
  }
  return best
}

// --- card helpers ------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

function card({ group, name, subtitle, width = 760, height = 200, body }) {
  return `<!doctype html>
<!-- @dsCard group="${esc(group)}" name="${esc(name)}" subtitle="${esc(subtitle)}" viewport="${width}x${height}" --><html><head><meta charset="utf-8"><link rel="stylesheet" href="../_base.css"></head>
<body class="ds-card">
${body}
</body></html>
`
}

export { extractCva, parseSections }

// --- build -------------------------------------------------------------------
function build() {
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(resolve(outDir, "foundations"), { recursive: true })
  mkdirSync(resolve(outDir, "components"), { recursive: true })

  const compiled = findCompiledCss()
  if (!compiled) {
    console.error("gen-design-sync — no compiled stylesheet found in out/. Run `pnpm build` first.")
    process.exit(1)
  }

  // _base.css = compiled Tailwind + the small layout helpers the cards use.
  const helpers = `
/* --- design-sync card helpers (not part of the design system) --- */
html{background:var(--background)}
body.ds-card{margin:0;padding:20px;background:var(--background);color:var(--foreground);
  font-family:var(--font-sans),system-ui,sans-serif}
.ds-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.ds-col{display:flex;flex-direction:column;gap:14px}
.ds-label{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--muted-foreground);
  font-weight:500;min-width:104px}
.ds-line{display:flex;align-items:center;gap:12px}
.ds-sep{border-top:1px solid var(--border);padding-top:12px}
.ds-swatch{width:100%;height:44px;border-radius:var(--radius-md);border:1px solid var(--border)}
.ds-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:12px}
.ds-name{font-size:11px;color:var(--muted-foreground);margin-top:5px;font-family:var(--font-mono),monospace}
`
  writeFileSync(resolve(outDir, "_base.css"), compiled.body + helpers)

  // ---- _system.json ---------------------------------------------------------
  const sha = git("rev-parse", "HEAD")
  const tag = git("describe", "--tags", "--abbrev=0")
  const digest = createHash("sha256").update(css).update(designMd).digest("hex").slice(0, 16)
  const system = {
    schemaVersion: "1",
    name: "Edgecom Energy Design System",
    designSystemVersion: tag || "untagged",
    designSystemCommit: sha,
    designSystemDigest: digest,
    generatedAt: new Date().toISOString(),
    generator: "scripts/gen-design-sync.mjs",
    authority: "https://github.com/edgecom-ai/design-system",
    rules: "https://design.edgecom.ai/design.md",
    note: "Generated. Do not hand-edit anything outside brand/.",
  }
  writeFileSync(resolve(outDir, "_system.json"), JSON.stringify(system, null, 2) + "\n")

  // ---- SKILL.md + README.md -------------------------------------------------
  // The rules delivery. README is design.md's body verbatim — one authority,
  // compiled view — so a designer and a coding agent read the same document.
  const bodyAt = designMd.indexOf("# Edgecom Design System — Design Language & Usage")
  const rules = bodyAt === -1 ? designMd : designMd.slice(bodyAt)

  writeFileSync(
    resolve(outDir, "SKILL.md"),
    `---
name: edgecom-design
description: The Edgecom Energy product design system — OKLCH semantic tokens, the semantic type
  scale, light + dark, and the component registry behind design.edgecom.ai. Use this for any
  Edgecom application UI: dashboards, tables, forms, charts, settings. Read README.md before
  designing or generating anything.
user-invocable: true
---

# Edgecom Energy — product design system

**Generated from \`edgecom-ai/design-system\` at \`${system.designSystemVersion}\` (\`${(sha || "").slice(0, 7)}\`). Do not hand-edit.**
Version, commit and digest are in \`_system.json\` — cite them in anything you produce so it can
be checked against the system later.

## Read this first

\`README.md\` is the design language and the usage rules, verbatim from the authority at
https://design.edgecom.ai/design.md. It is required, not advisory.

## What is here

| Path | What |
|---|---|
| \`README.md\` | The design language and usage rules. |
| \`_system.json\` | Version, commit, digest. |
| \`foundations/\` | Colour, type scale, radius, elevation — rendered from the real tokens. |
| \`components/*.html\` | Preview cards, rendered with each primitive's actual classes. |
| \`components/*.md\` | Per-component spec: variants, sizes, defaults, install address. |
| \`_base.css\` | The compiled stylesheet. Link it in any artifact you author. |
| \`brand/\` | Hand-authored brand and marketing material. Not generated, not part of the product system. |

## Non-negotiables

- **Semantic tokens only.** Never a hex literal, never a px type size, never an invented token.
  If a control seems to need a new background, it is almost certainly \`--ghost-hover\`,
  \`--outline-surface\`/\`--outline-hover\` or \`--input-surface\`/\`--input-hover\`.
- **Light and dark, always.** Every token has both. Nothing ships light-only.
- **The semantic type scale**, never ad-hoc sizes. \`body-sm\` is single-line text inside a
  control; \`body\` is running prose. Never pair either with a \`leading-*\`.
- **Colour by meaning.** \`destructive\` means error or destructive action and is never a chart
  series. Commodity hues tag their commodity only.
- **Reuse the primitives.** If nothing fits, stop and ask — do not hand-roll a parallel version.

## Starting an artifact

\`\`\`html
<link rel="stylesheet" href="_base.css">
<!-- then use the real utility classes: bg-primary, text-body-sm, rounded-xl -->
\`\`\`
`,
  )

  writeFileSync(
    resolve(outDir, "README.md"),
    `<!-- Generated from design.md at ${system.designSystemVersion} (${(sha || "").slice(0, 7)}). Do not hand-edit — change design.md in the repo. -->

` +
      rules,
  )

  // ---- foundations ----------------------------------------------------------
  writeFoundations()

  // ---- components -----------------------------------------------------------
  const built = writeComponents()

  console.log(
    `gen-design-sync — ${built.cards} component cards, ${built.specs} specs, 4 foundations, ` +
      `${(compiled.body.length / 1024).toFixed(0)} KB base css → .design-sync/bundle/`,
  )
  return { system, ...built }
}

// --- foundations -------------------------------------------------------------
const COLOR_GROUPS = [
  ["Surfaces", ["background", "card", "popover", "elevated", "scrim"]],
  ["Brand / neutral", ["primary", "primary-emphasis", "primary-subtle", "secondary", "muted", "accent"]],
  ["Status", ["success", "warning", "info", "destructive"]],
  ["Status — subtle", ["success-subtle", "warning-subtle", "info-subtle", "destructive-subtle"]],
  ["Form / outline", ["border", "input", "ring"]],
  ["Interaction", ["ghost-hover", "outline-surface", "outline-hover", "input-surface", "input-hover"]],
  ["Relative surfaces", ["track", "track-active"]],
  ["Commodities", ["chart-electricity-500", "chart-water-500", "chart-gas-500", "chart-temperature-500", "chart-emissions-500", "chart-misc-500"]],
]

const TYPE_STEPS = ["caption", "body-sm", "body", "body-lg", "title", "heading", "display"]
const RADII = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]

function writeFoundations() {
  // colours
  const groups = COLOR_GROUPS.map(([label, keys]) => {
    const swatches = keys
      .filter((k) => tokenValue(k))
      .map(
        (k) =>
          `<div><div class="ds-swatch" style="background:var(--${k})"></div><div class="ds-name">--${k}</div></div>`,
      )
      .join("")
    return `<div><div class="ds-label" style="margin-bottom:8px">${esc(label)}</div><div class="ds-grid">${swatches}</div></div>`
  }).join("")
  writeFileSync(
    resolve(outDir, "foundations/colors.html"),
    card({
      group: "Foundations",
      name: "Semantic colours",
      subtitle: "Every token adapts light ↔ dark. Never hardcode a hex.",
      width: 860,
      height: 900,
      body: `<div class="ds-col">${groups}</div>`,
    }),
  )

  // typography
  const rows = TYPE_STEPS.map((t) => {
    const size = light[`text-${t}`] || ""
    const lh = light[`text-${t}--line-height`] || ""
    return `<div class="ds-line ds-sep"><span class="ds-label">${t}</span>
      <span class="text-${t}">Peak demand 412 kW</span>
      <span class="ds-name" style="margin-left:auto">${esc(size)} / ${esc(lh)}</span></div>`
  }).join("")
  writeFileSync(
    resolve(outDir, "foundations/typography.html"),
    card({
      group: "Foundations",
      name: "Type scale",
      subtitle: "Semantic steps only — each carries its own line-height and weight",
      width: 760,
      height: 420,
      body: `<div class="ds-col">${rows}
      <div class="ds-sep" style="color:var(--muted-foreground)" class="text-body">
        <span class="text-body"><code>body-sm</code> and <code>body</code> are the same size on different line boxes.
        Single-line text in a control takes <code>body-sm</code>; running prose takes <code>body</code>.
        Never pair either with a <code>leading-*</code>.</span></div></div>`,
    }),
  )

  // radius
  const radii = RADII.map(
    (r) =>
      `<div><div style="height:56px;background:var(--secondary);border:1px solid var(--border);border-radius:var(--radius-${r})"></div><div class="ds-name">radius-${r}</div></div>`,
  ).join("")
  writeFileSync(
    resolve(outDir, "foundations/radius.html"),
    card({
      group: "Foundations",
      name: "Radius scale",
      subtitle: "All derived from --radius. Cards xl, buttons/inputs md, badges sm.",
      width: 760,
      height: 190,
      body: `<div class="ds-grid">${radii}</div>`,
    }),
  )

  // elevation
  const surfaces = ["background", "card", "popover", "elevated"]
    .map(
      (s) =>
        `<div style="flex:1"><div style="height:72px;background:var(--${s});border:1px solid var(--border);border-radius:var(--radius-lg)"></div><div class="ds-name">--${s}</div></div>`,
    )
    .join("")
  writeFileSync(
    resolve(outDir, "foundations/elevation.html"),
    card({
      group: "Foundations",
      name: "Elevation",
      subtitle: "Surfaces stack by lightness — overlays sit above cards",
      width: 760,
      height: 190,
      body: `<div class="ds-row" style="align-items:stretch;gap:14px">${surfaces}</div>
      <div class="text-body" style="margin-top:14px;color:var(--muted-foreground)">In dark, <code>popover</code> (0.265) must stay lighter than <code>card</code> (0.205) or the overlay edge disappears. Scrims use <code>--scrim</code>.</div>`,
    }),
  )
}

// --- component cards + specs -------------------------------------------------
// Which element a variant row should render as, per component.
const SAMPLE = {
  button: (cls) => `<button class="${cls}">Save changes</button>`,
  badge: (cls) => `<span class="${cls}">Electricity</span>`,
  alert: (cls) => `<div class="${cls}" style="max-width:340px"><div>Meter offline since 14:02</div></div>`,
}

function writeComponents() {
  const uiDir = resolve(root, "src/components/ui")
  let cards = 0
  let specs = 0

  for (const s of sections) {
    if (s.group !== "Components") continue
    const file = resolve(uiDir, `${s.id}.tsx`)
    if (!existsSync(file)) continue
    const src = readFileSync(file, "utf8")
    const cva = extractCva(src)

    // spec — always
    const spec = [
      `# ${s.label}`,
      "",
      s.description,
      "",
      `**Registry item:** \`edgecom-ai/design-system/${s.id}\``,
      `**Install:** \`pnpm dlx shadcn@latest add edgecom-ai/design-system/${s.id}\``,
      `**Docs:** https://design.edgecom.ai/components/${s.id}/`,
      "",
    ]
    if (cva && Object.keys(cva.groups).length) {
      spec.push("## Variants", "")
      for (const [g, entries] of Object.entries(cva.groups)) {
        const opts = Object.keys(entries)
        if (!opts.length) continue
        const def = cva.defaults[g]
        spec.push(`- **${g}** — ${opts.map((o) => (o === def ? `\`${o}\` (default)` : `\`${o}\``)).join(", ")}`)
      }
      spec.push("")
    }
    spec.push(
      "## Rules",
      "",
      "Follow https://design.edgecom.ai/design.md. Use the variants above — never override the primitive's own classes, and never hand-roll a parallel version.",
      "",
    )
    writeFileSync(resolve(outDir, `components/${s.id}.md`), spec.join("\n"))
    specs++

    // card — only where we can render something truthful
    const sample = SAMPLE[s.id]
    if (!cva || !sample || !cva.groups.variant) continue
    const variants = Object.entries(cva.groups.variant)
    const rows = variants
      .map(
        ([nameV, cls]) =>
          `<div class="ds-line"><span class="ds-label">${esc(nameV)}</span>${sample(`${cva.base} ${cls}`)}</div>`,
      )
      .join("\n")
    let sizeRow = ""
    if (cva.groups.size) {
      const defV = cva.groups.variant[cva.defaults.variant] || ""
      sizeRow =
        `<div class="ds-line ds-sep" style="margin-top:6px"><span class="ds-label">sizes</span><div class="ds-row">` +
        Object.entries(cva.groups.size)
          .map(([, cls]) => sample(`${cva.base} ${defV} ${cls}`))
          .join("") +
        `</div></div>`
    }
    writeFileSync(
      resolve(outDir, `components/${s.id}.html`),
      card({
        group: "Components",
        name: s.label,
        subtitle: `${variants.length} variants${cva.groups.size ? ` · ${Object.keys(cva.groups.size).length} sizes` : ""}`,
        width: 780,
        height: Math.min(140 + variants.length * 44, 900),
        body: `<div class="ds-col">${rows}${sizeRow}</div>`,
      }),
    )
    cards++
  }
  return { cards, specs }
}

build()
