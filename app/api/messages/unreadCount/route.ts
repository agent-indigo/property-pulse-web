import {
  NextRequest,
  NextResponse
} from 'next/server'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get the number of unread messages
 * @route   GET /api/messages/unreadCount
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
      return new NextResponse(
        JSON.stringify({
          unread: await messageModel.countDocuments({
            recipient: sessionUser._id,
            read: false
          })
        }), {
          status: 200,
          statusText: 'OK'
        }
      )
    } else {
      return new NextResponse(
        undefined, {
          status: 401,
          statusText: 'Unauthorized'
        }
      )
    }
  } catch (error: any) {
    return new NextResponse(
      undefined, {
        status: 500,
        statusText: `Internal server error:\n${error.toString()}`
      }
    )
  }
}