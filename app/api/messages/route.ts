import {
  NextRequest,
  NextResponse
} from 'next/server'
import {FlattenMaps} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/serverActions/getSessionUser'
import MessageDocument from '@/interfaces/MessageDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PlainMessage from '@/interfaces/PlainMessage'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
import dataResponse from '@/httpResponses/dataResponse'
import unauthorizedResponse from '@/httpResponses/unauthorizedResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
import noDataResponse from '@/httpResponses/noDataResponse'
import badRequestResponse from '@/httpResponses/badRequestResponse'
export {dynamic} from '@/config/dynamic'
/**
 * @name    GET
 * @desc    Get all messages
 * @route   GET /api/messages
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      return dataResponse(JSON.stringify((await messageModel.find({
        recipient: sessionUser._id
      }).populate(
        'sender',
        'username'
      ).populate(
        'property',
        'id name'
      ).sort({
        read: 1,
        createdAt: -1
      }).lean()).map((message: FlattenMaps<MessageDocument>): PlainMessage => {
        const plainMessage: PlainMessage = convertToPlainDocument(message)
        plainMessage.sender = convertToPlainDocument(plainMessage.sender)
        plainMessage.property = convertToPlainDocument(plainMessage.property)
        return plainMessage
      })))
    } else {
      return unauthorizedResponse
    }
  } catch (error: any) {
    return serverErrorResponse(
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
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const form: FormData = await request.formData()
      const sender: string = sessionUser._id
      const recipient: string | undefined = form.get('recipient')?.valueOf().toString()
      if (recipient && recipient !== sender) {
        await connectToMongoDB()
        await messageModel.create({
          sender,
          recipient,
          property: form.get('property')?.valueOf(),
          name: form.get('name')?.valueOf(),
          email: form.get('email')?.valueOf(),
          phone: form.get('phone')?.valueOf(),
          body: form.get('body')?.valueOf(),
          read: false
        })
        return noDataResponse('Message sent.')
      } else {
        return badRequestResponse('send yourself a message')
      }
    } else {
      return unauthorizedResponse
    }
  } catch (error: any) {
    return serverErrorResponse(
      'sending message',
      error
    )
  }
}