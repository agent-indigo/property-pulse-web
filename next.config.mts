import {NextConfig} from 'next'
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh2.googleusercontent.com',
        pathname: '**'
      }
    ]
  }
}
export default nextConfig