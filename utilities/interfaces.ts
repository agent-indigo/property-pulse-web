import {ReactNode} from 'react'
import {Date, Document, FlattenMaps, ObjectId} from 'mongoose'
import {Session} from 'next-auth'
import {AdapterUser} from 'next-auth/adapters'
import {GoogleProfile} from 'next-auth/providers/google'
// used
export interface buttonProps {
  link: string
  text: string
  backgroundColor: string
}
// used
export interface InfoBoxProps {
  heading: string
  backgroundColor?: string
  textColor?: string
  buttonProps: buttonProps
  children: ReactNode
}
// used
export interface Location {
  street: string
  city: string
  state: string
  zipcode: string
}
// used
export interface Rates {
  nightly?: number
  weekly?: number
  monthly?: number
}
// used
export interface SellerInfo {
  name: string
  email: string
  phone: string
}
// used
export interface ListedProperty {
  _id?: ObjectId
  owner?: ObjectId
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
  imageIds?: string[]
  is_featured?: boolean
  createdAt?: string
}
// used
export interface RegisteredUser extends Document {
  email: string
  username: string
  image?: string
  bookmarks?: string[]
}
// used
export interface AdapterUserWithId extends AdapterUser {
  id: string
}
// used
export interface SessionWithUserId extends Session {
  user: AdapterUserWithId
}
// used
export interface SpinnerProps {
  loading: boolean
}
// used
export interface ReactNodes {
  children: ReactNode
}
// used
export interface FormInput {
  name: string
  value: string
}
// used
export interface FormCheck {
  value: string
  checked: boolean
}
// used
export interface SessionData {
  data: SessionWithUserId | null
}
// used
export interface HeaderProps {
  image: string
}
// used
export interface Images {
  images: string[]
}
export interface PropertyIdFromRequest {
  propertyId: string
}
// used
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
// used
export interface InquiryMessage {
  _id?: ObjectId
  sender?: ObjectId | RegisteredUser
  recipient: ObjectId | RegisteredUser
  property: ObjectId | ListedProperty
  name: string
  email: string
  phone?: string
  body?: string
  read?: boolean
  createdAt?: Date
}
// used, might need edits
export interface PropertySearchParams {
  location?: string
  type?: string
  // try removing this
  page?: number
}
// used
export interface GoogleSignInParams {
  profile: GoogleProfile
}
// used
export interface GlobalState {
  unreadMessagesCount: number
  setUnreadMessagesCount: any
}
// used
export interface Pagination {
  page: number
  total: number
  size: number
}
// used
export interface ActionResponse {
  bookmarked?: boolean
  error?: any
  lat?: number
  lng?: number
  message?: string
  read?: boolean
  unreadMessagesCount?: number
  success: boolean
}
// used
export interface SerializedRates {
  nightly?: string
  weekly?: string
  monthly?: string
}
// used
export interface SerializedProperty {
  _id: string
  owner: string
  name: string
  type: string
  description: string
  location: Location
  beds: string
  baths: string
  square_feet: string
  amenities: string[]
  rates: Rates
  seller_info: SellerInfo
  images: string[]
  imageIds?: string[]
  is_featured: boolean
  createdAt: string
}
// used
export interface SerializedUser {
  _id: string
  email: string
  username: string
  image?: string
  bookmarks?: string[]
}
// used
export interface SerializedMessage {
  _id: string
  sender: SerializedUser
  recipient: SerializedUser
  property: SerializedProperty
  name: string
  email: string
  phone: string
  body: string
  read: boolean
  createdAt: string
}
export interface DocumentId {
  _id: ObjectId
}
// used
export interface LeanDocumentId {
  _id: FlattenMaps<ObjectId>
}
// used
export interface DestructuredSerializedProperty {
  property: SerializedProperty
}
// used
export interface DestructuredSerializedMessage {
  message: SerializedMessage
}
// used
export interface SubmitButtonProps {
  message: string
  action: string
}
// used
export interface PropertiesCompomentProps {
  properties: SerializedProperty[]
  page: number
  size: number
  total: number
}
// used
export interface SerializedProperties {
  properties: SerializedProperty[]
}
// used
export interface ShareButtonsProps {
  property: SerializedProperty
  PUBLIC_DOMAIN: string
}
export interface UrlSearchParams {
  searchParams: {
    page?: number
    size?: number
    location?: string
    type?: string
  }
}