import {
  NextRequest,
  NextResponse
} from 'next/server'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import dataResponse from '@/httpResponses/dataResponse'
import unauthorizedResponse from '@/httpResponses/unauthorizedResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get the number of unread messages
 * @route   GET /api/messages/unreadCount
 * @access  private
 */
export const GET = async (
  request: NextRequest
): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      return dataResponse(JSON.stringify({
        unread: await messageModel.countDocuments({
          recipient: sessionUser._id,
          read: false
        })
      }))
    } else {
      return unauthorizedResponse
    }
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving unread messages count',
      error
    )
  }
}