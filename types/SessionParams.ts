import {Session} from 'next-auth'
import {JWT} from 'next-auth/jwt'
import {AdapterUser} from 'next-auth/adapters'
export default interface SessionParams {
  session: Session
  token?: JWT
  user: AdapterUser
  newSession: Session
  trigger: 'update'
}