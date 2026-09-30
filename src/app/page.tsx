import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import Hero from '@/src/library/components/Hero'
import InfoBoxes from '@/src/library/components/InfoBoxes'
import HomeProperties from '@/src/library/components/HomeProperties'
import FeaturedProperties from '@/src/library/components/FeaturedProperties'
export const metadata: Metadata = {
  title: 'Home | PropertyPulse | Find the Perfect Rental',
  description: 'Find the perfect rental property.',
  keywords: 'find, rental, property'
}
const HomePage: FunctionComponent = (): ReactElement => (
  <>
    <Hero/>
    <InfoBoxes/>
    <FeaturedProperties/>
    <HomeProperties/>
  </>
)
export default HomePage