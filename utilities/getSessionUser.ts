import {getServerSession, Session} from 'next-auth'
import {AuthOptions} from 'next-auth'
import authOptions from '@/utilities/authOptions'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import {RegisteredUser} from '@/utilities/interfaces'
const getSessionUser: Function = async (): Promise<RegisteredUser | Response | null> => {
  try {
    const session: Session | null = await getServerSession(authOptions as AuthOptions)
    if (!session) {
      return new Response('Unauthorized' as string, {status: 401 as number}) as Response
    } else {
      await connectToMongoDB() as void
      return await userModel.findOne({email: session.user?.email as string}) as RegisteredUser | null
    }
  } catch (error: unknown) {
    return new Response(`Error getting session user:\n${error as string}` as string, {status: 500 as number}) as Response
  }
}
export default getSessionUser as Function