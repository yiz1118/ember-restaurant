import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "./globals.css";
import "./motion.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/shared";
import { RevealObserver } from "@/components/reveal-observer";
import { creator } from "@/config/creator";
import { site } from "@/data/site";

const conceptDescription = `${site.name}, an independent restaurant concept website designed and developed by ${creator.name}. ${site.line}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3200"),
  title: { default: "EMBER | A Live-Fire Dining Concept", template: "%s | EMBER" },
  description: conceptDescription,
  authors: [{ name: creator.name, url: creator.portfolioUrl || creator.linkedinUrl }],
  creator: creator.name,
  robots: { index: false, follow: false },
  openGraph: { title: "EMBER | A Live-Fire Dining Concept", description: conceptDescription },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header /><RevealObserver />{children}<Footer /></body></html>;
}
