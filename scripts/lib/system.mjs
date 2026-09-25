// The identity of the design system: one version, one digest, computed one way.
//
// Three artifacts used to each stamp their own digest — tokens.json over
// globals.css, contracts.json over the contract inputs, the design bundle's
// _system.json over globals.css + design.md. Each was an honest content hash of
// its own inputs, and no two of them could ever be equal, so the version check
// the consumer skill described — "compare the design project's _system.json
// with contracts/index.json" — could not pass. A design manifest (plan §5.4)
// cites the system it was built against; that citation only means something if
// every published artifact and every design project name the same value.
//
// So this is the one place the identity is computed. The digest covers every
// authority a design or an implementation is governed by: the tokens, the
// design language, the primitives, the section map, the authored API and
// contract overlays. It changes when any of them changes and on nothing else —
// never on a commit — so a committed artifact carrying it stays parity-clean.

import { readFileSync, readdirSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..")

/** Repo-relative paths whose content is the design system. Order is fixed. */
export function systemSources() {
  const ui = readdirSync(resolve(root, "src/components/ui"))
    .filter((f) => f.endsWith(".tsx"))
    .sort()
    .map((f) => `src/components/ui/${f}`)
  return [
    "src/app/globals.css",
    "design.md",
    "src/app/sections.tsx",
    "src/docs/api.ts",
    "src/docs/curated.ts",
    "src/docs/contracts.json",
    ...ui,
  ]
}

const git = (...a) => {
  try {
    return execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
  } catch {
    return null
  }
}

/**
 * The latest tag, or "untagged". No file records it, so a generator that stamps
 * it passes it to freshness() as `extra` — a new tag must restamp, not skip.
 */
export function systemVersion() {
  return git("describe", "--tags", "--abbrev=0") || "untagged"
}

/**
 * @returns {{ version: string, digest: string, commit: string | null, sources: string[] }}
 *   version — the latest tag, or "untagged"; digest — 16 hex chars of sha256
 *   over every source, path and content; commit — HEAD, for artifacts that are
 *   not committed (the design bundle) and may name it.
 */
export function systemIdentity() {
  const sources = systemSources()
  const h = createHash("sha256")
  for (const p of sources) {
    h.update(p)
    h.update(existsSync(resolve(root, p)) ? readFileSync(resolve(root, p)) : "\0missing")
  }
  return {
    version: systemVersion(),
    digest: h.digest("hex").slice(0, 16),
    commit: git("rev-parse", "HEAD"),
    sources,
  }
}

/** The pattern every stamped digest matches; shared with the schemas. */
export const DIGEST_PATTERN = /^[0-9a-f]{16}$/
