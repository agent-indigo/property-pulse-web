import {Session} from "next-auth"
import {AdapterUser} from "next-auth/adapters"
import {JWT} from "next-auth/jwt"
interface SessionParams {
  session: Session
  token?: JWT
  user?: AdapterUser
}
export default SessionParams