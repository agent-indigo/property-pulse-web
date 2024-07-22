import {ReactElement, ReactNode} from 'react'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {NextFont} from 'next/dist/compiled/@next/font'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '@/assets/styles.css'
const inter: NextFont = Inter({subsets: ['latin']})
export const metadata: Metadata = {
  title: {
    template: '%s | PropertyPulse | Find the Perfect Rental',
    default: 'PropertyPulse | Find the Perfect Rental'
  },
  description: 'Find the perfect rental property.',
  keywords: 'find, rental, property'
}
const RootLayout: React.FC<{children: ReactNode}> = ({children}: {children: ReactNode}): ReactElement => (
  <AuthProvider>
    <html lang='en'>
      <body className={inter.className}>
        <Navbar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  </AuthProvider>
)
export default RootLayout