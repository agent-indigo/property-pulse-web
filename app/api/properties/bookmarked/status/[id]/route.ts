import {NextRequest, NextResponse} from 'next/server'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import getSessionUser from '@/serverActions/getSessionUser'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import {e401, e500, s200} from '@/utilities/responses'
export {dynamic} from '@/utilities/dynamic'
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
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    return success && sessionUser
    ? s200(JSON.stringify({bookmarked: sessionUser.bookmarks.includes(params.id)}))
    : e401
  } catch (error: any) {
    return e500(
      'retrieving bookmark status',
      error
    )
  }
}