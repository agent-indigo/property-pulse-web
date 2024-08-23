import {FunctionComponent, ReactElement} from 'react'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {NextFont} from 'next/dist/compiled/@next/font'
import {ToastContainer} from 'react-toastify'
import StateProvider from '@/components/StateProvider'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {ReactNodes} from '@/utilities/interfaces'
import 'react-toastify/dist/ReactToastify.css'
import 'photoswipe/dist/photoswipe.css'
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
const RootLayout: FunctionComponent<ReactNodes> = (
  {children}
): ReactElement => (
  <StateProvider>
    <AuthProvider>
      <html lang='en'>
        <body className={inter.className}>
          <Navbar/>
          <main>
            {children}
          </main>
          <Footer/>
          <ToastContainer/>
        </body>
      </html>
    </AuthProvider>
  </StateProvider>
)
export default RootLayout