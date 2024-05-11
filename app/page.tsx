import Hero from '@/components/Hero'
import InfoBoxes from '@/components/InfoBoxes'
import type {Metadata} from 'next'
export const metadata: Metadata = {
    title: 'Home | PropertyPulse | Find the Perfect Rental'
}
const Home: React.FC = () => {
    return (
        <>
            <Hero/>
            <InfoBoxes/>
        </>
    )
}
export default Home