import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {NextFont} from 'next/dist/compiled/@next/font'
import {ToastContainer} from 'react-toastify'
import GlobalContextProvider from '@/components/GlobalContextProvider'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import 'react-toastify/dist/ReactToastify.css'
import 'photoswipe/dist/photoswipe.css'
import '@/assets/styles.css'
import DestructuredReactNode from '@/interfaces/DestructuredReactNode'
const inter: NextFont = Inter({subsets: ['latin']})
export const metadata: Metadata = {
  title: {
    template: '%s | PropertyPulse | Find the Perfect Rental',
    default: 'PropertyPulse | Find the Perfect Rental'
  },
  description: 'Find the perfect rental property.',
  keywords: 'find, rental, property'
}
const RootLayout: FunctionComponent<DestructuredReactNode> = ({children}): ReactElement => (
  <AuthProvider>
    <GlobalContextProvider>
      <html lang='en'>
        <body className={inter.className}>
          <noscript>
            We're very sorry, but you will need to enable JavaScript in
            your web browser before you will be able to use our website.
          </noscript>
          <Navbar/>
          <main>
            {children}
          </main>
          <Footer/>
          <ToastContainer/>
        </body>
      </html>
    </GlobalContextProvider>
  </AuthProvider>
)
export default RootLayout