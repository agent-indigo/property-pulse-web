import {NextRequest, NextResponse} from 'next/server'
import {FlattenMaps} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import {e400, e401, e500, s200, s204} from '@/utilities/responses'
import getSessionUser from '@/serverActions/getSessionUser'
import MessageDocument from '@/interfaces/MessageDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PlainMessage from '@/interfaces/PlainMessage'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get all messages
 * @route   GET /api/messages
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      return s200(JSON.stringify((await messageModel
        .find({recipient: sessionUser._id})
        .populate('sender', 'username')
        .populate('recipient', 'username')
        .populate('property', 'id name')
        .sort({read: 1, createdAt: -1})
        .lean())
        .map((message: FlattenMaps<MessageDocument>): PlainMessage => convertToPlainDocument(message))
      ))
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      'retrieving messages',
      error
    )
  }
}
/**
 * @name    POST
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  private
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const form: FormData = await request.formData()
      const sender: string = sessionUser._id
      const recipient: string | undefined = form.get('recipient')?.valueOf().toString()
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
        return s204('Message sent.')
      } else {
        return e400('send yourself a message')
      }
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      'sending message',
      error
    )
  }
}