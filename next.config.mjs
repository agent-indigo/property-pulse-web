const VERCEL_URL = process.env.VERCEL_URL ?? ''
const nextConfig = {
  env: {
    NEXTAUTH_URL: VERCEL_URL === '' ? 'http://localhost:3000' : `https://${VERCEL_URL}`
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**'
      }
    ]
  }
}
export default nextConfig