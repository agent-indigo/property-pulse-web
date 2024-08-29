'use server'
import {getServerSession} from 'next-auth'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import userModel from '@/models/userModel'
import authOptions from '@/utilities/authOptions'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
const getSessionUser: Function = async (): Promise<ServerActionResponse> => {
  try {
    const session: SessionWithUserId | null = await getServerSession(authOptions)
    if (session) {
      const id: string = session.user.id
      if (id && id !== '') {
        await connectToMongoDB()
        return {
          sessionUser: convertToPlainDocument(await userModel.findById(id).lean()),
          success: true
        }
      } else {
        return {
          error: '401: Unauthorized',
          success: false
        }
      }
    } else {
      return {
        error: '401: Unauthorized',
        success: false
      }
    }
  } catch (error: any) {
    return {
      error: `500: Internal Server Error:\n${error.toString()}`,
      success: false
    }
  }
}
export default getSessionUser