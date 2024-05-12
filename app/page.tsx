import Hero from '@/components/Hero'
import InfoBoxes from '@/components/InfoBoxes'
import HomeProperties from '@/components/HomeProperties'
import type {Metadata} from 'next'
export const metadata: Metadata = {
    title: 'Home | PropertyPulse | Find the Perfect Rental'
}
const Home: React.FC = () => {
    return (
        <>
            <Hero/>
            <InfoBoxes/>
            <HomeProperties/>
        </>
    )
}
export default Home