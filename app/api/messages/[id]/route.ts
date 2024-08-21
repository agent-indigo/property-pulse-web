import {NextRequest, NextResponse} from 'next/server'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {ObjectId} from 'mongoose'
import {e401, e404, e500, s204} from '@/utilities/responses'
import {InquiryMessage, RegisteredUser} from '@/utilities/interfaces'
import getSessionUser from '@/utilities/getSessionUser'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
export {dynamic} from '@/utilities/dynamic'
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
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      const id = params.id
      await connectToMongoDB()
      const message: InquiryMessage | null = await messageModel.findById(id)
      if (message) {
        if (user._id.toString() === message.recipient.toString()) {
          const read: boolean = message.read as boolean
          const update: InquiryMessage = {
            ...message,
            read: !read
          }
          status = read ? 'unread' : 'read'
          await messageModel.findByIdAndUpdate(id, update)
          return s204(`Message marked as ${status}.`)
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
    const user: RegisteredUser | null = getSessionUser()
    if (user) {
      const id: string = params.id
      await connectToMongoDB()
      const message: InquiryMessage | null = await messageModel.findById(id)
      if (message) {
        const userId: ObjectId = user._id
        if (userId.toString() === message.recipient.toString() ||
            userId.toString() === message.sender?.toString()
        ) {
          await messageModel.findByIdAndDelete(id)
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