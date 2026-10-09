// Renders every card of the built design-system artifact the way its page does
// — React 18.3.1 (the canvas runtime's React), components/bundle.css and
// components/bundle.js preloaded, the theme on <html data-theme> — in light and
// dark, and fails on a page error or a cell whose preview threw.
//
// It exists because the cards are the only place the bundle meets React 18
// before a designer's canvas does: a React-19-only pattern in a primitive
// renders fine in the docs site and fails silently here (2026-10-09: every
// popover rendered at 0,0 until the bundle gained its ref adapter).
//
// Needs Google Chrome installed (Playwright drives it headless) and network
// access to jsDelivr for React. Run after `pnpm design:artifact`.

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { createServer } from "node:http"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { chromium } from "playwright"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const project = resolve(root, ".design-sync/artifact/project")
if (!existsSync(join(project, "components/bundle.js"))) {
  console.error("check-design-artifact: no build — run `pnpm design:artifact` first")
  process.exit(1)
}

const REACT = "https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"
const REACT_DOM = "https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"
const react = (await Promise.all([REACT, REACT_DOM].map(async (u) => {
  const r = await fetch(u)
  if (!r.ok) throw new Error(`check-design-artifact: ${u} → ${r.status}`)
  return r.text()
}))).join("\n")

const cards = readdirSync(join(project, "components"))
  .filter((d) => existsSync(join(project, "components", d, "preview.html")))
  .sort()

// Serves only what the build named: a card from the list above, and the two
// files every card preloads. Nothing from the request reaches a path or the page.
const STATIC = {
  "/components/bundle.css": ["components/bundle.css", "text/css"],
  "/components/bundle.js": ["components/bundle.js", "text/javascript"],
}
const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost")
  const card = cards.find((c) => url.pathname === `/card/${c}`)
  if (card) {
    const theme = url.searchParams.get("theme") === "dark" ? "dark" : "light"
    const head = `<link rel="stylesheet" href="/components/bundle.css"><script>${react}</script><script src="/components/bundle.js"></script>`
    const html = readFileSync(join(project, "components", card, "preview.html"), "utf8")
      .replace("<head>", `<head>${head}`)
      .replace("<html>", `<html data-theme="${theme}">`)
    res.setHeader("content-type", "text/html")
    return res.end(html)
  }
  const asset = STATIC[url.pathname]
  if (!asset) {
    res.statusCode = 404
    return res.end()
  }
  res.setHeader("content-type", asset[1])
  res.end(readFileSync(join(project, asset[0])))
})
await new Promise((ok) => server.listen(0, ok))
const port = server.address().port

const browser = await chromium.launch({ channel: "chrome", headless: true })
const failures = []
for (const card of cards) {
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    const errors = []
    page.on("pageerror", (e) => errors.push(e.message.split("\n")[0]))
    page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(m.text().split("\n")[0]))
    await page.goto(`http://localhost:${port}/card/${card}?theme=${theme}`)
    await page.waitForTimeout(800)
    const failed = await page.evaluate(() =>
      [...document.querySelectorAll("#cells > section")].filter((s) => /^Preview failed/.test(s.lastElementChild?.textContent ?? "")).length,
    )
    const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"))
    if (dark !== (theme === "dark")) errors.push(`theme ${theme} did not reach .dark`)
    if (failed) errors.push(`${failed} cell(s) threw`)
    if (errors.length) failures.push(`${card} [${theme}]: ${errors.slice(0, 3).join(" · ")}`)
    await page.close()
  }
}
await browser.close()
server.close()

if (failures.length) {
  console.error(`check-design-artifact — ${failures.length} failing render(s) of ${cards.length * 2}:\n  ${failures.join("\n  ")}`)
  process.exit(1)
}
console.log(`check-design-artifact — ${cards.length} cards render on React 18.3.1 in light and dark`)
