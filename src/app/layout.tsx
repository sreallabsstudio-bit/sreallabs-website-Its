import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SREALLABS — Reality, Rendered.",
  description:
    "Premium Creative Technology Studio specializing in cinematic 3D product animation, AI commercials, AI UGC, SaaS product videos and creative storytelling.",
  keywords: [
    "SREALLABS",
    "3D Product Animation",
    "AI Commercials",
    "AI UGC",
    "SaaS Videos",
    "Creative Technology",
    "Product Video",
    "CGI",
  ],
  authors: [{ name: "SREALLABS" }],
  icons: {
    icon: "https://res.cloudinary.com/dekgwo8bc/image/upload/v1782346170/A_minimalist_geometric_corporate_icon_202606250108_gcyorw.jpg",
  },
  openGraph: {
    title: "SREALLABS — Reality, Rendered.",
    description:
      "Premium Creative Technology Studio specializing in cinematic 3D product animation, AI commercials, and creative storytelling.",
    type: "website",
    siteName: "SREALLABS",
  },
  twitter: {
    card: "summary_large_image",
    title: "SREALLABS — Reality, Rendered.",
    description:
      "Premium Creative Technology Studio specializing in cinematic 3D product animation, AI commercials, and creative storytelling.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${manrope.variable} ${inter.variable} font-sans antialiased bg-obsidian text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}