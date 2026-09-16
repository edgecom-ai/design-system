// The one parser for the design tokens in src/app/globals.css.
//
// Three generators had grown their own copy of `blockVars`, and they had already
// drifted: gen-registry collapsed values that wrap across lines (font stacks do),
// the other two did not. Nothing emitted a parsed font value yet, so the bug was
// latent rather than live — which is exactly when to consolidate.
//
// globals.css stays the authority. This turns it into a structured model so the
// registry theme, design.md, the Claude Design bundle, and the component
// contracts are all compiled from one reading of it instead of four.

/** Pull `--name: value;` pairs out of one CSS block. */
export function blockVars(css, re) {
  const m = css.match(re)
  if (!m) return {}
  const vars = {}
  for (const d of m[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    // Values may wrap across lines (font stacks); normalise to one line.
    vars[d[1]] = d[2].trim().replace(/\s+/g, " ")
  }
  return vars
}

export const THEME_RE = /@theme[^{]*\{([\s\S]*?)\n\}/
export const ROOT_RE = /^:root\s*\{([\s\S]*?)\n\}/m
export const DARK_RE = /^\.dark\s*\{([\s\S]*?)\n\}/m

/** Every block, parsed once. */
export function readBlocks(css) {
  return {
    theme: blockVars(css, THEME_RE),
    light: blockVars(css, ROOT_RE),
    dark: blockVars(css, DARK_RE),
  }
}

// Which family a token belongs to, by name. Order matters — the first match
// wins, so the more specific prefixes are listed first.
const FAMILIES = [
  [/^chart-legacy-/, "legacy"],
  [/^chart-/, "chart"],
  [/^sidebar-/, "sidebar"],
  [/^(background|card|popover|elevated|scrim)(-foreground)?$/, "surface"],
  [/^primary(-|$)/, "brand"],
  [/^(success|warning|info|destructive)(-|$)/, "status"],
  [/^(ghost-hover|outline-surface|outline-hover|input-surface|input-hover)$/, "interaction"],
  [/^(track|track-active)$/, "relative-surface"],
  [/^(secondary|muted|accent|foreground|border|input|ring)(-|$)/, "neutral"],
  [/^text-/, "typography"],
  [/^font-/, "typography"],
  [/^tracking-/, "typography"],
  [/^radius(-|$)/, "radius"],
  [/^animate-/, "motion"],
]

export function familyOf(name) {
  for (const [re, fam] of FAMILIES) if (re.test(name)) return fam
  return "other"
}

/** Coarse type, enough to validate against and to map to DTCG later. */
export function typeOf(name, value) {
  if (/^font-/.test(name)) return "fontFamily"
  if (/^tracking-/.test(name)) return "dimension"
  if (/^text-.*--line-height$/.test(name)) return "dimension"
  if (/^text-/.test(name)) return "dimension"
  if (/^radius/.test(name)) return "dimension"
  if (/^animate-/.test(name)) return "duration"
  if (/^(oklch|rgb|hsl|#|color-mix|light-dark)/i.test(value) || /^var\(/.test(value)) return "color"
  if (/^-?[\d.]+(rem|px|em|%)?$/.test(value)) return "dimension"
  return "string"
}

const ALIAS_RE = /^var\(--([\w-]+)\)$/

/**
 * The structured token model.
 *
 * `light` is the complete set; `.dark` overrides only what differs, so a token
 * with no dark entry is mode-independent by design — that is a fact worth
 * recording rather than inferring at every call site (the brand blue depends
 * on it).
 */
export function buildTokens(css) {
  const { theme, light, dark } = readBlocks(css)

  // A Tailwind utility exists for a token only if @theme inline maps it.
  const exposed = new Set()
  for (const [k, v] of Object.entries(theme)) {
    const m = v.match(ALIAS_RE)
    if (m) exposed.add(m[1])
    exposed.add(k)
  }

  const tokens = []
  for (const [name, value] of Object.entries(light)) {
    const aliasM = value.match(ALIAS_RE)
    const darkValue = dark[name] ?? null
    // Mode-independent means "the same in both themes", which a token can say
    // two ways: by having no dark entry at all, or by restating the same value
    // in .dark. The brand blue does the second, deliberately and visibly, so
    // treating only the first as mode-independent would mislabel it.
    const sameInBothThemes = darkValue === null || darkValue === value
    tokens.push({
      id: name,
      cssVar: `--${name}`,
      family: familyOf(name),
      type: typeOf(name, value),
      light: value,
      dark: darkValue,
      modeIndependent: sameInBothThemes,
      restatedInDark: darkValue !== null && darkValue === value,
      aliasOf: aliasM ? aliasM[1] : null,
      tailwindUtility: exposed.has(name),
    })
  }

  // Dark may introduce a token the light block does not define. That is almost
  // always a mistake (design.md: set both, or confirm the light value inherits),
  // so surface it rather than silently dropping it.
  const darkOnly = Object.keys(dark).filter((k) => !(k in light))

  return { tokens, darkOnly }
}

/** Follow an alias chain to the value it ultimately shares. */
export function resolveValue(tokens, id, depth = 6) {
  const byId = tokens instanceof Map ? tokens : new Map(tokens.map((t) => [t.id, t]))
  let t = byId.get(id)
  for (let i = 0; i < depth && t?.aliasOf; i++) t = byId.get(t.aliasOf)
  return t?.light ?? null
}
