import type { NextConfig } from "next";

const config: NextConfig = {
  ...(process.env.VERCEL === "1" ? {} : { output: "standalone" as const }),
  outputFileTracingIncludes: {
    "/admin": ["./public/images/**/*"],
    "/icon": ["./public/images/**/*"],
  },
  distDir: process.env.SKS_TEST_BUILD === "true" ? ".next-test" : ".next",
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  // Server Actions can receive passwords; do not print their arguments in development.
  logging: { serverFunctions: false },
  // Les caches persistants ont saturé le disque local pendant le développement.
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains",
                },
              ]
            : []),
        ],
      },
    ];
  },
};
export default config;
