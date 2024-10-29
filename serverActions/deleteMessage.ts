'use server'
import {revalidatePath} from 'next/cache'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import MessageDocument from '@/interfaces/MessageDocument'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
const deleteMessage: Function = async (
  messageId: string
): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const message: MessageDocument | null = await messageModel.findById(messageId)
      if (message) {
        if (sessionUser._id === message.recipient.toString()) {
          await connectToMongoDB()
          await messageModel.findByIdAndDelete(messageId)
          revalidatePath(
            '/messages',
            'page'
          )
          return {
            message: 'Message deleted.',
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
          error: '404: Message Not Found',
          success: false
        }
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
export default deleteMessage