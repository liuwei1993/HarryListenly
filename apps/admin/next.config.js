/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/listenly-admin",
  assetPrefix: "/listenly-admin",
  env: { NEXT_PUBLIC_BASE_PATH: "/listenly-admin" },
};
module.exports = nextConfig;
