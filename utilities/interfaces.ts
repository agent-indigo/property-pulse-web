import {Dispatch, ReactNode, SetStateAction} from 'react'
import mongoose, {Date, Document} from 'mongoose'
import {Session} from 'next-auth'
import {AdapterUser} from 'next-auth/adapters'
import {GoogleProfile} from 'next-auth/providers/google'
export interface buttonProps {
  link: string
  text: string
  backgroundColor: string
}
export interface InfoBoxProps {
  heading: string
  backgroundColor?: string
  textColor?: string
  buttonProps: buttonProps
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
  _id?: mongoose.Types.ObjectId
  owner?: mongoose.Types.ObjectId
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
export interface RegisteredUser extends Document {
  email: string
  username: string
  image?: string
  bookmarks?: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}
export interface AdapterUserWithId extends AdapterUser {
  id: string
}
export interface SessionWithUserId extends Session {
  user: AdapterUserWithId
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
export interface PropertyIdFromRequest {
  propertyId: string
}
export interface PropertySearchQuery {
  $or?: Array<{
    name?: RegExp
    description?: RegExp
    'location.street'?: RegExp
    'location.city'?: RegExp
    'location.state'?: RegExp
    'location.zipcode'?: RegExp
  }>
  type?: RegExp
}
export interface InquiryMessage {
  _id?: mongoose.Types.ObjectId
  sender?: mongoose.Types.ObjectId | RegisteredUser
  recipient: mongoose.Types.ObjectId | RegisteredUser
  property: mongoose.Types.ObjectId | ListedProperty
  name: string
  email: string
  phone?: string
  body?: string
  read?: boolean
  createdAt?: Date
}
export interface PropertySearchParams {
  location?: string
  type?: string
}
export interface GoogleSignInParams {
  profile: GoogleProfile
}
export interface GeoCodingErrorResponse {
  lat: string
  lng: string
}
export interface DestructuredMessage {
  message: InquiryMessage
}
export interface GlobalState {
  unreadCount: number
  setUnreadCount?: Dispatch<SetStateAction<number>>
}
export interface ImportedGlobalState {
  unreadCount?: number
  setUnreadCount: Dispatch<SetStateAction<number>>
}
export interface GetPropertiesResponse {
  properties: ListedProperty[]
  total: number
}
export interface Pagination {
  page: number
  total: number
  paginate: Function
}