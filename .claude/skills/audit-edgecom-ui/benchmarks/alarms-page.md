# Benchmark: the Alarms page, asked for in a product manager's words

**Purpose:** a whole-screen benchmark for the design system as Claude Design sees it. The mechanical checks in the audit skill each isolate one drift class; this measures the opposite end — what a non-specialist gets when they select the design system in Claude Design and describe a screen in their own words, with no knowledge of components, tokens or guidelines.

The prompt is deliberately naive. It says *what* the screen must do and nothing about *how*. Every instruction a specialist would add — read the guidelines, use `Table`, colour severity by meaning, write the manifest — is exactly what the design system itself has to teach. If the output drifts, the system is what gets fixed, never this prompt.

## How to run

1. In Claude Design, start a new design and select the current Edgecom design system.
2. Paste the prompt below **verbatim**. Add nothing.
3. Save the output beside the earlier runs (design file, manifest if one was produced, and the agent's own summary) so runs can be diffed.
4. Score it against the checklist below and record the score and date in the log at the bottom.

Re-run after any release of the design system. Never edit the prompt between runs; if the page needs a feature the prompt does not describe, add it once, then freeze it again and note the change in the log.

## The prompt

```text
I need an Alarms page for our client portal.

Our customers run buildings and factories. They put meters on electricity, water, gas, temperature and emissions, and set up rules like "warn me if this chiller goes over 400 kW for more than 10 minutes." When a rule fires, that's an alarm. This page is where they deal with alarms.

What they need to do here:
- See at a glance how many alarms are active, how many have been acknowledged, and how many got resolved today.
- Find the alarms that matter: filter by how serious it is (critical, warning, info), by status, by which site or meter, by what kind of meter, and by time.
- Scan a list of alarms and understand each one quickly: what fired, where, how bad, when, for how long, who's on it.
- Click an alarm to see the detail: what the reading looked like when it crossed the line, and the history of who did what.
- Act on alarms, one at a time or several at once: acknowledge, assign to a teammate, mute for a while, resolve. Resolving should ask "are you sure."
- Create a new alarm rule from this page.

It has to work on a phone too, since operators are on the floor. And please show what it looks like when it's loading, when there are no alarms, and when something goes wrong loading.

Make the copy realistic: real-sounding site and meter names, real units. Don't use our actual customers' names.
```

## How to judge it

Score what a product manager can see, plus what the validator can check. One point each; the total is out of 12.

**Looks like ours**

1. Every visible element is a design-system component — no hand-rolled table, badge, tabs, menu, dialog or skeleton.
2. Dark mode works with no hand-picked colours; toggling `.dark` flips everything.
3. Type uses only the system's scale; nothing reads as a one-off size or weight.
4. Severity colours are by meaning and consistent: critical → destructive, warning → warning, info → info, resolved → success, muted → neutral.
5. Commodity tags are the commodity `Badge` variants, not chart colours.

**Does the job**

6. Every bullet in the prompt is present: summary counts, filters, list, detail with reading and history, single and bulk actions, create rule.
7. Resolve confirms through `AlertDialog`; the quiet destructive action uses the destructive ghost button.
8. The form for a new rule is in the right overlay for its length (sheet, not dialog).
9. Loading, empty and error states exist and the empty state offers a way out (clear filters).
10. The mobile layout is a real layout, not the desktop one squeezed.

**Ships correctly**

11. A `<Name>.manifest.json` was written unprompted beside the design and cites the live system version and digest.
12. `node scripts/check-design-manifest.mjs <manifest> --strict` passes.

Record failures by number. A failure that repeats across runs is a design-system defect; open it against the primitive, the guideline or the contract it exposes.

## Log

| Date | System version | Score / 12 | Failed items | Notes |
|---|---|---|---|---|
| — | — | — | — | Not yet run. |
