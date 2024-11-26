import {
  NextRequest,
  NextResponse
} from 'next/server'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import getSessionUser from '@/serverActions/getSessionUser'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import dataResponse from '@/httpResponses/dataResponse'
import unauthorizedResponse from '@/httpResponses/unauthorizedResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
export {dynamic} from '@/config/dynamic'
/**
 * @name    GET
 * @desc    Check if a property is bookmarked
 * @route   GET /api/properties/bookmarks/status/:id
 * @access  private
 */
export const GET = async (
  request: NextRequest,
  {params}: Params
): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    return success && sessionUser ? dataResponse(JSON.stringify({
      bookmarked: sessionUser.bookmarks.includes(params.id)
    })) : unauthorizedResponse
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving bookmark status',
      error
    )
  }
}