"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { sections, sectionPath, firstSectionPath } from "./sections";

/**
 * Root route. Redirects `/` to the first section, and preserves legacy
 * `?c=<id>` deep links by mapping them to their clean `/{group}/{slug}` path.
 */
function RootRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const c = searchParams.get("c");
    const s = c ? sections.find((x) => x.id === c) : undefined;
    router.replace(s ? sectionPath(s) : firstSectionPath);
  }, [searchParams, router]);

  return null;
}

export default function Home() {
  return (
    <React.Suspense fallback={null}>
      <RootRedirect />
    </React.Suspense>
  );
}
