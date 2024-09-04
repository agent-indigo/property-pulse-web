import PropertyContact from '@/interfaces/PropertyContact'
import PropertyLocation from '@/interfaces/PropertyLocation'
import PropertyRates from '@/interfaces/PropertyRates'
interface PropertyUpdate {
  name: string
  type: string
  description: string
  location: PropertyLocation
  beds: number
  baths: number
  square_feet: number
  amenities: string[]
  rates: PropertyRates
  seller_info: PropertyContact
}
export default PropertyUpdate