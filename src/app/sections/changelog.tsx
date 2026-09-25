// Content for the "changelog" section. Loaded lazily by DocsShell — see
// sections.tsx and .claude/rules/docs-site.md.

import { Changelog } from "@/components/docs/changelog";
import { sectionPath, sections } from "../sections";



const content = {
  node: (
      <Changelog
        itemHref={(item) => {
          // globals.css ships as the `theme` registry item; its reference page
          // is Foundations -> Semantic colors.
          const target = sections.find((s) => s.id === (item === "theme" ? "colors" : item));
          return target ? sectionPath(target) : undefined;
        }}
      />
    ),
};

export default content;
