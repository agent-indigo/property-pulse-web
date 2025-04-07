import {
  Dispatch,
  SetStateAction
} from 'react'
import PlainUser from '@/interfaces/PlainUser'
export default interface ContextProps {
  unreadMessagesCount: number
  setUnreadMessagesCount: Dispatch<SetStateAction<number>>
  user?: PlainUser
}