import PlainDocument from '@/types/PlainDocument'
import PropertyContact from '@/types/PropertyContact'
import PropertyLocation from '@/types/PropertyLocation'
import PropertyRates from '@/types/PropertyRates'
export default interface PlainProperty extends PlainDocument {
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