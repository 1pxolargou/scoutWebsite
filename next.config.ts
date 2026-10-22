import type { NextConfig } from "next";

/**
 * Προς το παρόν το site βγαίνει ως στατικά αρχεία (φάκελος out/).
 * Όταν ανέβει στο Vercel με φόρμα επικοινωνίας και ωριαία ανανέωση νέων,
 * αφαιρούμε το output: "export" (βλ. README).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
