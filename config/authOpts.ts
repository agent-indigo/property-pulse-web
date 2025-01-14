import {AuthOptions} from 'next-auth'
import Google, {GoogleProfile} from 'next-auth/providers/google'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import UserDocument from '@/interfaces/UserDocument'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import SessionParams from '@/interfaces/SessionParams'
import SignInParams from '@/interfaces/SignInParams'
const authOpts: AuthOptions = {
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
    signIn: async (params: SignInParams): Promise<boolean> => {
      const {profile}: any = params
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findOne({
        email: profile?.email
      })
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
    session: async (params: SessionParams): Promise<SessionWithUserId> => {
      const {session}: SessionParams = params
      const {user}: any = session
      return {
        ...session,
        user: {
          ...user,
          id: (await userModel.findOne({
            email: user?.email
          }))?._id
        }
      }
    }
  }
}
export default authOpts