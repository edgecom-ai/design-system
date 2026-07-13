import type { NextConfig } from "next";

// The docs site is deployed to GitHub Pages as a fully static export
// (https://edgecom-ai.github.io/design-system/). The base path is injected at
// build time via PAGES_BASE_PATH so local `pnpm dev` and any root-hosted build
// stay at "/". The CI workflow sets PAGES_BASE_PATH=/design-system.
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
