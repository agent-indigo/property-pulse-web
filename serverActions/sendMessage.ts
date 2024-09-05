'use server'
import {revalidatePath} from 'next/cache'
import MessageDocument from '@/interfaces/MessageDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
const sendMessage: Function = async (form: FormData): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const sender: string = sessionUser._id
      const recipient: string | undefined = form
        .get('recipient')
        ?.valueOf()
        .toString()
      if (recipient && recipient !== sender) {
        const message: MessageDocument = new messageModel({
          sender,
          recipient,
          property: form.get('property')?.valueOf(),
          name: form.get('name')?.valueOf(),
          email: form.get('email')?.valueOf(),
          phone: form.get('phone')?.valueOf(),
          body: form.get('body')?.valueOf(),
          read: false
        })
        await connectToMongoDB()
        await message.save()
        revalidatePath('/messages', 'page')
        return {
          message: 'Message sent.',
          success: true
        }
      } else {
        return {
          error: '400: You can\'t send yourself a message.',
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
export default sendMessage