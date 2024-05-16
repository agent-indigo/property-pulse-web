import {ReactNode} from 'react'
import {Schema} from 'mongoose'
interface ButtonInfo {
  link: string
  text: string
  backgroundColor: string
}
export interface InfoBoxProps {
  heading: string
  backgroundColor?: string
  textColor?: string
  buttonInfo: ButtonInfo
  children: ReactNode
}
interface Location {
  street: string
  city: string
  state: string
  zipcode: string
}
interface Rates {
  nightly?: number
  weekly?: number
  monthly?: number
}
interface SellerInfo {
  name: string
  email: string
  phone: string
}
export interface IProperty {
  _id: string
  owner: Schema.Types.ObjectId
  name: string
  type: string
  description: string
  location: Location
  beds: number
  baths: number
  square_feet: number
  amenities: string[]
  rates: Rates
  seller_info: SellerInfo
  images: string[]
  is_featured: boolean
  createdAt: string
  updatedAt: string
}
export interface IUser {
  email: string
  username: string
  image?: string
  bookmarks?: Schema.Types.ObjectId[]
  createdAt: string
  updatedAt: string
}