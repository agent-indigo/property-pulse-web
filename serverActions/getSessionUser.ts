'use server'
import {getServerSession} from 'next-auth'
import {
  FlattenMaps,
  ObjectId
} from 'mongoose'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import userModel from '@/models/userModel'
import authOptions from '@/utilities/authOptions'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
import UserDocument from '@/interfaces/UserDocument'
import PlainUser from '@/interfaces/PlainUser'
const getSessionUser: Function = async (): Promise<ServerActionResponse> => {
  try {
    const session: SessionWithUserId | null = await getServerSession(authOptions)
    if (session) {
      await connectToMongoDB()
      const user: FlattenMaps<UserDocument> | null = await userModel.findById(session.user.id).lean()
      if (user) {
        const sessionUser: PlainUser = convertToPlainDocument(user)
        sessionUser.bookmarks = user.bookmarks.map((bookmark: ObjectId): string => bookmark.toString())
        return {
          sessionUser,
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