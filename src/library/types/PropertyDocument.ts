import {
  Document,
  ObjectId
} from 'mongoose'
import PropertyLocation from '@/types/PropertyLocation'
import PropertyRates from '@/types/PropertyRates'
import PropertyContact from '@/types/PropertyContact'
export default interface PropertyDocument extends Document {
  owner: ObjectId
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