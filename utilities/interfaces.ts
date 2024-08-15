import {ReactNode} from 'react'
import {Date, Document, Schema} from 'mongoose'
import {Session} from 'next-auth'
import {AdapterUser} from 'next-auth/adapters'
export interface InfoBoxProps {
  heading: string
  backgroundColor?: string
  textColor?: string
  buttonProps: {
    link: string
    text: string
    backgroundColor: string
  }
  children: ReactNode
}
export interface ListedProperty {
  _id?: Schema.Types.ObjectId
  owner?: Schema.Types.ObjectId
  name: string
  type: string
  description: string
  location: {
    street: string
    city: string
    state: string
    zipcode: string
  }
  beds: number
  baths: number
  square_feet: number
  amenities: string[]
  rates: {
    nightly?: number
    weekly?: number
    monthly?: number
  }
  seller_info: {
    name: string
    email: string
    phone: string
  }
  files?: File[]
  images?: string[]
  is_featured?: boolean
  createdAt?: string
  updatedAt?: string
}
export interface RegisteredUser extends Document {
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
export interface GeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number
        lng: number
      }
    }
  }>
  status: string
}
export interface SpinnerProps {
  loading: boolean
}
export interface ReactNodes {
  children: ReactNode
}
export interface DestructuredProperty {
  property: ListedProperty
}
export interface FormInput {
  name: string
  value: string
}
export interface FormCheck {
  value: string
  checked: boolean
}
export interface SessionData {
  data: SessionWithUserId | null
}
export interface IdFromUrl {
  id?: string
}
export interface HeaderProps {
  image: string
}
export interface Images {
  images: string[]
}
export interface ApiParams {
  params: {
    id: string
  }
}
export interface PropertyIdFromRequest {
  propertyId: string
}