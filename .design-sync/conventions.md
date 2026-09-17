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
| Commodities (tags only) | `bg-chart-electricity-500/10` + `text-chart-electricity-700`, likewise `water` `gas` `temperature` `emissions` |

Rules that the audit found broken most often: a quiet delete in a table row is `<Button variant="ghost-destructive">`, never `ghost` plus red classes. Every destructive action goes through `AlertDialog`. `Select` shows no checkmark on the chosen option. `DropdownMenu` shrink-wraps to its widest item. `Dialog` is for 1–4 fields; longer forms go to `Sheet`. Neutral labels are `<Badge variant="outline">`.

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
