'use server'
import {revalidatePath} from 'next/cache'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import MessageDocument from '@/interfaces/MessageDocument'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import deletedResponse from '@/serverActionResponses/deletedResponse'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import notFoundResponse from '@/serverActionResponses/notFoundResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
const deleteMessage: Function = async (messageId: string): Promise<ServerActionResponse> => {
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
          return deletedResponse('Message')
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
export default deleteMessage