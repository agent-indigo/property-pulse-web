import PlainUser from '@/interfaces/PlainUser'
export default interface ServerActionResponse {
  bookmarked?: boolean
  error?: string | Error
  lat?: number
  lng?: number
  message?: string
  propertyId?: string
  read?: boolean
  success: boolean
  unreadMessagesCount?: number
  sessionUser?: PlainUser
  stack?: string
}