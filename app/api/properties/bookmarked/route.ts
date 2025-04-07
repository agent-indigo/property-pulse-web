import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyDocumentModel from '@/models/propertyDocumentModel'
import success200response from '@/httpResponses/success200response'
import error401response from '@/httpResponses/error401response'
import error500response from '@/httpResponses/error500response'
import authOpts from '@/config/authOpts'
import UserDocument from '@/types/UserDocument'
import userDocumentModel from '@/models/userDocumentModel'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get all bookmarked properties
 * @route   GET /api/properties/bookmarked
 * @access  private
 */
export const GET = async (request : NextRequest): Promise<NextResponse> => {
  try {
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      return user ? success200response(await propertyDocumentModel.find({
        _id: {
          $in: user.bookmarks
        }
      }).lean()) : error401response
    } else {
      return error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}