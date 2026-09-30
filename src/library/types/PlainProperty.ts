import PlainDocument from '@/src/library/types/PlainDocument'
import PropertyContact from '@/src/library/types/PropertyContact'
import PropertyLocation from '@/src/library/types/PropertyLocation'
import PropertyRates from '@/src/library/types/PropertyRates'
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