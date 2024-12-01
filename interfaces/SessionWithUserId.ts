import {Session} from 'next-auth'
import AdapterUserWithId from '@/interfaces/AdapterUserWithId'
export default interface SessionWithUserId extends Session {
  user: AdapterUserWithId
}