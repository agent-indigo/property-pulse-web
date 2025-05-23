import {AuthOptions} from 'next-auth'
import Google, {GoogleProfile} from 'next-auth/providers/google'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userDocumentModel from '@/models/userDocumentModel'
import UserDocument from '@/types/UserDocument'
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
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: profile?.email
      })
      if (user) {
        if (user.image !== profile?.picture) {
          user.image = profile?.picture
          await user.save()
        }
      } else {
        await userDocumentModel.create({
          email: profile?.email,
          username: profile?.name,
          image: profile?.picture,
          role: await userDocumentModel.findOne({
            role: 'root'
          }) ? 'user' : 'root'
        })
      }
      return true
    }
  }
}
export default authOpts