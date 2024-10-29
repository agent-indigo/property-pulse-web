import {Metadata} from 'next'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {ClipLoader} from 'react-spinners'
export const metadata: Metadata = {
  title: 'Loading... | PropertyPulse | Find the Perfect Rental',
  description: 'Find the perfect rental property.',
  keywords: 'find, rental, property'
}
const LoadingPage: FunctionComponent<boolean> = (
  loading
): ReactElement => (
  <ClipLoader
    color='#3b82f6'
    loading={loading}
    cssOverride={{
      display: 'block',
      margin: '100px auto'
    }}
    size={150}
    aria-label='Loading Spinner'
  />
)
export default LoadingPage