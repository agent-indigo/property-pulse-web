import {AuthOptions} from 'next-auth'
import Google, {GoogleProfile} from 'next-auth/providers/google'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import UserDocument from '@/interfaces/UserDocument'
import GoogleSignInParams from '@/interfaces/GoogleSignInParams'
import AdapterUserWithId from '@/interfaces/AdapterUserWithId'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import SessionParams from '@/interfaces/SessionParams'
import SignInParams from '@/interfaces/SignInParams'
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
    async signIn(params: SignInParams): Promise<boolean> {
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
    async session(params: SessionParams): Promise<SessionWithUserId> {
      const {session} = params
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