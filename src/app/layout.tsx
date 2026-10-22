import type { Metadata, Viewport } from "next";
import { Fira_Sans_Extra_Condensed, Noto_Sans } from "next/font/google";
import { siteConfig } from "@site-config";
import { t } from "@/i18n/el";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const heading = Fira_Sans_Extra_Condensed({
  variable: "--font-heading-face",
  subsets: ["greek", "latin"],
  weight: ["600", "700"],
  display: "swap",
});

const body = Noto_Sans({
  variable: "--font-body",
  subsets: ["greek", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.tagline,
  icons: { icon: "/brand/logo.jpg", apple: "/brand/logo.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#164a2f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="el" className={`${heading.variable} ${body.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-scout-red px-4 py-2 font-semibold text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t.skipToContent}
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
