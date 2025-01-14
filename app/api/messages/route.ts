import {
  NextRequest,
  NextResponse
} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/serverActions/getSessionUser'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import dataResponse from '@/httpResponses/dataResponse'
import unauthorizedResponse from '@/httpResponses/unauthorizedResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
import noDataResponse from '@/httpResponses/noDataResponse'
import badRequestResponse from '@/httpResponses/badRequestResponse'
import PlainUser from '@/interfaces/PlainUser'
export const dynamic = 'force-dynamic'
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
      return dataResponse(await messageModel.find({
        recipient: sessionUser._id
      }).populate(
        'sender',
        'username'
      ).populate(
        'property',
        '_id name'
      ).sort({
        read: 1,
        createdAt: -1
      }).lean())
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
      const {_id: sender}: PlainUser = sessionUser
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