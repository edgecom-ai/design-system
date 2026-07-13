import { staticParams } from "@/docs/generated/routes";

/**
 * Enumerate every /{group}/{slug} pair so the static export pre-renders one
 * HTML file per docs section (required by `output: "export"` for dynamic
 * routes). The list is generated (scripts/gen-routes.mjs) because sections.tsx
 * is a "use client" module and can't be read from this server component.
 */
export function generateStaticParams() {
  return staticParams;
}

/**
 * Docs route: /{group}/{slug} — e.g. /components/slider, /blocks/form.
 * The interactive chrome (sidebar, header, content) is rendered once by the
 * (docs) route-group layout so it persists across navigations; this page only
 * needs to exist for the route to resolve and to declare its static params.
 */
export default function DocsRoutePage() {
  return null;
}
