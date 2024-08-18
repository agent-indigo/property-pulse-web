import {NextRequest, NextResponse} from 'next/server'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {Schema} from 'mongoose'
import getSessionUser from '@/utilities/getSessionUser'
import {RegisteredUser} from '@/utilities/interfaces'
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
    const user: RegisteredUser | null = await getSessionUser()
    if (user) {
      return s200(JSON.stringify(user.bookmarks?.includes(new Schema.Types.ObjectId(params.id))))
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      `checking bookmark status`,
      error
    )
  }
}