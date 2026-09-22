// Builds the Claude Design bundle for the "Edgecom Energy Design System V2"
// project — the design-system context package the plan calls for.
//
// Everything here is DERIVED. The authorities are:
//   src/app/globals.css          tokens (light + dark)
//   design.md                    the design language and usage rules
//   src/app/sections.tsx         which components exist, their group + blurb
//   src/components/ui/*.tsx      cva base + variant class strings
//   src/docs/generated/api.ts    parts and props extracted by gen-api.mjs
//
// It writes into .design-sync/bundle/:
//   _system.json          version, commit, digest — so a design can name what it was built against
//   _manifest.example.json  the design handoff manifest a design ships beside itself (plan §5.4),
//                         copied from the published example so it carries the same identity
//   SKILL.md              the invocable entry point (name: edgecom-design)
//   README.md             compiled from design.md
//   _base.css             the Edgecom tokens + only the utilities the cards use (lib/base-css.mjs)
//   foundations/*.html    colour / type / radius / elevation cards
//   components/*.html     one variant-matrix card per component
//   components/*.md       one spec per component
//
// The bundle is uploaded by DesignSync under a plan scoped to these paths, so a
// sync can never touch hand-authored `brand/**` material in the project.
//
// Previews are static HTML using the component's REAL utility classes, and
// _base.css is compiled from globals.css against exactly those classes — no
// React, no browser, no dev server, no prior `pnpm build`. A card therefore
// cannot drift from the primitive: if the cva changes, the card changes, and
// the stylesheet follows.

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, copyFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

import { readBlocks } from "./lib/tokens.mjs"
import { buildBaseCss, probeUtilities, scanClasses } from "./lib/base-css.mjs"
import { extractCva } from "./lib/cva.mjs"
import { parseSections, sectionPath } from "./lib/sections.mjs"
import { systemIdentity } from "./lib/system.mjs"
import { PUBLISHED, urlOf, schemaUrl } from "./lib/publish.mjs"

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

const { light, theme } = readBlocks(css)

// Edgecom's `@theme inline` tokens that are tokens in their own right — the
// type scale, the radius scale, motion — as opposed to the `--color-x: var(--x)`
// aliases that only exist to give Tailwind utilities. `inline` means Tailwind
// never emits any of them as a CSS variable, so the cards (and a designer
// reading _base.css) would not see them unless they are declared explicitly.
const themeTokens = Object.fromEntries(
  Object.entries(theme).filter(([, v]) => {
    const alias = v.match(/^var\(--([\w-]+)\)$/)
    return !(alias && (alias[1] in light || alias[1] in theme))
  }),
)

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
const sections = parseSections(sectionsSrc)

// --- generated API (parts / props) -------------------------------------------
// gen-api.mjs writes a plain JSON object literal, so slice it out and parse it
// rather than importing TypeScript.
function loadApi() {
  try {
    const src = read("src/docs/generated/api.ts")
    const start = src.indexOf("{", src.indexOf("generatedApi"))
    return JSON.parse(src.slice(start, src.lastIndexOf("}") + 1))
  } catch {
    return {}
  }
}
const api = loadApi()

// --- curated prose -----------------------------------------------------------
// curated.ts is hand-written TS (unquoted keys, wrapped strings). Only the
// one-line `summary` per component is pulled out; anything trickier stays in
// the repo where it is already rendered on the docs site.
function loadCuratedSummaries() {
  const out = {}
  try {
    const src = read("src/docs/curated.ts")
    for (const m of src.matchAll(/^ {2}([\w-]+):\s*\{/gm)) {
      const key = m[1]
      const slice = src.slice(m.index, m.index + 1200)
      const sum = slice.match(/summary:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)
      if (sum) out[key] = sum[1].replace(/\\"/g, '"')
    }
  } catch {
    /* optional */
  }
  return out
}
const curated = loadCuratedSummaries()

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


// --- build -------------------------------------------------------------------
async function build() {
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(resolve(outDir, "foundations"), { recursive: true })
  mkdirSync(resolve(outDir, "components"), { recursive: true })

  // The whole point of _system.json is that a design can name the exact system
  // it was built against. That is only true if the tree is clean — a bundle cut
  // from uncommitted work stamps a commit whose content it does not match.
  const dirty = git("status", "--porcelain", "--untracked-files=no")
  if (dirty) {
    const files = dirty.split("\n").length
    if (process.env.DESIGN_SYNC_ALLOW_DIRTY) {
      console.warn(
        `gen-design-sync — WARNING: ${files} uncommitted file(s); _system.json will name a commit ` +
          `whose content this bundle does not match.`,
      )
    } else {
      console.error(
        `gen-design-sync — refusing to build: ${files} uncommitted file(s).\n` +
          `  _system.json stamps HEAD, so a bundle cut from a dirty tree claims a version it is not.\n` +
          `  Commit first, or set DESIGN_SYNC_ALLOW_DIRTY=1 for a throwaway preview build.`,
      )
      process.exit(1)
    }
  }

  // ---- _system.json ---------------------------------------------------------
  const sha = git("rev-parse", "HEAD")
  // The same version and digest every published artifact carries
  // (scripts/lib/system.mjs) — this stamp used to hash globals.css + design.md
  // on its own, so nothing served could ever equal it and the version check a
  // consumer runs against contracts/index.json could not pass.
  const identity = systemIdentity()
  const system = {
    schemaVersion: "1",
    name: "Edgecom Energy Design System",
    designSystemVersion: identity.version,
    designSystemCommit: sha,
    designSystemDigest: identity.digest,
    generatedAt: new Date().toISOString(),
    generator: "scripts/gen-design-sync.mjs",
    authority: "https://github.com/edgecom-ai/design-system",
    rules: "https://design.edgecom.ai/design.md",
    contracts: urlOf(PUBLISHED.contractsIndex),
    manifestSchema: schemaUrl("design-manifest.schema.json"),
    manifestExample: urlOf(PUBLISHED.designManifestExample),
    manifestValidator: urlOf(PUBLISHED.checkDesignManifest),
    note: "Generated. Do not hand-edit anything outside brand/. Every design ships a <Name>.manifest.json beside it — start from _manifest.example.json.",
  }
  writeFileSync(resolve(outDir, "_system.json"), JSON.stringify(system, null, 2) + "\n")

  // ---- _manifest.example.json -----------------------------------------------
  // The published example, verbatim, so the design agent has a complete manifest
  // to copy without leaving the project. It is a docs:gen output and carries the
  // identity of the system it was generated from; if that is not the identity
  // this bundle stamps, the two were built from different trees.
  const examplePath = resolve(root, PUBLISHED.designManifestExample)
  if (!existsSync(examplePath)) {
    console.error(`gen-design-sync — ${PUBLISHED.designManifestExample} is missing. Run \`pnpm docs:gen\` first.`)
    process.exit(1)
  }
  const exampleDigest = JSON.parse(readFileSync(examplePath, "utf8")).designSystemDigest
  if (exampleDigest !== identity.digest) {
    console.error(
      `gen-design-sync — ${PUBLISHED.designManifestExample} names digest ${exampleDigest}, the tree is ${identity.digest}. ` +
        `Run \`pnpm docs:gen\` so the example and _system.json agree.`,
    )
    process.exit(1)
  }
  copyFileSync(examplePath, resolve(outDir, "_manifest.example.json"))

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
Version, commit and digest are in \`_system.json\`. Every design you produce ships a manifest
beside it that cites them — see *Every design ships a manifest* below.

## Read this first

\`README.md\` is the design language and the usage rules, verbatim from the authority at
https://design.edgecom.ai/design.md. It is required, not advisory.

## What is here

| Path | What |
|---|---|
| \`README.md\` | The design language and usage rules. |
| \`_system.json\` | Version, commit, digest. |
| \`_manifest.example.json\` | A complete design manifest, already naming this system's version and digest. Copy it beside every design. |
| \`foundations/\` | Colour, type scale, radius, elevation — rendered from the real tokens. |
| \`components/*.html\` | Preview cards, rendered with each primitive's actual classes. |
| \`components/*.md\` | Per-component spec: variants, sizes, defaults, install address. |
| \`_base.css\` | The stylesheet the cards render with: every Edgecom token (\`:root\` light, \`.dark\` overrides) and only the utilities the cards use. Read it for token names and values. |
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

## Presenting a design

- **A portal page renders inside \`ApplicationShell\`** — pass \`nav\`, \`activeItem\`, \`user\` and
  \`buildings\`, and the page as its children. Never hand-build a sidebar and top bar from
  \`Sidebar*\` parts; every portal screen shares one frame.
- **One screen per design file, responsive.** The phone layout is the same file at a phone
  width (preview width 390), never a phone frame drawn beside the desktop on one canvas.
- **State and theme are the Design Component's props** (\`data-props\`: \`state\` as
  \`live | loading | empty | error\`, \`theme\` as \`light | dark\`), switched from the props panel —
  never an on-canvas harness bar above the page.
- **One \`size\` per toolbar.** \`Input\`, \`SelectTrigger\` and \`Button\` share \`default\` (2rem) and
  \`sm\` (1.75rem); a row mixes neither.
- **Icons are lucide.** Inline the icon's 24×24 path at \`size-4\` with \`stroke="currentColor"\`
  and name it on the element as \`data-lucide="bell-ring"\`, so the implementer installs the same
  icon from \`lucide-react\`.

## Every design ships a manifest

A rendered design carries no version and no component identity, so beside every design file you
produce, write one: \`<Name>.manifest.json\` next to \`<Name>.dc.html\`. Start from
\`_manifest.example.json\` — it is complete and already names this system's version and digest.

- \`designSystemVersion\` and \`designSystemDigest\` are copied from \`_system.json\`. Never type them.
  Where \`_system.json\` is not beside you, copy the pair from ${system.manifestExample},
  which is stamped with the current one.
- One entry in \`components\` per design-system element on the screen: a kebab-case \`instanceId\`
  that you also put on the element as \`data-instance="…"\` — on every declared instance, including
  elements your logic creates (pass \`"data-instance"\` as a prop); the registry \`component\` id
  exactly as its spec is named (\`alert-dialog\`, not \`AlertDialog\`); the \`variants\` it sets, by
  axis (\`{ "variant": "outline", "size": "sm" }\`); the \`parts\` it composes. Variants are only the
  axes the spec lists — \`size\` is an axis on every component that offers one; a prop such as
  \`collapsible\` or \`compact\` is not a variant and is not recorded, and a component with no axes
  gets no \`variants\` at all. A component inside another is its own entry — a \`Field\` in a
  \`Sheet\` is a \`field\` instance, not a part of \`sheet\`. An instance's \`states\` are the screen
  states it takes part in (\`loading\`, \`empty\`, \`error\`, \`success\`, \`disabled\`), never a
  control's own state such as checked.
- \`tokens\` lists every token the design reaches for directly, by id (\`primary\`, not \`--primary\`).
  Scale steps — \`radius-md\`, \`text-body\`, \`rounded-full\` — are utilities, not tokens; never list them.
- \`viewports\` needs \`mobile\` and \`desktop\`; \`themes\` needs \`light\` and \`dark\`; \`states\` needs
  \`loading\`, \`empty\`, \`error\` and \`success\`. A design missing any of them is not finished.
- \`interactions\` says what each control does, naming other instances by id.
  \`approvedExceptions\` is the only place a deviation from the rules may live: \`rule\`, \`reason\`,
  \`approvedBy\` — someone who has approved it; "pending" is a deviation to report, not an
  exception — and optionally \`instanceId\` and \`approvedOn\`. No other fields.

The manifest is the first thing a coding agent reads: it verifies the version, fetches each
component's contract, checks every variant and token against the system, and joins every
\`instanceId\` to its \`data-instance\` in the markup. Every line the validator prints is a defect.
Schema: ${system.manifestSchema} · validator: ${system.manifestValidator}

## Starting an artifact

\`\`\`html
<link rel="stylesheet" href="_base.css">
<!-- colour, radius and spacing by token: background:var(--primary); border-radius:var(--radius-md) -->
<!-- type by step: class="text-body-sm" … class="text-display" -->
\`\`\`

\`_base.css\` is not a full Tailwind build — it holds the tokens and the type-scale classes, plus
whatever the cards happen to use. Style everything else with \`var(--token)\`, never with a
Tailwind class name you have not seen in the file, and never with a literal value.
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

  // ---- _base.css ------------------------------------------------------------
  // Compiled last, from the cards just written: the Edgecom :root/.dark tokens,
  // then only the utilities those cards use, with every Tailwind internal
  // resolved away so Claude Design's token manifest reads Edgecom's system and
  // nothing else. See lib/base-css.mjs for why that matters.
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
  const htmlDocs = []
  for (const dir of ["foundations", "components"]) {
    for (const f of readdirSync(resolve(outDir, dir))) {
      if (f.endsWith(".html")) htmlDocs.push(readFileSync(resolve(outDir, dir, f), "utf8"))
    }
  }
  // A radius step design.md documents but @theme inline does not author (`lg`)
  // renders Tailwind's default. The card must show what `rounded-lg` really
  // renders, so the value is read back from the compiler, not from the docs.
  const missing = RADII.filter((r) => !themeTokens[`radius-${r}`])
  const probed = await probeUtilities(
    css,
    resolve(root, "src/app"),
    Object.fromEntries(missing.map((r) => [`radius-${r}`, [`rounded-${r}`, "border-radius"]])),
  )
  for (const [name, value] of Object.entries(probed)) themeTokens[name] = value

  const { css: baseCss, report } = await buildBaseCss({
    globalsCss: css,
    base: resolve(root, "src/app"),
    elements: scanClasses(htmlDocs).elements,
    themeTokens,
    helpers,
  })
  writeFileSync(resolve(outDir, "_base.css"), baseCss)
  for (const d of report.dropped) console.warn(`gen-design-sync — WARNING: unresolvable, dropped: ${d}`)

  // ---- _overlay.json --------------------------------------------------------
  // Two shapes of destination project exist, and the bundle serves both.
  //
  // A *standalone* project is one this generator owns end to end — everything
  // below is uploaded, and the cards here are all the cards there are.
  //
  // An *overlay* target is a project the official Claude Design converter has
  // already populated: it brings its own `components/**` (one directory per
  // component, with real `.d.ts` and a rendered card), `guidelines/**`,
  // `_preview/**`, `_vendor/**`, `styles.css` and its own `README.md`. Uploading
  // ours into `components/` would collide with that tree for nothing — the specs
  // already reach it by another route, since the converter's config points its
  // `docsDir` at `.design-sync/bundle/components`. What the converter has no
  // equivalent of is the authored layer: the skill entry point, the provenance
  // stamp, and the foundations cards with the stylesheet they link.
  //
  // Emitted rather than remembered so the upload plan is derived from the build.
  const overlay = {
    note: "Paths to upload into a project the Claude Design converter already populates. The rest of this bundle is for a standalone project only.",
    writes: ["SKILL.md", "_system.json", "_manifest.example.json", "_base.css", "foundations/**", "_ds_needs_recompile"],
    uploadLast: "_ds_needs_recompile",
    standaloneOnly: ["README.md", "components/**"],
    reason: {
      "components/**": "the converter owns components/; our specs reach it through its docsDir instead",
      "_manifest.example.json": "the design handoff manifest a design ships beside itself, stamped with the same identity as _system.json",
      "README.md": "the converter builds its own from conventions.md — don't clobber it",
      "_ds_needs_recompile": "without it the upload never reaches the card index or the token manifest — see below",
    },
  }
  writeFileSync(resolve(outDir, "_overlay.json"), JSON.stringify(overlay, null, 2) + "\n")

  // ---- _ds_needs_recompile --------------------------------------------------
  // The platform compiles its own card index and token manifest during a
  // self-check, and an upload does not run it. What runs it is someone opening
  // the project *while this marker is present*; the app deletes the marker when
  // the check completes.
  //
  // That is the difference between the two projects this bundle has been sent
  // to. The converter writes this marker, so its manifest recompiled the first
  // time anyone opened it — 328 cards, all 118 Edgecom tokens, one theme. This
  // generator never wrote one, so the project it built has never recompiled and
  // still publishes the token list from a stylesheet replaced two PRs ago:
  // ~250 Tailwind internals and 89 utility classes misread as themes.
  //
  // An upload without this marker is therefore invisible. Upload it LAST, after
  // every other file, so the check never runs against a half-written bundle.
  writeFileSync(resolve(outDir, "_ds_needs_recompile"), JSON.stringify({ by: "edgecom-design-sync" }) + "\n")

  console.log(
    `gen-design-sync — ${built.cards} component cards, ${built.specs} specs, 4 foundations, ` +
      `_base.css ${(baseCss.length / 1024).toFixed(0)} KB (${report.edgecomTokens} tokens, ` +
      `${report.utilities} utilities from ${report.candidates} class names` +
      `${report.composed.length ? `, ${report.composed.length} composed` : ""}) → .design-sync/bundle/\n` +
      `  overlay upload: ${overlay.writes.join(" ")}\n` +
      `  ${overlay.uploadLast} goes last — without it the platform never recompiles`,
  )
  return { system, overlay, ...built }
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
    const size = theme[`text-${t}`] || ""
    const lh = theme[`text-${t}--line-height`] || ""
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
  alert: (cls) => `<div class="${cls}" style="max-width:360px"><div>Meter offline since 14:02</div></div>`,
  banner: (cls) => `<div class="${cls}" style="max-width:420px">Interval data import finished</div>`,
  empty: (cls) => `<div class="${cls}" style="max-width:300px">No meters on this site yet</div>`,
  skeleton: (cls) => `<div class="${cls}" style="width:200px;height:16px"></div>`,
  toggle: (cls) => `<button class="${cls}">Step</button>`,
  item: (cls) => `<div class="${cls}" style="max-width:360px">Bishops Gate substation</div>`,
}

// The rules the Phase 0 audit found being broken, attached to the component they
// govern so a designer meets them at the point of use rather than in a long doc.
// Per-component usage rules come from the contracts (src/docs/generated/
// contracts.json), which is where authored component guidance lives now. They
// were a map in this file, which meant the rule a designer reads in the Claude
// Design spec and the contract an implementing agent reads could disagree with
// nothing to catch it.
const contractRules = (() => {
  const doc = JSON.parse(read("src/docs/generated/contracts.json"))
  return Object.fromEntries(doc.contracts.filter((c) => c.rules.length).map((c) => [c.id, c.rules]))
})()

function writeComponents() {
  const uiDir = resolve(root, "src/components/ui")
  let cards = 0
  let specs = 0

  for (const s of sections) {
    // Any group: a Blocks page that documents a primitive is its spec too.
    const file = resolve(uiDir, `${s.id}.tsx`)
    if (!existsSync(file)) continue
    const src = readFileSync(file, "utf8")
    const cva = extractCva(src)

    // spec — always
    const a = api[s.id] || {}
    const spec = [
      `# ${s.label}`,
      "",
      curated[s.id] || s.description,
      "",
      `**Registry item:** \`edgecom-ai/design-system/${s.id}\``,
      `**Install:** \`pnpm dlx shadcn@latest add edgecom-ai/design-system/${s.id}\``,
      // The page may sit in any group — the application shell is under Blocks.
      `**Docs:** https://design.edgecom.ai${sectionPath(s)}/`,
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
    if (a.parts && a.parts.length) {
      spec.push("## Parts", "", a.parts.map((x) => `- \`${x}\``).join("\n"), "")
    }
    if (a.props && a.props.length) {
      spec.push("## Props", "", "| Part | Prop | Type | Default |", "|---|---|---|---|")
      for (const pr of a.props) {
        spec.push(`| \`${pr.part}\` | \`${pr.name}\` | \`${pr.type}\` | ${pr.default ? `\`${pr.default}\`` : "—"} |`)
      }
      spec.push("")
    }
    if (a.base) {
      spec.push(`Built on [${a.base.name}](${a.base.url}).`, "")
    }
    const hasVariants = cva && Object.keys(cva.groups).length
    spec.push("## Rules", "")
    if (contractRules[s.id]) spec.push(...contractRules[s.id].map((r) => `- ${r}`), "")
    spec.push(
      hasVariants
        ? "Follow https://design.edgecom.ai/design.md. Use the variants above — never override the primitive's own classes, and never hand-roll a parallel version."
        : "Follow https://design.edgecom.ai/design.md. Compose the parts above — never override the primitive's own classes, and never hand-roll a parallel version.",
      "",
    )
    writeFileSync(resolve(outDir, `components/${s.id}.md`), spec.join("\n"))
    specs++

    // card — only where we can render something truthful
    const sample = SAMPLE[s.id]
    if (!cva || !sample) continue
    // Most components name the group `variant`; some name it for what it varies
    // (skeleton: `animation`). Fall back to the first non-size group.
    const groupName = cva.groups.variant
      ? "variant"
      : Object.keys(cva.groups).find((g) => g !== "size" && Object.keys(cva.groups[g]).length)
    if (!groupName) continue
    const variants = Object.entries(cva.groups[groupName])
    if (!variants.length) continue
    const rows = variants
      .map(
        ([nameV, cls]) =>
          `<div class="ds-line"><span class="ds-label">${esc(nameV)}</span>${sample(`${cva.base} ${cls}`)}</div>`,
      )
      .join("\n")
    let sizeRow = ""
    if (cva.groups.size) {
      const defV = cva.groups[groupName][cva.defaults[groupName]] || ""
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
        subtitle: `${variants.length} ${groupName}${variants.length === 1 ? "" : "s"}${cva.groups.size ? ` · ${Object.keys(cva.groups.size).length} sizes` : ""}`,
        width: 780,
        height: Math.min(140 + variants.length * 44, 900),
        body: `<div class="ds-col">${rows}${sizeRow}</div>`,
      }),
    )
    cards++
  }
  return { cards, specs }
}

await build()
