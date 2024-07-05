import {NextConfig} from 'next'
import {ImageConfigComplete, RemotePattern} from 'next/dist/shared/lib/image-config'
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as string,
        hostname: 'lh2.googleusercontent.com' as string,
        pathname: '**' as string
      } as RemotePattern,
      {
        protocol: 'https' as string,
        hostname: 'res.cloudinary.com' as string,
        pathname: '**' as string
      } as RemotePattern
    ] as RemotePattern[]
  } as Partial<ImageConfigComplete>
} as NextConfig
export default nextConfig as NextConfig