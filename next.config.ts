import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Redirects are processed before rewrites, so we can use redirects to exclude .swa routes from processing
  async redirects() {
    return [
      // Only exclude .swa routes from processing, don't redirect everything else
      {
        source: "/.swa/:path*",
        destination: "/.swa/:path*",
        permanent: true,
      },
    ];
  },

  // Replace redirects with rewrites for better handling of .swa routes
  async rewrites() {
    return {
      beforeFiles: [
        // Skip processing for any routes starting with /.swa/
        {
          source: "/.swa/:path*",
          destination: "/.swa/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
