// The published addresses of the agent-facing artifacts (plan §5.2, §5.5).
//
// A coding agent in a consuming app has exactly one address for this design
// system — design.edgecom.ai — so anything derived from the contracts that an
// agent is meant to read has to be served from there, not left in
// src/docs/generated/. This is the one place the paths are spelled out; the
// generators that write the files and the documents that link to them both
// import from here, so a moved file cannot leave a dangling URL behind.
//
// Everything under public/ is served at the root of the domain by the docs
// build: public/contracts.json → https://design.edgecom.ai/contracts.json.

export const PUBLIC_BASE = "https://design.edgecom.ai"

/** Repo-relative paths under public/, keyed by what they are. */
export const PUBLISHED = {
  contracts: "public/contracts.json",
  contractsIndex: "public/contracts/index.json",
  contractsDir: "public/contracts",
  tokens: "public/tokens.json",
  skillsDir: "public/skills",
  schemasDir: "public/schemas",
}

/**
 * A served artifact points its `$schema` at the served schema. The schemas
 * already declare `https://design.edgecom.ai/schemas/<name>` as their `$id`;
 * publishing them beside the data makes that address true.
 */
export const schemaUrl = (name) => `${PUBLIC_BASE}/schemas/${name}`

/** URL a repo-relative `public/…` path is served at. */
export const urlOf = (publicPath) => `${PUBLIC_BASE}/${publicPath.replace(/^public\//, "")}`

export const contractUrl = (id) => `${PUBLIC_BASE}/contracts/${id}.json`
export const skillUrl = (name) => `${PUBLIC_BASE}/skills/${name}/SKILL.md`

/**
 * The consumer-facing skills — procedures a coding agent runs in a consuming
 * app, not in this repo. They are authored in .claude/skills/ so this repo's own
 * agent has them too, and mirrored under public/skills/ so a consuming app can
 * fetch them. design-edgecom-ui is deliberately absent: it is the procedure for
 * changing the design system, and belongs only here.
 */
export const CONSUMER_SKILLS = ["implement-edgecom-design", "audit-edgecom-ui"]
