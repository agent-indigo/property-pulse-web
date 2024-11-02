import {
  User,
  Account,
  Profile
} from 'next-auth'
import {AdapterUser} from 'next-auth/adapters'
import {CredentialInput} from 'next-auth/providers/credentials'
import {GoogleProfile} from 'next-auth/providers/google'
interface SignInParams {
  user?: User | AdapterUser
  account?: Account | null
  profile?: Profile | GoogleProfile
  email?: {
    verificationRequest?: boolean
  }
  credentials?: Record<
    string,
    CredentialInput
  >
}
export default SignInParams