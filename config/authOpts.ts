import {
  AuthOptions,
  Session
} from 'next-auth'
import Google, {GoogleProfile} from 'next-auth/providers/google'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import UserDocument from '@/types/UserDocument'
import SessionParams from '@/types/SessionParams'
import SignInParams from '@/types/SignInParams'
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
        if (user.image !== profile?.picture) {
          user.image = profile.picture
          await user.save()
        }
      } else {
        await userModel.create({
          email: profile?.email,
          username: profile?.name,
          image: profile?.picture,
          roles: await userModel.findOne({
            roles: 'root'
          }) ? [
            'user'
          ] : [
            'root',
            'user'
          ]
        })
      }
      return true
    },
    session: async (params: SessionParams): Promise<Session> => params.session
  }
}
export default authOpts