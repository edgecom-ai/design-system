// Emits the structured token model to src/docs/generated/tokens.json.
//
// globals.css remains the authority (plan §5.1: do not migrate token authority
// to DTCG until parity is demonstrated). This is the compiled view of it — the
// thing schemas can validate, contracts can reference, and agents can read
// without parsing CSS.
//
// Run by docs:gen. CI regenerates and fails on a diff, so the JSON cannot drift
// from the stylesheet.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"

import { buildTokens } from "./lib/tokens.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const cssPath = resolve(root, "src/app/globals.css")
const outPath = resolve(root, "src/docs/generated/tokens.json")

const css = readFileSync(cssPath, "utf8")
const { tokens, darkOnly } = buildTokens(css)

const git = (...a) => {
  try {
    return execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
  } catch {
    return null
  }
}

// A token defined only in .dark almost always means someone edited one block and
// not the other — the single most common token mistake, per design.md.
if (darkOnly.length) {
  console.error(
    `gen-tokens — ${darkOnly.length} token(s) defined in .dark but not :root:\n` +
      darkOnly.map((t) => `    --${t}`).join("\n") +
      `\n  :root is the complete light set; add them there or remove them.`,
  )
  process.exit(1)
}

const byFamily = {}
for (const t of tokens) byFamily[t.family] = (byFamily[t.family] || 0) + 1

const doc = {
  $schema: "../../../schemas/tokens.schema.json",
  version: git("describe", "--tags", "--abbrev=0") || "untagged",
  commit: git("rev-parse", "HEAD"),
  digest: createHash("sha256").update(css).digest("hex").slice(0, 16),
  source: "src/app/globals.css",
  generator: "scripts/gen-tokens.mjs",
  counts: {
    total: tokens.length,
    modeIndependent: tokens.filter((t) => t.modeIndependent).length,
    withDarkOverride: tokens.filter((t) => t.dark !== null && !t.restatedInDark).length,
    restatedInDark: tokens.filter((t) => t.restatedInDark).length,
    aliases: tokens.filter((t) => t.aliasOf).length,
    tailwindExposed: tokens.filter((t) => t.tailwindUtility).length,
    byFamily,
  },
  tokens: tokens.sort((a, b) => a.family.localeCompare(b.family) || a.id.localeCompare(b.id)),
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(doc, null, 2) + "\n")

console.log(
  `gen-tokens — ${tokens.length} tokens ` +
    `(${doc.counts.withDarkOverride} with a dark override, ${doc.counts.aliases} aliases, ` +
    `${doc.counts.tailwindExposed} exposed to Tailwind) → src/docs/generated/tokens.json`,
)
