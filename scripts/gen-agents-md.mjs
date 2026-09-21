// Publishes the consumer-facing half of the contracts (plan §5.2, §5.5):
//
//   1. the `@@GENERATED:contracts` block in public/agents.md — the addresses of
//      every agent-facing artifact, the version and digest they carry, and the
//      list of components whose contracts have authored selection criteria;
//   2. the consumer skills, mirrored from .claude/skills/<name>/SKILL.md to
//      public/skills/<name>/SKILL.md so a consuming app can fetch them.
//
// agents.md is the one document a coding agent in a consuming app reads, so an
// address that lives only in this repo is an address it never sees. The block
// is generated so a new component, a newly authored contract, or a moved file
// shows up there without anyone remembering to edit prose; everything outside
// the markers stays hand-written, the same shape as public/llms.txt.
//
// Run by docs:gen, after gen-contracts. CI regenerates and fails on a diff.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { freshness, forced } from "./lib/stale.mjs"
import { PUBLISHED, CONSUMER_SKILLS, urlOf, contractUrl, skillUrl } from "./lib/publish.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const read = (p) => readFileSync(resolve(root, p), "utf8")

const AGENTS = "public/agents.md"
const skillSource = (name) => `.claude/skills/${name}/SKILL.md`
const skillTarget = (name) => `${PUBLISHED.skillsDir}/${name}/SKILL.md`

const stamp = freshness({
  name: "agents-md",
  inputs: [
    "src/docs/generated/contracts.json",
    "scripts/gen-agents-md.mjs",
    "scripts/lib/publish.mjs",
    ...CONSUMER_SKILLS.map(skillSource),
  ],
  outputs: [AGENTS, ...CONSUMER_SKILLS.map(skillTarget)],
})
if (stamp.fresh && !forced()) {
  console.log("gen-agents-md — up to date — skipped")
  process.exit(0)
}

// --- the skills --------------------------------------------------------------
// Verbatim, so the file a consuming app installs is the file this repo runs.
// A skill that leaves CONSUMER_SKILLS takes its published copy with it.
const skillsDir = resolve(root, PUBLISHED.skillsDir)
mkdirSync(skillsDir, { recursive: true })
for (const d of readdirSync(skillsDir, { withFileTypes: true })) {
  if (d.isDirectory() && !CONSUMER_SKILLS.includes(d.name)) rmSync(resolve(skillsDir, d.name), { recursive: true })
}
for (const name of CONSUMER_SKILLS) {
  const src = skillSource(name)
  if (!existsSync(resolve(root, src))) {
    console.error(`gen-agents-md — ${src} does not exist but is listed in CONSUMER_SKILLS (scripts/lib/publish.mjs)`)
    process.exit(1)
  }
  mkdirSync(resolve(root, dirname(skillTarget(name))), { recursive: true })
  writeFileSync(resolve(root, skillTarget(name)), read(src))
}

// --- the block ---------------------------------------------------------------
const doc = JSON.parse(read("src/docs/generated/contracts.json"))
const authored = doc.contracts.filter((c) => c.authored)
const derivedOnly = doc.contracts.filter((c) => !c.authored)
const link = (c) => `[\`${c.id}\`](${contractUrl(c.id)})`

const lines = [
  "<!-- @@GENERATED:contracts — from src/docs/generated/contracts.json by scripts/gen-agents-md.mjs (run `pnpm docs:gen`); do not hand-edit until the closing marker -->",
  "",
  `Contracts at **${doc.version}**, digest \`${doc.digest}\` — ${doc.counts.total} components, ${doc.counts.authored} with authored selection criteria. The version and digest are stamped into every file below; a design or an app built against a different digest is working from a different system.`,
  "",
  "| Address | What it is |",
  "|---|---|",
  `| [contracts/index.json](${urlOf(PUBLISHED.contractsIndex)}) | **Start here to resolve an element.** Every component: id, one-line summary, purpose, when to use it and when not, its variants with their options and defaults, its parts, the install command, and the address of its full contract. |`,
  `| [contracts/\`<id>\`.json](${contractUrl("button")}) | One component's full contract — the tokens it reaches, the states it styles, its props, required and forbidden compositions, behaviour in the loading/empty/error/destructive paths, accessibility requirements, anti-patterns. Fetch this for each component you are about to use. |`,
  `| [contracts.json](${urlOf(PUBLISHED.contracts)}) | Every contract in one document, for an audit or a bulk check. |`,
  `| [tokens.json](${urlOf(PUBLISHED.tokens)}) | The token model — every semantic token with its family, light and dark values, aliases, and whether Tailwind can reach it. Compare your installed \`theme\` against it to detect staleness. |`,
  `| [schemas/](${urlOf(PUBLISHED.schemasDir)}/contracts.schema.json) | The JSON Schemas both files validate against. |`,
  ...CONSUMER_SKILLS.map((name) => {
    const fm = read(skillSource(name)).match(/^description:\s*(.+)$/m)?.[1] ?? ""
    return `| [skills/${name}/SKILL.md](${skillUrl(name)}) | Claude Code skill. ${fm} |`
  }),
  "",
  `**Authored contracts** — purpose, selection criteria, compositions and anti-patterns written by a maintainer: ${authored.map(link).join(", ")}.`,
  "",
  `**Derived-only contracts** — the primitive's own variants, tokens, states, parts and props, with no authored guidance yet: ${derivedOnly.map(link).join(", ")}. For these, [design.md](${urlOf("public/design.md")}) is the selection guidance.`,
  "",
  "<!-- @@GENERATED:contracts-end -->",
]
const block = lines.join("\n")

const md = read(AGENTS)
const re = /<!-- @@GENERATED:contracts\b[\s\S]*?<!-- @@GENERATED:contracts-end -->/
if (!re.test(md)) {
  console.error(`gen-agents-md — @@GENERATED:contracts…@@GENERATED:contracts-end markers not found in ${AGENTS}`)
  process.exit(1)
}
writeFileSync(resolve(root, AGENTS), md.replace(re, block))

console.log(
  `gen-agents-md — ${doc.counts.total} contracts (${authored.length} authored) → ${AGENTS}; ` +
    `${CONSUMER_SKILLS.length} skills → ${PUBLISHED.skillsDir}/`,
)

stamp.save()
