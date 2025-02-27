'use server'
import {revalidatePath} from 'next/cache'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
import badRequestResponse from '@/serverActionResponses/badRequestResponse'
const sendMessage: Function = async (form: FormData): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const sender: string = sessionUser._id
      const recipient: string | undefined = form.get('recipient')?.valueOf().toString()
      if (recipient && recipient !== sender) {
        await connectToMongoDB()
        await messageModel.create({
          sender,
          ...Object.fromEntries(form.entries()),
          read: false
        })
        revalidatePath(
          '/messages',
          'page'
        )
        return {
          message: 'Message sent.',
          success: true
        }
      } else {
        return badRequestResponse('send yourself a message')
      }
    } else {
      return error ? internalServerErrorResponse(error) : unauthorizedResponse
    }
  } catch (error: any) {
    return internalServerErrorResponse(error)
  }
}
export default sendMessage