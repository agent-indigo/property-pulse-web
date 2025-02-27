import {
  NextRequest,
  NextResponse
} from 'next/server'
import MessageDocument from '@/interfaces/MessageDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import success204response from '@/httpResponses/success204response'
import error401response from '@/httpResponses/error401response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import success200response from '@/httpResponses/success200response'
export const dynamic = 'force-dynamic'
/**
 * @name    DELETE
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  private
 */
export const DELETE = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById((await params).id)
      if (message) {
        if (sessionUser._id === message.recipient.toString()) {
          await messageModel.findByIdAndDelete(message._id)
          return success204response
        } else {
          return error401response
        }
      } else {
        return error404response
      }
    } else {
      return error401response
    }
  } catch (error: any) {
    return error500response(error)
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
  {params}: any
): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById((await params).id)
      if (message) {
        if (sessionUser._id = message.recipient.toString()) {
          message.read = !message.read
          await message.save()
          return success200response(message)
        } else {
          return error401response
        }
      } else {
        return error404response
      }
    } else {
      return error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}