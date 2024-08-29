import {Account, AuthOptions, Profile, Session, User} from 'next-auth'
import {JWT} from 'next-auth/jwt'
import {AdapterUser} from 'next-auth/adapters'
import {CredentialInput} from 'next-auth/providers/credentials'
import Google, {GoogleProfile} from 'next-auth/providers/google'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import UserDocument from '@/interfaces/UserDocument'
import GoogleSignInParams from '@/interfaces/GoogleSignInParams'
import AdapterUserWithId from '@/interfaces/AdapterUserWithId'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import SignInSession from '@/interfaces/SignInSession'
const authOptions: AuthOptions = {
  providers: [
    Google<GoogleProfile>({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    async signIn(params: {
      user?: User | AdapterUser
      account?: Account | null
      profile?: Profile | GoogleProfile
      email?: {verificationRequest?: boolean}
      credentials?: Record<string, CredentialInput>
    }): Promise<boolean> {
      const {profile}: GoogleSignInParams = params as GoogleSignInParams
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findOne({email: profile?.email})
      if (user) {
        user.image = profile.picture
        await user.save()
      } else {
        await userModel.create({
          email: profile.email,
          username: profile.name,
          image: profile.picture
        })
      }
      return true
    },
    async session(
      params: {
        session: Session
        token?: JWT
        user?: AdapterUser
      } & {
        newSession: SessionWithUserId
        trigger: 'update'
      }
    ): Promise<SessionWithUserId> {
      const {session}: SignInSession = params
      const sessionUser: AdapterUserWithId = session.user as AdapterUserWithId
      return {
        ...session,
        user: {
          ...sessionUser,
          id: (await userModel.findOne({email: sessionUser.email}))?._id
        }
      }
    }
  }
}
export default authOptions