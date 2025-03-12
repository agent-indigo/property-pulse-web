import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import authOpts from '@/config/authOpts'
import error401response from '@/httpResponses/error401response'
import error500response from '@/httpResponses/error500response'
import success200response from '@/httpResponses/success200response'
import userModel from '@/models/userModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import UserDocument from '@/interfaces/UserDocument'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    GET the current user
 * @route   GET /api/auth/user
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findOne({
        email: session.user?.email
      })
      return user ? success200response({
        _id: user.id,
        image: user.image
      }) : error401response
    } else {
      return error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}