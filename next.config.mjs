/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? "/leejinhyuk0325.github.io/" : "",
  basePath: isProd ? "/leejinhyuk0325.github.io" : "",
  output: "export",
};

export default nextConfig;
