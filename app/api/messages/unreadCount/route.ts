import {NextRequest, NextResponse} from 'next/server'
import {e401, e500, s200} from '@/utilities/responses'
import {RegisteredUser} from '@/utilities/interfaces'
import getSessionUser from '@/utilities/getSessionUser'
import messageModel from '@/models/messageModel'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get the number of unread messages
 * @route   GET /api/messages/unreadCount
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      return s200(JSON.stringify(await messageModel.countDocuments({
        recipient: user._id,
        read: false
      })))
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      'retrieving new message count',
      error
    )
  }
}