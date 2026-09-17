import * as React from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  useParams,
} from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { DocsShell } from "@/app/docs-shell";
import { sections, sectionPath, firstSectionPath } from "@/app/sections";

/**
 * Code-based route tree.
 *
 * The plan (§7 Phase 1) called for file-based routes. Code-based is used
 * instead because the site has exactly three route *shapes* — the redirect at
 * `/`, one dynamic `/{group}/{slug}` covering all 70 docs sections, and the
 * standalone block previews — so file-based routing would add a generated
 * `routeTree.gen.ts` and a codegen step for no extra expressiveness, in a repo
 * whose CI fails on drift in generated files. The intent behind the plan's
 * wording — a persistent shell layout and one lazily loaded component per
 * section — is met below and in `sections.tsx`.
 */
const rootRoute = createRootRoute({
  component: function RootLayout() {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  },
});

/**
 * The docs chrome lives in a pathless layout route, above the dynamic
 * `$group/$slug` segment, so it persists across every navigation instead of
 * remounting — the same reason the Next build put it at the static `(docs)`
 * segment rather than at the dynamic one. It deliberately does not render an
 * `<Outlet />`: `DocsShell` looks the section up itself and renders the whole
 * page, so the child route exists only to make the URL resolve.
 */
const docsLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "docs",
  component: function DocsLayout() {
    const params = useParams({ strict: false }) as {
      group?: string;
      slug?: string;
    };
    return <DocsShell group={params.group ?? ""} slug={params.slug ?? ""} />;
  },
});

const docsRoute = createRoute({
  getParentRoute: () => docsLayoutRoute,
  path: "/$group/$slug",
  component: () => null,
});

/**
 * Root route. Redirects `/` to the first section, and preserves legacy
 * `?c=<id>` deep links by mapping them to their clean `/{group}/{slug}` path.
 * A `beforeLoad` redirect replaces the Next version's effect-based
 * `router.replace`, so the destination is resolved before anything renders
 * rather than after a mount.
 */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>) => ({
    c: typeof search.c === "string" ? search.c : undefined,
  }),
  beforeLoad: ({ search }) => {
    const s = search.c ? sections.find((x) => x.id === search.c) : undefined;
    throw redirect({ to: s ? sectionPath(s) : firstSectionPath, replace: true });
  },
});

/**
 * Standalone block previews, outside the docs chrome — one route per
 * `src/app/statistics-component-*\/page.tsx`. Listed explicitly rather than
 * built from a template literal so each one becomes its own Rollup chunk and
 * none of them enter the docs bundle. `scripts/prerender.mjs` discovers the
 * same directories from disk; keep the two in step.
 */
const blockPreviews: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
  "statistics-component-02": () => import("@/app/statistics-component-02/page"),
  "statistics-component-07": () => import("@/app/statistics-component-07/page"),
  "statistics-component-09": () => import("@/app/statistics-component-09/page"),
  "statistics-component-10": () => import("@/app/statistics-component-10/page"),
  "statistics-component-14": () => import("@/app/statistics-component-14/page"),
  "statistics-component-15": () => import("@/app/statistics-component-15/page"),
  "statistics-component-19": () => import("@/app/statistics-component-19/page"),
  "statistics-component-21": () => import("@/app/statistics-component-21/page"),
  "statistics-component-22": () => import("@/app/statistics-component-22/page"),
};

const blockPreviewRoutes = Object.entries(blockPreviews).map(([name, load]) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: `/${name}`,
    component: React.lazy(load),
  }),
);

const routeTree = rootRoute.addChildren([
  indexRoute,
  docsLayoutRoute.addChildren([docsRoute]),
  ...blockPreviewRoutes,
]);

export const router = createRouter({
  routeTree,
  // GitHub Pages serves directory-style URLs and every llms.txt entry carries a
  // trailing slash, so links must keep producing them (Next: `trailingSlash: true`).
  trailingSlash: "always",
  basepath: import.meta.env.BASE_URL,
  defaultPreload: "intent",
  scrollRestoration: false,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
