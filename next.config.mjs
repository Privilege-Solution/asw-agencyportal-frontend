/** @type {import('next').NextConfig} */
const nextConfig = {
  //trailingSlash: true,
  basePath: '/agency',
  assetPrefix: '/agency',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
