/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'image.pollinations.ai',    // AI image generation
      'source.unsplash.com',      // Unsplash photos
      'images.unsplash.com',      // Unsplash photos
      'via.placeholder.com',      // Placeholder fallback
    ]
  },
  // Allows access from other devices on same WiFi
  // Run with: npm run dev -- --hostname 0.0.0.0
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  }
}
module.exports = nextConfig
