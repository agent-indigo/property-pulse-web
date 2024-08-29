import PlainUser from '@/interfaces/PlainUser'
interface ServerActionResponse {
  bookmarked?: boolean
  error?: any
  lat?: number
  lng?: number
  message?: string
  read?: boolean
  success: boolean
  unreadMessagesCount?: number
  sessionUser?: PlainUser
}
export default ServerActionResponse