import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

// The catalog renders in Inter. It is applied as an inline style on <html>
// rather than through a class, whose selector has the same specificity as the
// :root default in globals.css — so which one won would depend on chunk order.
// Consuming apps get the system stack from the theme item and override it the
// same way, in their own CSS.
import "@fontsource-variable/inter";
import "@/app/globals.css";

import { router } from "@/router";

document.documentElement.style.setProperty(
  "--font-sans",
  '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
);

const el = document.getElementById("root");
if (!el) throw new Error("#root missing from index.html");

createRoot(el).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
