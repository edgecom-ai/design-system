// Runtime verification of the built docs site.
//
// There is no test framework here, and `pnpm build` only proves the export
// prerenders — the page shells are empty and every section renders client-side,
// so a build can succeed while the site renders nothing. This loads a sample of
// routes in real Chrome and checks what a build and a typecheck cannot:
//
//   - the page actually renders content (the shell alone is ~0 chars)
//   - no console error and no page error
//   - no failed request other than Next's own aborted route prefetches
//   - the Suspense fallback resolved rather than sticking
//
// Both themes, because a light-only regression is invisible otherwise.
//
//   pnpm verify:docs              # builds nothing; expects out/ to exist
//   node scripts/verify-docs.mjs --base http://localhost:3000   # against dev
//
// Prefers system Chrome (channel: "chrome") so it needs no `playwright install`,
// and falls back to Playwright's bundled chromium where there is none (CI).

import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { resolve, dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = resolve(root, "out")

const argv = process.argv.slice(2)
const baseArg = argv.includes("--base") ? argv[argv.indexOf("--base") + 1] : null

// Routes chosen to cover each group and the shapes that differ: a prose page, a
// foundations page, variant pages, and a block.
const ROUTES = [
  "/getting-started/introduction/",
  "/foundations/colors/",
  "/foundations/typography/",
  "/components/button/",
  "/components/table/",
  "/components/dialog/",
  "/components/select/",
  "/components/tabs/",
  "/components/skeleton/",
  "/blocks/chart-blocks/",
]

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain", ".md": "text/markdown",
}

async function serveOut() {
  try {
    await stat(outDir)
  } catch {
    console.error("verify-docs — out/ not found. Run `pnpm build` first.")
    process.exit(1)
  }
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0])
    if (p.endsWith("/")) p += "index.html"
    const file = join(outDir, p)
    try {
      const body = await readFile(file)
      res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" })
      res.end(body)
    } catch {
      res.writeHead(404).end("not found")
    }
  })
  await new Promise((r) => server.listen(0, r))
  return { server, base: `http://localhost:${server.address().port}` }
}

async function run(browser, base, dark) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: dark ? "dark" : "light",
  })
  const rows = []
  for (const route of ROUTES) {
    const page = await ctx.newPage()
    const errors = []
    const failed = []
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)))
    page.on("pageerror", (e) => errors.push("pageerror: " + String(e).slice(0, 200)))
    page.on("requestfailed", (r) => {
      // Next cancels in-flight route prefetches when a page unloads; those are
      // document requests to route URLs and are expected. A failed *chunk* is not.
      if (r.url().includes("/_next/static/")) failed.push(r.url().split("/").pop())
    })

    let status = "ok"
    try {
      const resp = await page.goto(base + route, { waitUntil: "networkidle", timeout: 45000 })
      if (!resp || !resp.ok()) status = `HTTP ${resp ? resp.status() : "?"}`
    } catch (e) {
      status = "nav failed: " + String(e.message).slice(0, 60)
    }

    const chars = await page.evaluate(() => document.body.innerText.trim().length).catch(() => 0)
    const slots = await page.locator("[data-slot]").count().catch(() => 0)
    // A stuck Suspense fallback shows skeletons and almost no text.
    const stuck = chars < 300 && (await page.locator('[data-slot="skeleton"]').count().catch(() => 0)) > 0

    const ok = status === "ok" && !errors.length && !failed.length && chars >= 300 && slots > 0 && !stuck
    rows.push({ route, ok, status, chars, slots, stuck, errors, failed })
    await page.close()
  }
  await ctx.close()
  return rows
}

const { server, base } = baseArg ? { server: null, base: baseArg } : await serveOut()
const { chromium } = await import("playwright")
// Prefer the installed Chrome so a contributor needs no `playwright install`.
// CI has no system Chrome, so fall back to Playwright's own chromium there.
let browser
try {
  browser = await chromium.launch({ channel: "chrome", headless: true })
} catch {
  console.log("  (no system Chrome — falling back to bundled chromium)")
  browser = await chromium.launch({ headless: true })
}

let failures = 0
for (const dark of [false, true]) {
  const rows = await run(browser, base, dark)
  console.log(`\n=== ${dark ? "DARK" : "LIGHT"} ===`)
  for (const r of rows) {
    if (!r.ok) failures++
    console.log(
      `  ${r.ok ? "ok  " : "FAIL"} ${r.route.padEnd(34)} ${String(r.chars).padStart(6)} chars  ${String(r.slots).padStart(4)} slots` +
        (r.status !== "ok" ? `  ${r.status}` : "") +
        (r.stuck ? "  SUSPENSE STUCK" : ""),
    )
    for (const e of r.errors.slice(0, 3)) console.log(`        console: ${e}`)
    for (const f of r.failed.slice(0, 3)) console.log(`        failed chunk: ${f}`)
  }
}

await browser.close()
server?.close()

const total = ROUTES.length * 2
console.log(`\n  ${total - failures}/${total} passed`)
process.exit(failures ? 1 : 0)
