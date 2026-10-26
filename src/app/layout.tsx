import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Analytics } from "@/components/layout/Analytics";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { JsonLd } from "@/components/ui/JsonLd";
import { allowIndexing, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/** Search Console, URL-prefix property for the vercel.app address (added 2026-10-26). */
const GOOGLE_SITE_VERIFICATION = "9rUHTj1HEU8pAP6DJm74t1m6QT4BGZh58bABT0oNeGc";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Websites, SEO, Hosting and Branding`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  // Search Console HTML-tag tokens are public. Keep this one in place: Google re-checks it
  // to keep the property verified. NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION adds another.
  verification: {
    google: [GOOGLE_SITE_VERIFICATION, process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION].filter(
      (t): t is string => Boolean(t),
    ),
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${jakarta.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <RevealObserver />
        <ConsentBanner />
        <Analytics />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
