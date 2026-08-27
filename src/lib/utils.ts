import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// tailwind-merge only knows Tailwind's own font-size scale, so it reads a
// `text-<name>` it doesn't recognise as a *colour*. Left unconfigured, the
// semantic type tokens land in the text-color group and any real colour class on
// the same element silently deletes them — `cn("text-body text-muted-foreground")`
// returns just the colour, and the element ends up with no font-size at all.
// Registering them as font-size keeps both, and still lets one size override
// another (including Tailwind's own).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "caption",
            "body-sm",
            "body",
            "body-lg",
            "title",
            "heading",
            "display",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
