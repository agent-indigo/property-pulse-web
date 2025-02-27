import {
  NextRequest,
  NextResponse
} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/serverActions/getSessionUser'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PlainUser from '@/interfaces/PlainUser'
import success200response from '@/httpResponses/success200response'
import error401response from '@/httpResponses/error401response'
import error500response from '@/httpResponses/error500response'
import success201response from '@/httpResponses/success201response'
import error400response from '@/httpResponses/error400response'
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
      error,
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      return success200response(await messageModel.find({
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
      return error ? error500response(error) : error401response
    }
  } catch (error: any) {
    return error500response(error)
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
      error,
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const form: FormData = await request.formData()
      const {_id: sender}: PlainUser = sessionUser
      const recipient: string | undefined = form.get('recipient')?.valueOf().toString()
      if (recipient && recipient !== sender) {
        await connectToMongoDB()
        return success201response(
          await messageModel.create({
            sender,
            ...Object.fromEntries(form.entries()),
            read: false
          }),
          'message'
        )
      } else {
        return error400response('send yourself a message')
      }
    } else {
      return error ? error500response(error) : error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}