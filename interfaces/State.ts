import {
  Dispatch,
  SetStateAction
} from 'react'
import PlainUser from '@/interfaces/PlainUser'
interface State {
  unreadMessagesCount: number
  setUnreadMessagesCount: Dispatch<SetStateAction<number>>
  user?: PlainUser
}
export default State