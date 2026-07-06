import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import {
  siteUrl,
  ogImage,
  faviconUrl,
  logoUrl,
} from "@/config/seo";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "SREALLABS | Cinematic 3D Product Animation & AI Commercial Studio",
    template: "%s | SREALLABS",
  },
  description:
    "SREALLABS creates cinematic 3D product animation, AI commercials, AI UGC videos and SaaS product films that help ambitious brands launch, grow and convert.",
  keywords: [
    "SREALLABS",
    "3D Product Animation",
    "AI Commercials",
    "AI UGC",
    "SaaS Videos",
    "Creative Technology",
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
    title: "SREALLABS | Reality, Rendered.",
    description:
      "Premium cinematic 3D product animation, AI commercials and visual storytelling for brands that want to stand out.",
    type: "website",
    siteName: "SREALLABS",
    locale: "en_US",
    url: siteUrl,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "SREALLABS — Reality, Rendered.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SREALLABS | Reality, Rendered.",
    description:
      "Premium cinematic 3D product animation, AI commercials and visual storytelling for brands that want to stand out.",
    images: [ogImage],
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

        {/* Organizational meta for search engines */}
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