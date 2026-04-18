import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  productionBrowserSourceMaps: false,

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  compiler: {
    removeConsole: { exclude: ["error", "warn"] },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src * data: blob: 'unsafe-inline' 'unsafe-eval'",
              "img-src * data: blob:",
              "script-src * 'unsafe-inline' 'unsafe-eval'",
              "style-src * 'unsafe-inline'",
              "frame-src *",
              "connect-src *",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
