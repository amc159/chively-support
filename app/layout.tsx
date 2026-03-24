import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://chively-support.vercel.app"),
  title: { default: "Chively Help Center", template: "%s | Chively Help" },
  description: "Support documentation for Chively POS — the restaurant management platform built for how you actually run your business.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Chively Help Center",
    description: "Support documentation for Chively POS — guides, troubleshooting, and hardware setup.",
    url: "https://chively-support.vercel.app",
    siteName: "Chively Help Center",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Chively Help Center" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chively Help Center",
    description: "Support documentation for Chively POS — guides, troubleshooting, and hardware setup.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
