'use server'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
const getUnreadMessagesCount: Function = async (): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      return {
        unreadMessagesCount: await messageModel.countDocuments({
          recipient: sessionUser._id,
          read: false
        }),
        success: true
      }
    } else {
      return error ? internalServerErrorResponse(error) : unauthorizedResponse
    }
  } catch (error: any) {
    return internalServerErrorResponse(error)
  }
}
export default getUnreadMessagesCount