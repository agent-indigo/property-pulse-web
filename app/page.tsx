import {FunctionComponent, ReactElement} from 'react'
import {Metadata} from 'next'
import Hero from '@/components/Hero'
import InfoBoxes from '@/components/InfoBoxes'
import HomeProperties from '@/components/HomeProperties'
export const metadata: Metadata = {
  title: 'Home | PropertyPulse | Find the Perfect Rental',
  description: 'Find the perfect rental property.',
  keywords: 'find, rental, property'
}
const HomePage: FunctionComponent = (): ReactElement => (
  <>
    <Hero/>
    <InfoBoxes/>
    <HomeProperties/>
  </>
)
export default HomePage