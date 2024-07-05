import {ReactElement, ReactNode} from 'react'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {NextFont} from 'next/dist/compiled/@next/font'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '@/assets/styles.css'
const inter: NextFont = Inter({subsets: ['latin']}) as NextFont
export const metadata: Metadata = {
  title: {
    template: '%s | PropertyPulse | Find the Perfect Rental' as string,
    default: 'PropertyPulse | Find the Perfect Rental' as string
  },
  description: 'Find the perfect rental property.' as string,
  keywords: 'find, rental, property' as string
} as Metadata
const RootLayout: React.FC<{children: ReactNode}> = ({children}: {children: ReactNode}): ReactElement => {
  return (
    <AuthProvider>
      <html lang='en'>
        <body className={inter.className as string}>
          <Navbar/>
          <main>{children as ReactNode}</main>
          <Footer/>
        </body>
      </html>
    </AuthProvider>
  )
}
export default RootLayout as React.FC<{children: ReactNode}>