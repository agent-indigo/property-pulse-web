import {
  Dispatch,
  SetStateAction
} from 'react'
import PlainUser from '@/interfaces/PlainUser'
export default interface State {
  unreadMessagesCount: number
  setUnreadMessagesCount: Dispatch<SetStateAction<number>>
  user?: PlainUser
}