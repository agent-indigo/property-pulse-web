'use server'
import {revalidatePath} from 'next/cache'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import MessageDocument from '@/interfaces/MessageDocument'
import messageModel from '@/models/messageModel'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import notFoundResponse from '@/serverActionResponses/notFoundResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
const toggleMessageRead: Function = async (messageId: string): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById(messageId)
      if (message) {
        if (sessionUser._id === message.recipient.toString()) {
          const read: boolean = message.read
          message.read = !read
          await message.save()
          revalidatePath(
            '/messages',
            'page'
          )
          return {
            message: `Message marked as ${read ? 'unread' : 'read'}.`,
            read: !read,
            success: true
          }
        } else {
          return unauthorizedResponse
        }
      } else {
        return notFoundResponse('Message')
      }
    } else {
      return error ? internalServerErrorResponse(error) : unauthorizedResponse
    }
  } catch (error: any) {
    return internalServerErrorResponse(error)
  }
}
export default toggleMessageRead