import PlainDocument from '@/interfaces/PlainDocument'
import PropertyContact from '@/interfaces/PropertyContact'
import PropertyLocation from '@/interfaces/PropertyLocation'
import PropertyRates from '@/interfaces/PropertyRates'
interface PlainProperty extends PlainDocument {
  owner: string
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
  images: string[]
  imageIds: string[]
  is_featured: boolean
}
export default PlainProperty