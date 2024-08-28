import {Session} from 'next-auth'
import AdapterUserWithId from '@/interfaces/AdapterUserWithId'
interface SessionWithUserId extends Session {
  user: AdapterUserWithId
}
export default SessionWithUserId