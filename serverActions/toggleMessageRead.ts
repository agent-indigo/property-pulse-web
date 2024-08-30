'use server'
import {revalidatePath} from 'next/cache'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import MessageDocument from '@/interfaces/MessageDocument'
import messageModel from '@/models/messageModel'
const toggleMessageRead: Function = async (messageId: string): Promise<ServerActionResponse> => {
  try {
    const {error, success, sessionUser}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById(messageId)
      if (message) {
        if (sessionUser._id === message.recipient.toString()) {
          const read: boolean = message.read
          message.read = !read
          await message.save()
          revalidatePath('/messages', 'page')
          return {
            message: `Message marked as ${read ? 'unread' : 'read'}.`,
            read: !read,
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
export default toggleMessageRead