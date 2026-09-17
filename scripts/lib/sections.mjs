// The one reader of the section metadata in src/app/sections.tsx.
//
// The file is the docs site's catalogue — which components exist, what they are
// called, which group they sit in, and the one-line blurb. Three generators read
// it, and each had grown its own parser: gen-api.mjs kept only the ids of the
// Components group, gen-design-sync.mjs read label/group/description as well.
// That is the same shape of divergence lib/tokens.mjs was written to end.
//
// It stays a text parser, not an import: sections.tsx is TypeScript that pulls
// in the whole content graph, and these generators run before any build.
// Everything is matched at four-space indentation, which is where the entries in
// the `sections` array literal live — the Vite migration kept that formatting,
// and Prettier holds it.

/**
 * Every section entry, in file order: `{ id, label, group, description }`.
 * Entries with no group (the catalogue's non-doc rows) are dropped.
 */
export function parseSections(src) {
  const lines = src.split("\n")
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
    if (lab) {
      cur.label = lab[1]
      continue
    }
    const grp = l.match(/^\s{4}group:\s*"([^"]+)"/)
    if (grp) {
      cur.group = grp[1]
      continue
    }
    const dIn = l.match(/^\s{4}description:\s*"((?:[^"\\]|\\.)*)"/)
    if (dIn) {
      cur.description = dIn[1]
      continue
    }
    // A description wrapped across lines: `description:` alone, then string
    // pieces joined by `+`.
    if (/^\s{4}description:\s*$/.test(l)) {
      awaiting = true
      continue
    }
    if (awaiting) {
      const piece = l.match(/^\s*"((?:[^"\\]|\\.)*)"/)
      if (piece) {
        cur.description += piece[1]
        if (!l.trimEnd().endsWith("+")) awaiting = false
        continue
      }
      awaiting = false
    }
  }
  return out.filter((s) => s.group)
}

/** Section ids in the Components group — the ones backed by a primitive. */
export function componentIds(src) {
  return parseSections(src)
    .filter((s) => s.group === "Components")
    .map((s) => s.id)
}
