import {FlattenMaps} from 'mongoose'
import UserDocument from '@/interfaces/UserDocument'
interface ServerActionResponse {
  bookmarked?: boolean
  error?: any
  lat?: number
  lng?: number
  message?: string
  read?: boolean
  success: boolean
  unreadMessagesCount?: number
  sessionUser?: FlattenMaps<UserDocument>
}
export default ServerActionResponse