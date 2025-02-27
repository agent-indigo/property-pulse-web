'use server'
import {getServerSession} from 'next-auth'
import {
  FlattenMaps,
  ObjectId
} from 'mongoose'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import userModel from '@/models/userModel'
import authOpts from '@/config/authOpts'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import UserDocument from '@/interfaces/UserDocument'
import PlainUser from '@/interfaces/PlainUser'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
const getSessionUser: Function = async (): Promise<ServerActionResponse> => {
  try {
    const session: SessionWithUserId | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: FlattenMaps<UserDocument> | null = await userModel.findById(session.user.id).lean()
      if (user) {
        const sessionUser: PlainUser = JSON.parse(JSON.stringify(user))
        sessionUser.bookmarks = user.bookmarks.map((bookmark: ObjectId): string => bookmark.toString())
        return {
          sessionUser,
          success: true
        }
      } else {
        return unauthorizedResponse
      }
    } else {
      return unauthorizedResponse
    }
  } catch (error: any) {
    return internalServerErrorResponse(error)
  }
}
export default getSessionUser