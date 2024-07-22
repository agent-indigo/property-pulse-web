import {Account, AuthOptions, Profile, Session, User} from 'next-auth'
import {JWT} from 'next-auth/jwt'
import {AdapterUser} from 'next-auth/adapters'
import {CredentialInput} from 'next-auth/providers/credentials'
import Google, {GoogleProfile} from 'next-auth/providers/google'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import {AdapterUserWithId, RegisteredUser, SessionWithUserId} from '@/utilities/interfaces'
const authOptions: AuthOptions = {
  providers: [
    Google<GoogleProfile>({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
      profile?: Profile | GoogleProfile | undefined
      email?: {verificationRequest?: boolean}
      credentials?: Record<string, CredentialInput>
    }): Promise<boolean> {
      const {profile}: {profile?: GoogleProfile} = params as {profile?: GoogleProfile}
      await connectToMongoDB()
      if (!await userModel.findOne({email: profile?.email})) await userModel.create({
        email: profile?.email,
        username: profile?.name,
        image: profile?.picture
      })
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
      const {session}: {session: Session} = params
      const sessionUser: AdapterUserWithId = session.user as AdapterUserWithId
      return {
        ...session,
        user: {
          ...sessionUser,
          id: (await userModel.findOne({email: sessionUser.email}) as RegisteredUser)._id.toString()
        }
      }
    }
  }
}
export default authOptions