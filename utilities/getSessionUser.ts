import {getServerSession} from 'next-auth'
import {AuthOptions} from 'next-auth'
import authOptions from '@/utilities/authOptions'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import {AdapterUserWithId, RegisteredUser, SessionWithUserId} from '@/utilities/interfaces'
const getSessionUser: Function = async (): Promise<RegisteredUser | null> => {
  const session: SessionWithUserId | null = await getServerSession(authOptions as AuthOptions) as SessionWithUserId | null
  if (session as SessionWithUserId) {
    const sessionUser: AdapterUserWithId | null = session?.user as AdapterUserWithId | null
    if (sessionUser as AdapterUserWithId) {
      const id: string | null = sessionUser?.id as string | null
      if (id as string && id as string !== '' as string) {
        await connectToMongoDB() as void
        const registeredUser: RegisteredUser | null = await userModel.findById(id as string) as RegisteredUser | null
        if (registeredUser as RegisteredUser) {
          return registeredUser
        } else {
          console.error('404: Registered user not found.' as string) as void
          return null
        }
      } else {
        console.error('404: Session user ID not found.' as string) as void
        return null
      }
    } else {
      console.error('404: Session user not found.' as string) as void
      return null
    }
  } else {
    console.error('404: Session not found.' as string) as void
    return null
  }
}
export default getSessionUser as Function