import {ReactNode} from 'react'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '@/assets/styles.css'
const inter = Inter({subsets: ['latin']})
export const metadata: Metadata = {
  title: 'PropertyPulse | Find the Perfect Rental',
  description: 'Find the perfect rental property.',
  keywords: 'find, rental, property',
}
const RootLayout: React.FC<{children: ReactNode}> = ({children}: {children: ReactNode}) => {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Navbar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}
export default RootLayout