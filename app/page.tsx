import type {Metadata} from 'next'
import {ReactElement} from 'react'
import Hero from '@/components/Hero'
import InfoBoxes from '@/components/InfoBoxes'
import HomeProperties from '@/components/HomeProperties'
export const metadata: Metadata = {
  title: 'Home | PropertyPulse | Find the Perfect Rental' as string,
  description: 'Find the perfect rental property.' as string,
  keywords: 'find, rental, property' as string
} as Metadata
const HomePage: React.FC = (): ReactElement => {
  return (
    <>
      <Hero/>
      <InfoBoxes/>
      <HomeProperties/>
    </>
  )
}
export default HomePage as React.FC