import {ReactNode} from 'react'
import {Date, Schema} from 'mongoose'
import {Session} from 'next-auth'
import {AdapterUser} from 'next-auth/adapters'
export interface ButtonProps {
  link: string
  text: string
  backgroundColor: string
}
export interface InfoBoxProps {
  heading: string
  backgroundColor?: string
  textColor?: string
  buttonInfo: ButtonProps
  children: ReactNode
}
export interface Location {
  street: string
  city: string
  state: string
  zipcode: string
}
export interface Rates {
  nightly?: number
  weekly?: number
  monthly?: number
}
export interface SellerInfo {
  name: string
  email: string
  phone: string
}
export interface ListedProperty {
  _id?: Schema.Types.ObjectId
  owner?: Schema.Types.ObjectId
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
  files?: File[]
  images?: string[]
  is_featured?: boolean
  createdAt?: string
  updatedAt?: string
}
export interface RegisteredUser {
  _id: Schema.Types.ObjectId
  email: string
  username: string
  image?: string
  bookmarks?: Schema.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}
export interface AdapterUserWithId extends AdapterUser {
  id: string
}
export interface SessionWithUserId extends Session {
  user: AdapterUserWithId
}