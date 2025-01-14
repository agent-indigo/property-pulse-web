import {
  NextRequest,
  NextResponse
} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import getSessionUser from '@/serverActions/getSessionUser'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import dataResponse from '@/httpResponses/dataResponse'
import unauthorizedResponse from '@/httpResponses/unauthorizedResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get all bookmarked properties
 * @route   GET /api/properties/bookmarked
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
      return dataResponse(await propertyModel.find({
        _id: {
          $in: sessionUser.bookmarks
        }
      }).lean())
    } else {
      return unauthorizedResponse
    }
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving bookmarked properties',
      error
    )
  }
}