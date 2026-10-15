import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Leverandørens produktbilleder (ZonyouTech) hentes fra deres billed-CDN.
    remotePatterns: [{ protocol: "https", hostname: "assets.laicms.com", pathname: "/7243e482us/**" }],
  },
  async redirects() {
    return [
      // Engelske/alternative stier peger permanent på de danske URL'er.
      { source: "/products", destination: "/shop", permanent: true },
      { source: "/products/:slug", destination: "/produkter/:slug", permanent: true },
      { source: "/produkter", destination: "/shop", permanent: true },
      { source: "/kategori", destination: "/shop", permanent: true },
      { source: "/cart", destination: "/kurv", permanent: true },
      // Produkter og kategorier, der er udgået af sortimentet.
      { source: "/produkter/nakkemassager", destination: "/shop", permanent: true },
      { source: "/produkter/haandmassager", destination: "/shop", permanent: true },
      { source: "/produkter/hovedbundsmassager", destination: "/shop", permanent: true },
      { source: "/kategori/nakke-og-skuldre", destination: "/shop", permanent: true },
      { source: "/kategori/oejne-og-haender", destination: "/kategori/oejenmassagere", permanent: true },
      { source: "/kategori/hoved-og-hovedbund", destination: "/shop", permanent: true },
      { source: "/about", destination: "/om-vellivo", permanent: true },
      { source: "/contact", destination: "/kontakt", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
