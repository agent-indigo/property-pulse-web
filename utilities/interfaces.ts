import {ReactNode} from 'react'
import {Date, Document, FlattenMaps, ObjectId} from 'mongoose'
import {Session} from 'next-auth'
import {AdapterUser} from 'next-auth/adapters'
import {GoogleProfile} from 'next-auth/providers/google'
export interface ButtonProps {
  link: string
  text: string
  backgroundColor: string
}
export interface InfoBoxProps {
  heading: string
  backgroundColor?: string
  textColor?: string
  buttonProps: ButtonProps
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
export interface RegisteredUser extends Document {
  email: string
  username: string
  image?: string
  bookmarks?: string[]
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
export interface HeaderProps {
  image: string
}
export interface Images {
  images: string[]
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
export interface PropertySearchParams {
  location?: string
  type?: string
}
export interface GoogleSignInParams {
  profile: GoogleProfile
}
export interface GlobalState {
  unreadMessagesCount: number
  setUnreadMessagesCount: any
}
export interface Pagination {
  page: number
  total: number
  size: number
}
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
export interface SerializedRates {
  nightly?: string
  weekly?: string
  monthly?: string
}
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
export interface SerializedUser {
  _id: string
  email: string
  username: string
  image?: string
  bookmarks?: string[]
}
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
export interface LeanDocumentId {
  _id: FlattenMaps<ObjectId>
}
export interface DestructuredSerializedProperty {
  property: SerializedProperty
}
export interface DestructuredSerializedMessage {
  message: SerializedMessage
}
export interface SubmitButtonProps {
  message: string
  action: string
}
export interface PropertiesCompomentProps {
  properties: SerializedProperty[]
  page: number
  size: number
  total: number
}
export interface SerializedProperties {
  properties: SerializedProperty[]
}
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
export interface DocumentId {
  _id: ObjectId
}