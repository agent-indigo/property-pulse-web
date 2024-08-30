import {NextRequest, NextResponse} from 'next/server'
import {e401, e500, s200} from '@/utilities/responses'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get the number of unread messages
 * @route   GET /api/messages/unreadCount
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      return s200(JSON.stringify({unread: await messageModel.countDocuments({
        recipient: sessionUser._id,
        read: false
      })}))
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      'retrieving unread messages count',
      error
    )
  }
}