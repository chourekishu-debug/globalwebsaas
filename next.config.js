/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'image.pollinations.ai',
      'source.unsplash.com',
      'images.unsplash.com',
      'via.placeholder.com',
    ]
  },
}
module.exports = nextConfig