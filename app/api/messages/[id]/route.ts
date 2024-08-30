import {NextRequest, NextResponse} from 'next/server'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {e401, e404, e500, s200, s204} from '@/utilities/responses'
import MessageDocument from '@/interfaces/MessageDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
export {dynamic} from '@/utilities/dynamic'
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
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById(params.id)
      if (message) {
        if (sessionUser._id === message.recipient.toString()) {
          await messageModel.findByIdAndDelete(message._id)
          return s204('Message deleted.')
        } else {
          return e401
        }
      } else {
        return e404('Message')
      }
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
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
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById(params.id)
      if (message) {
        if (sessionUser._id = message.recipient.toString()) {
          const read: boolean = message.read
          message.read = !read
          status = read ? 'unread' : 'read'
          await message.save()
          return s200(`Message marked as ${status}`)
        } else {
          return e401
        }
      } else {
        return e404('Message')
      }
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      `marking message as ${status}`,
      error
    )
  }
}