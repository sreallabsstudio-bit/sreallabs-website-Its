import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import {
  siteUrl,
  faviconUrl,
} from "@/config/seo";
import { getSeoSettings } from "@/lib/site-content-server";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  // Admin-editable SEO (falls back to the current site values if the DB is
  // unavailable or not yet configured).
  let seo: { siteTitle: string; metaDescription: string; ogImageUrl: string };
  try {
    seo = await getSeoSettings();
  } catch {
    seo = {
      siteTitle:
        "SREALLABS | Cinematic 3D Product Animation & AI Commercial Studio",
      metaDescription:
        "SREALLABS creates cinematic 3D product animation, AI commercials, AI UGC videos and SaaS product films that help ambitious brands launch, grow and convert.",
      ogImageUrl: "",
    };
  }
  const og = seo.ogImageUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.siteTitle,
      template: "%s | SREALLABS",
    },
    description: seo.metaDescription,
    keywords: [
      "SREALLABS",
      "3D Product Animation",
      "3D Product Visualization",
      "Photorealistic Product Rendering",
      "Cinematic Product Films",
      "3D Product Explainer Animation",
      "Industrial Product Visualization",
      "Product Video",
      "CGI",
      "Motion Design",
      "Creative Storytelling",
      "Cinematic Animation",
    ],
    authors: [{ name: "Salome", url: `${siteUrl}/about` }],
    creator: "SREALLABS",
    publisher: "SREALLABS",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: seo.siteTitle,
      description: seo.metaDescription,
      type: "website",
      siteName: "SREALLABS",
      locale: "en_US",
      url: siteUrl,
      images: og
        ? [
            {
              url: og,
              width: 1200,
              height: 630,
              alt: "SREALLABS — Reality, Rendered.",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteTitle,
      description: seo.metaDescription,
      images: og ? [og] : undefined,
      creator: "@sreallabs",
      site: "@sreallabs",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
    verification: {},
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Stale chunk recovery — reloads page once when a chunk fails to load
            (happens after deployments when the browser caches old chunk hashes) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('error',function(e){if(e.target&&e.target.tagName==='SCRIPT'&&e.target.src&&e.target.src.includes('/_next/')){e.preventDefault();sessionStorage.setItem('sreallabs_chunk_reload','1');window.location.reload()}},true);if(sessionStorage.getItem('sreallabs_chunk_reload')==='1'){sessionStorage.removeItem('sreallabs_chunk_reload');window.location.reload()}`,
          }}
        />
        <meta name="author" content="Salome" />
        <meta name="publisher" content="SREALLABS" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="msapplication-TileColor" content="#0A0A0A" />
      </head>
      <body className={`${manrope.variable} ${inter.variable} font-sans antialiased bg-obsidian text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}