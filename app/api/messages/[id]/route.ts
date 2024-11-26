import {
  NextRequest,
  NextResponse
} from 'next/server'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import MessageDocument from '@/interfaces/MessageDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import noDataResponse from '@/httpResponses/noDataResponse'
import unauthorizedResponse from '@/httpResponses/unauthorizedResponse'
import notFoundResponse from '@/httpResponses/notFoundResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
export {dynamic} from '@/config/dynamic'
/**
 * @name    DELETE
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  private
 */
export const DELETE = async (
  request: NextRequest,
  {params}: Params
): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById(params.id)
      if (message) {
        if (sessionUser._id === message.recipient.toString()) {
          await messageModel.findByIdAndDelete(message._id)
          return noDataResponse('Message deleted.')
        } else {
          return unauthorizedResponse
        }
      } else {
        return notFoundResponse('Message')
      }
    } else {
      return unauthorizedResponse
    }
  } catch (error: any) {
    return serverErrorResponse(
      'deleting message',
      error
    )
  }
}
/**
 * @name    PATCH
 * @desc    Mark a message as read or unread
 * @route   PATCH /api/messages/:id
 * @access  private
 */
export const PATCH = async (
  request: NextRequest,
  {params}: Params
): Promise<NextResponse> => {
  let status: string = 'read/unread'
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById(params.id)
      if (message) {
        if (sessionUser._id = message.recipient.toString()) {
          const read: boolean = message.read
          message.read = !read
          status = read ? 'unread' : 'read'
          await message.save()
          return noDataResponse(`Message marked as ${status}.`)
        } else {
          return unauthorizedResponse
        }
      } else {
        return notFoundResponse('Message')
      }
    } else {
      return unauthorizedResponse
    }
  } catch (error: any) {
    return serverErrorResponse(
      `marking message as ${status}`,
      error
    )
  }
}