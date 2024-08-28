'use server'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
const getUnreadMessagesCount: Function = async (): Promise<ServerActionResponse> => {
  try {
    const {error, success, sessionUser}: ServerActionResponse = await getSessionUser()
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
      return {
        error,
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
export default getUnreadMessagesCount