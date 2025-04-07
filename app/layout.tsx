import {
  FunctionComponent,
  PropsWithChildren,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {NextFont} from 'next/dist/compiled/@next/font'
import {ToastContainer} from 'react-toastify'
import ContextProvider from '@/components/ContextProvider'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
const RootLayout: FunctionComponent<PropsWithChildren> = ({children}): ReactElement => (
  <AuthProvider>
    <ContextProvider>
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
    </ContextProvider>
  </AuthProvider>
)
export default RootLayout