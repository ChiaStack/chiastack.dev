import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  reactCompiler: true,
  transpilePackages: ["@chiastack/*", "@t3-oss/env-nextjs", "@t3-oss/env-core"],
  experimental: {
    viewTransition: true,
    authInterrupts: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withMDX(config);
