// The one reader of a primitive's cva() call.
//
// It lived inside gen-design-sync.mjs, where only the Claude Design cards could
// reach it. The component contracts need the same three facts — the base class
// string, each variant group's classes, and the defaults — and a second copy
// would drift the way the three `blockVars` copies did before lib/tokens.mjs.
//
// This is a source-text reader, not a TypeScript parser, for the same reason
// gen-api.mjs is one: the generators run before any build step and must not
// depend on the primitive compiling. Everything here is therefore string-aware
// but deliberately shallow — it reads what the file literally says.

/** Body of the brace block that opens at `openIdx`, or null if unbalanced. */
export function braceBody(src, openIdx) {
  let depth = 0
  for (let i = openIdx; i < src.length; i++) {
    if (src[i] === "{") depth++
    else if (src[i] === "}") {
      depth--
      if (depth === 0) return src.slice(openIdx + 1, i)
    }
  }
  return null
}

// Quoting is not uniform across the registry: the six vendored shadcn-studio
// demos are single-quoted, everything authored here is double-quoted. A reader
// that only knew `"` silently returned an empty variant group for those — the
// timeline documented no `positions` prop for exactly that reason.
const STR = String.raw`"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\`(?:[^\`\\]|\\.)*\``

/** `name: "classes"` / `'name': 'classes'` / `name:\n  "classes"` — comments dropped. */
export function parseVariantEntries(body) {
  const clean = body.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "")
  const out = {}
  for (const m of clean.matchAll(new RegExp(String.raw`['"\`]?([\w-]+)['"\`]?:\s*(${STR})`, "gs"))) {
    out[m[1]] = m[2].slice(1, -1).replace(/\s+/g, " ").trim()
  }
  return out
}

/** Body of the bracket block that opens at `openIdx`, or null if unbalanced. */
export function bracketBody(src, openIdx) {
  let depth = 0
  for (let i = openIdx; i < src.length; i++) {
    if (src[i] === "[") depth++
    else if (src[i] === "]") {
      depth--
      if (depth === 0) return src.slice(openIdx + 1, i)
    }
  }
  return null
}

/** Every string literal in a fragment, space-joined — comments dropped. */
export function joinLiterals(body) {
  const clean = body.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "")
  const out = []
  for (const m of clean.matchAll(new RegExp(STR, "gs"))) out.push(m[0].slice(1, -1))
  return out.join(" ").replace(/\s+/g, " ").trim()
}

/**
 * Pull the base class string, each variant group's class strings, and the
 * defaults straight out of the primitive, so anything derived from this renders
 * or documents what the component actually renders.
 *
 * Returns null when the primitive has no cva() at all — a plain composition
 * like `input` or `table`, which is a fact about the component, not a failure.
 */
export function extractCva(src) {
  const at = src.indexOf("cva(")
  if (at === -1) return null

  // base: the first argument to cva(). Usually one literal; tabs passes an
  // array of them so the long strings can carry comments between the parts, and
  // reading only the first literal there would report a base of "" — which is
  // what a card built from this would then render with.
  const afterOpen = src.slice(at + 4)
  let base = ""
  const arrM = afterOpen.match(/^\s*\[/)
  if (arrM) {
    const body = bracketBody(afterOpen, afterOpen.indexOf("["))
    if (body != null) base = joinLiterals(body)
  } else {
    const baseM = afterOpen.match(new RegExp(String.raw`^\s*(${STR})`, "s"))
    base = baseM ? baseM[1].slice(1, -1).replace(/\s+/g, " ").trim() : ""
  }

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
      const g = line.match(/^\s*['"`]?([\w-]+)['"`]?:\s*\{/)
      if (g) {
        curGroup = g[1]
        groupBody = []
        depth = 1
        continue
      }
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
    if (dBody)
      for (const m of dBody.matchAll(/['"`]?([\w-]+)['"`]?:\s*['"`]([^'"`]+)['"`]/g)) defaults[m[1]] = m[2]
  }
  return { base, groups, defaults }
}

/** Every class string a cva result can produce: base plus every variant option. */
export function allClasses(cva) {
  if (!cva) return []
  const out = [cva.base]
  for (const entries of Object.values(cva.groups)) out.push(...Object.values(entries))
  return out.filter(Boolean)
}
