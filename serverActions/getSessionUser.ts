'use server'
import {getServerSession} from 'next-auth'
import {FlattenMaps} from 'mongoose'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import UserDocument from '@/interfaces/UserDocument'
import userModel from '@/models/userModel'
import authOptions from '@/utilities/authOptions'
import connectToMongoDB from '@/utilities/connectToMongoDB'
const getSessionUser: Function = async (): Promise<ServerActionResponse> => {
  try {
    const session: SessionWithUserId | null = await getServerSession(authOptions)
    if (session) {
      const id: string = session.user.id
      if (id !== '') {
        await connectToMongoDB()
        const user: FlattenMaps<UserDocument> | null = await userModel.findById(id).lean()
        if (user) {
          return {
            sessionUser: user,
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