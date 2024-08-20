import {getServerSession} from 'next-auth'
import authOptions from '@/utilities/authOptions'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import {RegisteredUser, SessionWithUserId} from '@/utilities/interfaces'
const getSessionUser: Function = async (): Promise<RegisteredUser | undefined> => {
  try {
    const session: SessionWithUserId | null = await getServerSession(authOptions)
    if (session) {
      const id: string = session.user.id
      if (id !== '') {
        await connectToMongoDB()
        const user: RegisteredUser | null = await userModel.findById(id)
        if (user) {
          return user
        } else {
          console.error('User not found.')
          return
        }
      } else {
        console.error('User ID not found.')
        return
      }
    } else {
      console.error('Session not found.')
      return
    }
  } catch (error: any) {
    console.error(`Error identifying user:\n${error}`)
    return
  }
}
export default getSessionUser