import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// The docs site is deployed to GitHub Pages as a fully static build at the root
// of the custom domain (https://design.edgecom.ai). PAGES_BASE_PATH injects a
// base path for subpath-hosted builds; it is unset for local `pnpm dev` and the
// CI deploy, which both serve from "/". Vite exposes it to the client as
// `import.meta.env.BASE_URL`, which replaces Next's NEXT_PUBLIC_BASE_PATH.
//
// `base` must end in "/" for Vite to rewrite asset URLs correctly, while the
// prerender step wants the prefix without a trailing slash; normalise here.
const raw = process.env.PAGES_BASE_PATH ?? "";
const base = raw ? `${raw.replace(/\/$/, "")}/` : "/";

export default defineConfig({
  base,
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: "out",
    // The docs shell plus 70 lazily-loaded section chunks; the default 500 kB
    // warning fires on the vendor chunk and says nothing actionable.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Keep React and the router in one long-lived chunk so a section edit
        // doesn't invalidate the framework for every visitor.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return "react";
          }
          if (id.includes("@tanstack")) return "router";
        },
      },
    },
  },
  server: { port: 3000 },
  preview: { port: 3000 },
});
