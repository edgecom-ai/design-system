// Emits the component contracts to src/docs/generated/contracts.json (plan §5.2).
//
// The primitives stay the authority. This is the compiled view of them: the
// thing a schema can validate, an agent can read instead of design.md, and the
// Claude Design bundle can generate its specs from — so the three cannot
// disagree about a component without CI failing.
//
// Derived fields (variants, tokens, states, responsive, parts, props) come out
// of the source every run. Authored fields (purpose, selection criteria,
// compositions, anti-patterns) come from src/docs/contracts.json, which is
// hand-written and is the only place a human adds to a contract.
//
// The same run publishes the consumer-facing copies under public/ (plan §5.2):
// the whole document, one file per contract, and a compact index for
// resolving a designed element to a registry item. A coding agent in a
// consuming app can only reach design.edgecom.ai, and a contract it cannot
// fetch is one it infers from the catalogue instead — which is the visual
// reverse-engineering the contracts exist to remove.
//
// Run by docs:gen. CI regenerates and fails on a diff.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, copyFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { readBlocks } from "./lib/tokens.mjs"
import { parseSections } from "./lib/sections.mjs"
import { buildContracts, OVERLAY_KEYS, ALIAS_FILE } from "./lib/contracts.mjs"
import { freshness, forced } from "./lib/stale.mjs"
import { PUBLISHED, urlOf, contractUrl, schemaUrl } from "./lib/publish.mjs"
import { systemIdentity, systemSources } from "./lib/system.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const read = (p) => readFileSync(resolve(root, p), "utf8")
const uiDir = resolve(root, "src/components/ui")

const OVERLAY = "src/docs/contracts.json"
const OUT = "src/docs/generated/contracts.json"

// The published copies. The per-contract files are enumerated from the
// sections so the stamp sees them; a contract that disappears takes its file
// with it (see the prune below), so the stamp can never be satisfied by a
// leftover.
const publishedFiles = (ids) => [
  PUBLISHED.contracts,
  PUBLISHED.contractsIndex,
  `${PUBLISHED.schemasDir}/contracts.schema.json`,
  ...ids.map((id) => `${PUBLISHED.contractsDir}/${id}.json`),
]

const inputs = [
  "src/app/globals.css",
  "src/app/sections.tsx",
  "src/docs/curated.ts",
  "src/docs/generated/api.ts",
  OVERLAY,
  "scripts/gen-contracts.mjs",
  "scripts/lib/contracts.mjs",
  "scripts/lib/cva.mjs",
  "scripts/lib/sections.mjs",
  "scripts/lib/tokens.mjs",
  "scripts/lib/system.mjs",
  // The digest is the whole system's, so any system source regenerates this.
  ...systemSources(),
  ...readdirSync(uiDir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => `src/components/ui/${f}`),
]

// --- inputs ------------------------------------------------------------------
const sections = parseSections(read("src/app/sections.tsx"))

const stamp = freshness({
  name: "contracts",
  inputs: [...inputs, "scripts/lib/publish.mjs", "schemas/contracts.schema.json"],
  outputs: [OUT, ...publishedFiles(sections.filter((s) => s.group === "Components").map((s) => s.id))],
})
if (stamp.fresh && !forced()) {
  console.log("gen-contracts — up to date — skipped")
  process.exit(0)
}

// gen-api writes a plain JSON object literal, so slice it out rather than
// importing TypeScript for a file that is generated anyway.
const apiSrc = read("src/docs/generated/api.ts")
const api = JSON.parse(apiSrc.slice(apiSrc.indexOf("{", apiSrc.indexOf("generatedApi")), apiSrc.lastIndexOf("}") + 1))

// curated.ts is hand-written TypeScript. Node strips the types on import, which
// is exact where a regex over `parts: { ... }` would be a guess.
let curated
try {
  ;({ curatedApi: curated } = await import(new URL("../src/docs/curated.ts", import.meta.url).href))
} catch (err) {
  console.error(
    `gen-contracts — could not import src/docs/curated.ts (${err.code ?? err.message}).\n` +
      `  This needs Node with TypeScript type stripping (>= 22.18). CI pins Node 22.`,
  )
  process.exit(1)
}

const overlay = JSON.parse(read(OVERLAY))

// --- validate the overlay ----------------------------------------------------
// It is hand-written, so a typo in an id or a key would otherwise vanish
// silently into a contract that simply lacks the guidance someone wrote.
const sectionIds = new Set(sections.map((s) => s.id))
const problems = []
for (const [id, entry] of Object.entries(overlay)) {
  if (id.startsWith("$")) continue
  if (!sectionIds.has(id)) {
    // Distinguish a typo from the real gap. A primitive with no section still
    // ships — gen-registry reads the whole directory, so it has a registry item
    // and installs fine — but it has no docs page, no catalogue entry, and
    // nothing for a contract's `docs` URL to point at.
    problems.push(
      existsSync(resolve(uiDir, `${ALIAS_FILE[id] ?? id}.tsx`))
        ? `"${id}" has a primitive and a registry item but no section in src/app/sections.tsx, so it has no docs page for a contract to point at. Give it a section, or park the guidance under a $-prefixed key.`
        : `unknown component id "${id}"`,
    )
  } else if (!existsSync(resolve(uiDir, `${ALIAS_FILE[id] ?? id}.tsx`))) {
    problems.push(`"${id}" has no primitive in src/components/ui`)
  }
  for (const k of Object.keys(entry)) {
    if (!OVERLAY_KEYS.includes(k)) problems.push(`"${id}" has unknown key "${k}"`)
  }
}
if (problems.length) {
  console.error(`gen-contracts — ${OVERLAY} is invalid:\n` + problems.map((p) => `    ${p}`).join("\n"))
  process.exit(1)
}

// --- build -------------------------------------------------------------------
const css = read("src/app/globals.css")
const { light, theme } = readBlocks(css)

const contracts = buildContracts({
  sections,
  readPrimitive: (p) => (existsSync(resolve(root, p)) ? read(p) : null),
  api,
  curated,
  overlay,
  tokenNames: [...Object.keys(light), ...Object.keys(theme)],
})

// Identity is the digest of the whole system — not HEAD, and not of this
// artifact's inputs alone. A commit SHA would change on every commit and make a
// committed copy impossible to keep parity-clean; a per-artifact digest was an
// honest hash that nothing else could ever equal, so the version check a
// consumer runs against a design project's _system.json could not pass. One
// value, computed in scripts/lib/system.mjs, stamped everywhere.
const system = systemIdentity()

const authored = contracts.filter((c) => c.authored)

const doc = {
  $schema: "../../../schemas/contracts.schema.json",
  version: system.version,
  digest: system.digest,
  sources: ["src/components/ui/*.tsx", "src/app/sections.tsx", "src/docs/curated.ts", OVERLAY],
  generator: "scripts/gen-contracts.mjs",
  counts: {
    total: contracts.length,
    authored: authored.length,
    withVariants: contracts.filter((c) => c.variants.length).length,
    withBaseUi: contracts.filter((c) => c.base).length,
    tokenReferences: contracts.reduce((n, c) => n + c.tokens.length, 0),
  },
  contracts: contracts.sort((a, b) => a.id.localeCompare(b.id)),
}

mkdirSync(resolve(root, dirname(OUT)), { recursive: true })
writeFileSync(resolve(root, OUT), JSON.stringify(doc, null, 2) + "\n")

// --- publish -----------------------------------------------------------------
// The document at a stable URL. The repo copy's `$schema` is a relative path;
// the served copy points at the served schema, which is the address the
// schema's own `$id` already claims.
const write = (p, data) => {
  mkdirSync(resolve(root, dirname(p)), { recursive: true })
  writeFileSync(resolve(root, p), JSON.stringify(data, null, 2) + "\n")
}
mkdirSync(resolve(root, PUBLISHED.schemasDir), { recursive: true })
copyFileSync(
  resolve(root, "schemas/contracts.schema.json"),
  resolve(root, PUBLISHED.schemasDir, "contracts.schema.json"),
)
const provenance = { version: doc.version, digest: doc.digest }
write(PUBLISHED.contracts, { ...doc, $schema: schemaUrl("contracts.schema.json") })

// One file per contract, so an agent resolving one designed element fetches
// one contract — about 3 KB — rather than the whole set.
const dir = resolve(root, PUBLISHED.contractsDir)
mkdirSync(dir, { recursive: true })
const wanted = new Set(contracts.map((c) => `${c.id}.json`))
wanted.add("index.json")
for (const f of readdirSync(dir)) {
  if (f.endsWith(".json") && !wanted.has(f)) unlinkSync(resolve(dir, f))
}
for (const c of contracts) {
  write(`${PUBLISHED.contractsDir}/${c.id}.json`, { ...provenance, contract: c })
}

// The index is the search surface: enough to pick a component and its variant
// without opening every contract, plus the address of the full one. Selection
// criteria are included because that is the field selection is made on; the
// derived detail (tokens, states, props) stays in the per-contract file.
const index = {
  ...provenance,
  contracts: urlOf(PUBLISHED.contracts),
  docs: `${urlOf("public/design.md")}`,
  guide: `${urlOf("public/agents.md")}`,
  counts: doc.counts,
  components: contracts.map((c) => ({
    id: c.id,
    label: c.label,
    summary: c.summary,
    purpose: c.purpose,
    useWhen: c.useWhen,
    dontUseWhen: c.dontUseWhen,
    variants: c.variants.map((v) => ({ name: v.name, options: v.options, default: v.default })),
    parts: c.parts.map((p) => p.name),
    status: c.status,
    authored: c.authored,
    install: c.install,
    registryItem: c.registryItem,
    docs: c.docs,
    contract: contractUrl(c.id),
  })),
}
write(PUBLISHED.contractsIndex, index)

console.log(
  `gen-contracts — ${contracts.length} contracts ` +
    `(${authored.length} authored, ${doc.counts.withVariants} with variants, ` +
    `${doc.counts.tokenReferences} token references) → ${OUT}, ` +
    `published to ${PUBLISHED.contracts}, ${PUBLISHED.contractsIndex} and ${PUBLISHED.contractsDir}/<id>.json`,
)

stamp.save()
