import {FlattenMaps} from 'mongoose'
import UserDocument from '@/interfaces/UserDocument'
interface State {
  unreadMessagesCount: number
  setUnreadMessagesCount: any
  user?: FlattenMaps<UserDocument>
}
export default State