import * as React from "react";
import { Link as RouterLink } from "@tanstack/react-router";

/**
 * `href`-shaped drop-in for TanStack Router's `Link`.
 *
 * TanStack's own `Link` takes `to` and type-checks it against the route tree,
 * which suits an app whose links are known route ids. This site's links are not:
 * `sections.tsx` and the changelog build paths from generated data, and the
 * vendored shadcn-studio demos are upstream files carrying `href='#'` that
 * should stay diffable against upstream. Both were written against `next/link`,
 * whose prop is `href`.
 *
 * So: keep the `href` prop, and route on the value rather than the type.
 * Anything that isn't an in-app path — `#`, `http(s)://`, `mailto:`, `tel:` —
 * renders a plain anchor, because handing those to the router would either
 * fail to match or swallow the navigation.
 */
const isExternal = (href: string) =>
  href === "" ||
  href.startsWith("#") ||
  href.startsWith("http://") ||
  href.startsWith("https://") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:") ||
  href.startsWith("//");

export type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & { href: string };

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link({ href, ...props }, ref) {
    if (isExternal(href)) return <a ref={ref} href={href} {...props} />;
    return (
      // `to` is typed against the route tree; these paths are data-derived and
      // validated by the prerender step instead (every generated route gets an
      // HTML file, and verify:docs loads a sample in a real browser).
      <RouterLink ref={ref} to={href as never} {...props} />
    );
  },
);
