import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

   images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};


export default nextConfig;
