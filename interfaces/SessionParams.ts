import {Session} from 'next-auth'
import {JWT} from 'next-auth/jwt'
import AdapterUserWithId from '@/interfaces/AdapterUserWithId'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
export default interface SessionParams {
  session: Session
  token?: JWT
  user: AdapterUserWithId
  newSession: SessionWithUserId
  trigger: 'update'
}