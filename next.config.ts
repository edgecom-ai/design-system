import type { NextConfig } from "next";

// The docs site is a fully static export deployed to GitHub Pages and served at
// the custom domain https://design.edgecom.ai (root path) — no base path by
// default. PAGES_BASE_PATH can still inject one for a sub-path deployment (e.g.
// a project-pages URL); local `pnpm dev` stays at "/".
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves directory-style URLs; emit <route>/index.html.
  trailingSlash: true,
  // basePath also prefixes the _next asset URLs, so no separate assetPrefix.
  ...(basePath ? { basePath } : {}),
  // Exposed to the client so runtime fetches (e.g. /docs-source/*.json) can be
  // prefixed with the base path — Next only auto-prefixes <Link>/router/next-image.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    // Static export has no image-optimization server.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shadcnstudio.com",
      },
    ],
  },
};

export default nextConfig;
