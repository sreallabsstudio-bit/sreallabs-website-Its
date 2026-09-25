import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*"],
  // Deep-link support: this is a single-route SPA (app shell at "/").
  // afterFiles rewrites serve the same app shell for direct visits/refreshes
  // of /work, /about, /services, /contact. The zustand store reads
  // window.location.pathname on hydration and renders the right page.
  // Checked AFTER real pages/public files: /api/*, /_next/*, /sitemap.xml,
  // /robots.txt are unaffected; unknown paths still 404.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/work", destination: "/" },
        { source: "/about", destination: "/" },
        { source: "/services", destination: "/" },
        { source: "/contact", destination: "/" },
      ],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;