import type { NextConfig } from "next";

// The docs site is deployed to GitHub Pages as a fully static export at the
// root of the custom domain (https://design.edgecom.ai). PAGES_BASE_PATH can
// inject a base path at build time for subpath-hosted builds; it is unset for
// local `pnpm dev` and the CI deploy, which both serve from "/".
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
