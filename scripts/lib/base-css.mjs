// Compiles `_base.css` — the stylesheet the Claude Design cards render with.
//
// Claude Design compiles a token manifest for the project by reading every
// custom-property declaration in the linked stylesheet, in file order, and
// treats any class rule that declares one as a "theme". Shipping the whole
// compiled Tailwind bundle (260 KB) therefore produced a manifest of Tailwind
// internals (`--tw-ring-shadow`, `--tw-translate-x`), Tailwind's default scale
// (`--text-xs`, `--color-amber-400`) and ~90 fake themes (`.shadow-lg`,
// `.ring-2`, `.font-medium`) — and never reached the Edgecom `:root`/`.dark`
// blocks at the tail of the file at all.
//
// So the bundle now gets a curated stylesheet instead:
//   1. Tailwind is compiled from `globals.css` against exactly the class names
//      the cards use — the same compiler, the same utilities, nothing else.
//   2. Every `--tw-*` variable is resolved in place and removed, so no utility
//      declares a custom property and nothing but `.dark` reads as a theme.
//      Where utilities compose through a variable across rules (gradient stops
//      spread over `from-*` / `via-*` / `to-*`), the cards' own markup says
//      which classes sit together on one element, and those are merged into
//      one conjunction rule (`.a.b.c::before { … }`) with the value resolved.
//   3. Tailwind's default theme variables (`--spacing`, `--font-weight-medium`)
//      are inlined and dropped; Edgecom's own `@theme inline` values stay.
//   4. The Edgecom `:root` and `.dark` blocks are moved to the top, verbatim,
//      in the OKLCH the tokens are authored in — not the hex/lab a minifier
//      would turn them into.
//
// The last step audits the result: a custom property may only be declared on
// `:root`, `:root, :host` or `.dark`. Anything else is a regression and fails
// the build, the same way `check:schemas` fails on a malformed `tokens.json`.
//
// Trade-off, stated: utilities that compose through a variable but sit on
// different *states* of one element (a `shadow-*` plus a `focus-visible:ring-*`)
// no longer stack — the later one wins. Cards are static, so those rings are
// never active in them.

import { readFileSync } from "node:fs"
import { createRequire } from "node:module"

import { compile, Polyfills } from "@tailwindcss/node"
import postcss from "postcss"

const require = createRequire(import.meta.url)

/** Custom-property names Tailwind ships in its default theme. */
export function tailwindDefaultThemeVars() {
  const themeCss = readFileSync(require.resolve("tailwindcss/theme.css"), "utf8")
  return new Set([...themeCss.matchAll(/--([\w-]+)\s*:/g)].map((m) => m[1]))
}

/**
 * Every `class="…"` attribute across the given HTML documents.
 * @returns {{ candidates: Set<string>, elements: Set<string>[] }}
 *   `candidates` is the union; `elements` is one set per element, which is
 *   what tells the compiler which utilities compose on the same node.
 */
export function scanClasses(htmlDocs) {
  const candidates = new Set()
  const elements = []
  for (const html of htmlDocs) {
    for (const m of html.matchAll(/class="([^"]*)"/g)) {
      const el = new Set(m[1].split(/\s+/).filter(Boolean))
      if (!el.size) continue
      elements.push(el)
      for (const c of el) candidates.add(c)
    }
  }
  return { candidates, elements }
}

// `var(--name)`, `var(--name, fallback)`, `var(--name,)` — one occurrence at a
// time, respecting nested parentheses in the fallback.
function nextVar(value, from) {
  const at = value.indexOf("var(", from)
  if (at === -1) return null
  let depth = 0
  let j = at + 3
  for (; j < value.length; j++) {
    if (value[j] === "(") depth++
    else if (value[j] === ")") {
      depth--
      if (depth === 0) break
    }
  }
  const inner = value.slice(at + 4, j)
  const comma = inner.indexOf(",")
  const name = (comma === -1 ? inner : inner.slice(0, comma)).trim().replace(/^--/, "")
  const fallback = comma === -1 ? undefined : inner.slice(comma + 1).trim()
  return { at, end: j + 1, name, fallback }
}

class GuaranteedInvalid extends Error {
  constructor(name) {
    super(`var(--${name}) has no value and no fallback`)
    this.name = "GuaranteedInvalid"
  }
}

/**
 * Substitute resolvable `var()` references in one value. `lookup(name)` returns
 * `{ keep: true }` to leave a reference alone, `{ value }` to substitute, or
 * `{ invalid: true }` for a variable that is guaranteed-invalid (declared by
 * `@property` with no initial value) — those take their fallback, or make the
 * whole declaration invalid.
 */
export function resolveVars(value, lookup) {
  let cur = value
  for (let pass = 0; pass < 12; pass++) {
    let out = ""
    let i = 0
    let changed = false
    for (;;) {
      const v = nextVar(cur, i)
      if (!v) {
        out += cur.slice(i)
        break
      }
      out += cur.slice(i, v.at)
      const r = lookup(v.name)
      if (r.keep) out += cur.slice(v.at, v.end)
      else if (r.invalid) {
        if (v.fallback === undefined) throw new GuaranteedInvalid(v.name)
        out += v.fallback
        changed = true
      } else {
        out += r.value
        changed = true
      }
      i = v.end
    }
    cur = out
    if (!changed) break
  }
  return cur.replace(/\s{2,}/g, " ").trim()
}

const ROOT_SELECTORS = new Set([":root", ".dark", ":root, :host", ":root,:host"])

/**
 * What a utility really renders: compile each class on its own and read the
 * first declaration of the given property. Used for scale steps a card shows
 * that are not authored in globals.css — they fall through to Tailwind's
 * default, and the card must show that, not what the docs say it should be.
 *
 * @param {string} globalsCss
 * @param {string} base
 * @param {Record<string, [className: string, property: string]>} probes  name → [class, property]
 * @returns {Promise<Record<string, string>>} name → value (only where found)
 */
export async function probeUtilities(globalsCss, base, probes) {
  const compiler = await compile(globalsCss, { base, onDependency: () => {}, polyfills: Polyfills.None })
  const out = {}
  for (const [name, [className, property]] of Object.entries(probes)) {
    const root = postcss.parse(compiler.build([className]))
    // Only the utility's own rule — the preflight resets the same property.
    root.walkRules((r) => {
      if (!r.selector.startsWith(".") || unescapeClass(r.selector) !== className) return
      r.walkDecls(property, (d) => {
        if (!(name in out)) out[name] = d.value
      })
    })
  }
  return out
}

// `.before\:via-foreground\/12` → `before:via-foreground/12`
const unescapeClass = (selector) =>
  selector
    .slice(1)
    .replace(/\\3([0-9]) /g, "$1")
    .replace(/\\(.)/g, "$1")

// The nesting path from a declaration up to (not including) its outer utility
// rule — `&::before`, `&:focus-visible` … — with `@supports` flattened, since
// Chrome passes every feature query Tailwind emits.
function innerPath(decl, outer) {
  const parts = []
  for (let n = decl.parent; n && n !== outer; n = n.parent) {
    if (n.type === "rule") parts.unshift(n.selector.replace(/\s+/g, " "))
    else if (n.type === "atrule" && n.name !== "supports") parts.unshift(`@${n.name} ${n.params}`)
  }
  return parts.join(" > ")
}

/**
 * Compile the curated stylesheet.
 *
 * @param {object} o
 * @param {string} o.globalsCss   the contents of src/app/globals.css
 * @param {string} o.base         the directory globals.css lives in (for `@import` resolution)
 * @param {Set<string>[]} o.elements  one set of class names per element in the cards
 * @param {Record<string,string>} [o.themeTokens]  Edgecom tokens authored in `@theme inline`
 *   (the type scale, the radius scale) — `inline` means Tailwind never emits them as
 *   variables, so they are declared on `:root` here to be readable and usable as tokens
 * @param {string} [o.helpers]    plain CSS appended verbatim (card layout helpers)
 * @returns {Promise<{ css: string, report: object }>}
 */
export async function buildBaseCss({ globalsCss, base, elements, themeTokens = {}, helpers = "" }) {
  const candidates = new Set()
  for (const el of elements) for (const c of el) candidates.add(c)

  const compiler = await compile(globalsCss, {
    base,
    onDependency: () => {},
    // Modern Chrome renders the cards; the `@layer properties` / `@supports`
    // fallbacks only add custom-property declarations for the manifest to misread.
    polyfills: Polyfills.None,
  })
  const root = postcss.parse(compiler.build([...candidates]))

  // --- the Edgecom tokens, straight from the unlayered :root / .dark ---------
  let rootRule = null
  root.each((node) => {
    if (node.type === "rule" && node.selector === ":root" && !rootRule) rootRule = node
  })
  if (!rootRule) throw new Error("globals.css has no top-level :root block")
  const declared = new Set()
  rootRule.walkDecls((d) => declared.add(d.prop))
  for (const [name, value] of Object.entries(themeTokens)) {
    if (!declared.has(`--${name}`)) rootRule.append({ prop: `--${name}`, value })
  }
  const edgecomVars = new Set()
  root.each((node) => {
    if (node.type === "rule" && (node.selector === ":root" || node.selector === ".dark")) {
      node.walkDecls((d) => {
        if (d.prop.startsWith("--")) edgecomVars.add(d.prop.slice(2))
      })
    }
  })

  // --- @property registrations → initial values, then gone -------------------
  const initials = new Map()
  root.walkAtRules("property", (at) => {
    const name = at.params.trim().replace(/^--/, "")
    let initial = null
    at.walkDecls("initial-value", (d) => {
      initial = d.value
    })
    initials.set(name, initial)
    at.remove()
  })
  root.walkAtRules("layer", (at) => {
    if (at.params.trim() === "properties") at.remove()
  })

  // --- Tailwind's theme layer: inline the defaults, keep Edgecom's own -------
  const defaults = tailwindDefaultThemeVars()
  const themeValues = new Map()
  const themeKept = []
  root.walkAtRules("layer", (layer) => {
    if (layer.params.trim() !== "theme") return
    layer.walkDecls((d) => {
      if (!d.prop.startsWith("--")) return
      const name = d.prop.slice(2)
      const alias = d.value.match(/^var\(--([\w-]+)\)$/)
      if (edgecomVars.has(name)) {
        // `--font-sans: var(--font-sans)`, or a scale token already declared on
        // :root above — the unlayered :root wins anyway.
        d.remove()
      } else if (defaults.has(name)) {
        themeValues.set(name, d.value)
        d.remove()
      } else if (alias && edgecomVars.has(alias[1])) {
        // `--color-border: var(--border)` — substitute the alias, drop the noise.
        themeValues.set(name, d.value)
        d.remove()
      } else {
        themeKept.push(name)
      }
    })
  })

  // --- index the utilities: outer rule ⇄ class name --------------------------
  let utilitiesLayer = null
  root.walkAtRules("layer", (l) => {
    if (l.params.trim() === "utilities") utilitiesLayer = l
  })
  const ruleFor = new Map() // class name → outer rule
  const orderOf = new Map() // outer rule → stylesheet position
  if (utilitiesLayer) {
    utilitiesLayer.each((n, i) => {
      if (n.type !== "rule" || !/^\.(\\.|[\w-])+$/.test(n.selector)) return
      ruleFor.set(unescapeClass(n.selector), n)
      orderOf.set(n, i)
    })
  }
  const outerOf = (decl) => {
    let n = decl.parent
    while (n && n.parent && n.parent !== utilitiesLayer) n = n.parent
    return n && n.type === "rule" && orderOf.has(n) ? n : null
  }

  // --- resolve every reference to a variable we are about to remove ----------
  // A lookup shared by the plain pass and the composition pass; `locals` is the
  // map of `--tw-*` values in scope for the declaration being resolved.
  const makeLookup = (locals) => (name) => {
    if (name.startsWith("tw-")) {
      if (locals.has(name)) return { value: locals.get(name) }
      if (initials.has(name) && initials.get(name) !== null) return { value: initials.get(name) }
      return { invalid: true }
    }
    if (themeValues.has(name)) return { value: themeValues.get(name) }
    if (initials.has(name)) {
      const v = initials.get(name)
      return v === null ? { invalid: true } : { value: v }
    }
    return { keep: true }
  }
  const localsOf = (rule) => {
    const m = new Map()
    rule.each((n) => {
      if (n.type === "decl" && n.prop.startsWith("--tw-")) m.set(n.prop.slice(2), n.value)
    })
    return m
  }

  const pending = [] // declarations that need a sibling utility's variable
  root.walkDecls((decl) => {
    // `--tw-*` declarations are read raw as locals and removed below; only the
    // real properties that consume them need resolving.
    if (decl.prop.startsWith("--tw-") || !decl.value.includes("var(")) return
    try {
      decl.value = resolveVars(decl.value, makeLookup(localsOf(decl.parent)))
    } catch (e) {
      if (!(e instanceof GuaranteedInvalid)) throw e
      pending.push(decl)
    }
  })

  // --- composition: merge same-element utilities into one conjunction rule ---
  const composed = []
  const dropped = []
  const emitted = new Set()
  for (const decl of pending) {
    if (!decl.parent) continue // already handled with a sibling from the same rule
    const outer = outerOf(decl)
    const path = outer ? innerPath(decl, outer) : null
    const cls = outer ? unescapeClass(outer.selector) : null
    let resolvedSomewhere = false
    for (const el of outer ? elements : []) {
      if (!el.has(cls)) continue
      const members = [...el]
        .map((c) => ruleFor.get(c))
        .filter(Boolean)
        .sort((a, b) => orderOf.get(a) - orderOf.get(b))
      // Every `--tw-*` declared along the same inner path on any member, in
      // cascade order (later wins) — including inside flattened `@supports`.
      const locals = new Map()
      for (const r of members) {
        r.walkDecls((d) => {
          if (d.prop.startsWith("--tw-") && innerPath(d, r) === path) locals.set(d.prop.slice(2), d.value)
        })
      }
      let value
      try {
        value = resolveVars(decl.value, makeLookup(locals))
      } catch (e) {
        if (!(e instanceof GuaranteedInvalid)) throw e
        continue
      }
      // Only the members that contribute a variable belong in the conjunction;
      // the rest would just make the selector brittle.
      const contributing = members.filter((r) => {
        if (r === outer) return true
        let declares = false
        r.walkDecls((d) => {
          if (d.prop.startsWith("--tw-") && innerPath(d, r) === path) declares = true
        })
        return declares
      })
      const selector = contributing.map((r) => r.selector).join("")
      const key = `${selector} ${path} ${decl.prop}`
      if (!emitted.has(key)) {
        emitted.add(key)
        // Clone the outer rule so the nesting (`&::before`) comes along, then
        // keep only this declaration, resolved.
        const clone = outer.clone({ selector })
        clone.walkDecls((d) => {
          if (d.prop !== decl.prop || innerPath(d, clone) !== path) d.remove()
          else d.value = value
        })
        utilitiesLayer.append(clone)
        composed.push(`${selector}${path ? ` ${path}` : ""} { ${decl.prop} }`)
      }
      resolvedSomewhere = true
    }
    if (!resolvedSomewhere) {
      const where = outer ? `${outer.selector}${path ? ` ${path}` : ""}` : decl.parent.selector || `@${decl.parent.name}`
      dropped.push(`${where} { ${decl.prop} }`)
    }
    decl.remove()
  }

  // --- strip the internals, the docs-site cruft, and what is now empty -------
  root.walkDecls((d) => {
    if (d.prop.startsWith("--tw-")) d.remove()
  })
  root.walkRules((r) => {
    if (r.selector.includes(".shiki")) r.remove()
  })
  const prune = (container) => {
    container.each((n) => {
      if (n.type === "rule" || n.type === "atrule") {
        if (n.nodes) prune(n)
        if (n.nodes && n.nodes.length === 0) n.remove()
      } else if (n.type === "comment") n.remove()
    })
  }
  prune(root)

  // --- Edgecom tokens first, so nothing reads before them --------------------
  const lead = []
  root.each((n) => {
    if (n.type === "rule" && (n.selector === ":root" || n.selector === ".dark")) lead.push(n)
  })
  for (const n of lead) n.remove()
  root.prepend(...lead.sort((a, b) => (a.selector === ":root" ? -1 : b.selector === ":root" ? 1 : 0)))

  // --- audit: custom properties live on :root / .dark and nowhere else -------
  const stray = []
  let tokenDecls = 0
  root.walkDecls((d) => {
    if (!d.prop.startsWith("--")) return
    tokenDecls++
    const sel = d.parent.type === "rule" ? d.parent.selector.replace(/\s+/g, " ") : `@${d.parent.name}`
    if (!ROOT_SELECTORS.has(sel) || d.prop.startsWith("--tw-")) stray.push(`${sel} { ${d.prop} }`)
  })
  if (stray.length) {
    throw new Error(
      `_base.css would declare custom properties outside :root/.dark — the design manifest would ` +
        `misread them as tokens or themes:\n  ${stray.join("\n  ")}`,
    )
  }

  let utilities = 0
  if (utilitiesLayer) utilitiesLayer.each((n) => n.type === "rule" && utilities++)

  const banner =
    `/* Generated by scripts/gen-design-sync.mjs — do not hand-edit.\n` +
    `   Edgecom tokens (:root light, .dark overrides), then only the utilities the cards use.\n` +
    `   Not a full Tailwind build: style your own artifacts with var(--token), not class names. */\n`
  return {
    css: banner + root.toString().trim() + "\n" + helpers,
    report: {
      candidates: candidates.size,
      utilities,
      tokenDeclarations: tokenDecls,
      edgecomTokens: edgecomVars.size,
      themeKept,
      composed,
      dropped,
    },
  }
}
