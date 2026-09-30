import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import messageDocumentModel from '@/src/library/models/messageDocumentModel'
import connectToMongoDB from '@/src/library/utilities/connectToMongoDB'
import success200response from '@/src/library/httpResponses/success200response'
import error401response from '@/src/library/httpResponses/error401response'
import error500response from '@/src/library/httpResponses/error500response'
import authOpts from '@/src/library/config/authOpts'
import UserDocument from '@/src/library/types/UserDocument'
import userDocumentModel from '@/src/library/models/userDocumentModel'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    GET the number of unread messages
 * @route   GET /api/messages/unreadCount
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      return user ? success200response({
        unreadMessagesCount: await messageDocumentModel.countDocuments({
          recipient: user.id,
          read: false
        })
      }) : error401response
    } else {
      return error401response
    }
  } catch (error: any) {
    return (error500response(error))
  }
}