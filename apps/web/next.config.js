/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/listenly",
  assetPrefix: "/listenly",
  env: { NEXT_PUBLIC_BASE_PATH: "/listenly" },
};
module.exports = nextConfig;
