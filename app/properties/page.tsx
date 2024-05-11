import Link from 'next/link'
import type {Metadata} from 'next'
export const metadata: Metadata = {
    title: 'Properties | PropertyPulse | Find the Perfect Rental'
}
const Properties: React.FC = () => {
    return (
        <>
            <h1 className="text-3xl">Properties</h1>
            <Link href='/'>Home</Link>
        </>
    )
}
export default Properties