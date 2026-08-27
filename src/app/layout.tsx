import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// The catalog renders in Inter. It is applied as an inline style rather than
// through `variable`, whose class selector has the same specificity as the
// :root default in globals.css — so which one won would depend on chunk order.
// Consuming apps get the system stack from the theme item and override it the
// same way, in their own CSS.
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edgecom Design System",
  description: "Edgecom Energy design system — tokens and components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={{ "--font-sans": inter.style.fontFamily } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
