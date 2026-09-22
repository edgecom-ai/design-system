## How to build with this system

**No root provider.** Components work as-is. Three exceptions: `Toaster` must be mounted once for `toast()` calls (from `sonner`) to show; `Tooltip` sits inside a `TooltipProvider`; the `Sidebar*` parts sit inside `SidebarProvider`. Charts: draw with `Recharts` from the bundle (`const { AreaChart, Area } = window.EdgecomDS.Recharts`) inside `ChartContainer` — a separate recharts copy renders nothing. Dark mode is a `class="dark"` on any ancestor — every token flips; never hand-pick dark colours.

**Styling idiom: Tailwind utilities that name semantic tokens.** The stylesheet you get (`styles.css` → `_ds_bundle.css`) is compiled and fixed: a utility class that is not in it does nothing, silently. Use the families below (all present), and for anything else inline the token: `style={{ background: "var(--elevated)" }}`. Never a hex, never a px font size.

| Need | Use |
|---|---|
| Surfaces | `bg-background` `bg-card` `bg-popover` `bg-elevated` `bg-muted` `bg-secondary` `bg-sidebar` |
| Text | `text-foreground` `text-muted-foreground` `text-card-foreground` `text-primary` `text-primary-foreground` |
| Status (by meaning only) | `bg-success` `bg-warning` `bg-info` `bg-destructive` and `-subtle` tints (`bg-success-subtle` …), text `text-success` `text-warning` `text-info` `text-destructive`, emphasis `text-destructive-emphasis` |
| Borders / focus | `border-border` `border-input` `border-primary` `ring-ring/50` `ring-foreground/10` |
| Type scale (only these) | `text-caption` `text-body-sm` `text-body` `text-body-lg` `text-title` `text-heading` `text-display` — each carries its own line-height and weight; never pair with `leading-*`; never `text-sm`/`text-xs` |
| Radius | `rounded-sm` (badges) `rounded-md` (buttons, inputs) `rounded-lg` `rounded-xl` (cards) `rounded-full` |
| Layout | `flex` `grid` `grid-cols-2` `gap-2` `gap-3` `gap-4` `p-4` `p-6` `px-3` `py-2` `w-full` `min-w-0` `truncate` `tabular-nums` |
| Commodities (tags only) | `<Badge variant="electricity">` — likewise `water` `gas` `temperature` `emissions`. Never hand-compose a commodity tag from chart classes. Chart series labels may use `text-chart-<commodity>-700`. |

Rules that the audit found broken most often: a quiet delete in a table row is `<Button variant="ghost-destructive">`, never `ghost` plus red classes. Every destructive action goes through `AlertDialog`. `Select` shows no checkmark on the chosen option. `DropdownMenu` shrink-wraps to its widest item. `Dialog` is for 1–4 fields; longer forms go to `Sheet`. Neutral labels are `<Badge variant="outline">`.

**Every design ships a manifest.** Beside each `<Name>.dc.html` write `<Name>.manifest.json`, starting from `_manifest.example.json` in this project or, where that file is not beside you, from https://design.edgecom.ai/design-manifest.example.json — both are stamped with the system's current `designSystemVersion` and `designSystemDigest`, which are copied, never typed. One `components` entry per design-system element — and a component inside another is its own entry: a `Field` inside a `Sheet` is a `field` instance, not a part of `sheet`. Each entry carries a kebab-case `instanceId` also placed on the element as `data-instance` (on every declared instance, including ones the logic creates), the registry `component` id such as `alert-dialog`, its `variants` by axis — the axes its spec lists; `size` is an axis on every component that offers one, while `collapsible`, `compact` and other props are not variants and are not recorded — and its `parts`. An instance's `states` are the screen states it takes part in (`loading`, `empty`, `error`, `success`, `disabled`), never a control's own state such as checked. `tokens` lists the token ids reached for directly; scale steps (radius and type steps) are utilities, not tokens. `viewports`, `themes` and `states` name what is covered — `mobile` + `desktop`, `light` + `dark`, `loading` + `empty` + `error` + `success` are all required. An `approvedExceptions` entry names who has approved it; "pending" is a deviation to report. `SKILL.md` has the full rule; the implementing agent validates the manifest and reads it before the design.

**Presenting a design.** A portal page renders inside `ApplicationShell` — pass `nav`, `activeItem`, `user` and `buildings`, and the page as its children; never hand-build a sidebar and top bar from `Sidebar*` parts. One screen per design file. The design is responsive: the phone layout is the same file at a phone width (set the preview width to 390 to check it), never a phone frame drawn beside the desktop on one canvas. The screen's state and theme are the Design Component's props (`data-props`: `state` as `live | loading | empty | error`, `theme` as `light | dark`), switched from the props panel — never an on-canvas harness bar above the page. Every control in one toolbar takes the same `size`. Icons are lucide: inline the icon's 24×24 path at `size-4` with `stroke="currentColor"` and name it on the element as `data-lucide="bell-ring"`, so the implementer installs the same icon from `lucide-react`.

**Where the truth lives.** `styles.css` → `_ds_bundle.css`: the first block is every token (`:root` light, `.dark` overrides) in OKLCH. `guidelines/design.md`: the full design language and usage rules — read it before a screen. `components/general/<Name>/<Name>.prompt.md`: variants, sizes, parts and rules per component; `<Name>.d.ts`: the props you may pass.

```jsx
const { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } = window.EdgecomDS;

<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Northridge Distribution Center</CardTitle>
    <CardDescription>14 meters · live load 1.24 MW</CardDescription>
  </CardHeader>
  <CardContent className="flex items-center justify-between gap-3">
    <Badge variant="outline">Electricity</Badge>
    <span className="text-body-sm text-muted-foreground tabular-nums">Peak 412 kW</span>
    <Button size="sm" variant="outline">Open site</Button>
  </CardContent>
</Card>
```
