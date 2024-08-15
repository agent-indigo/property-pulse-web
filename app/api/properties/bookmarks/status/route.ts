import {NextRequest, NextResponse} from 'next/server'
import {Schema} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import getSessionUser from '@/utilities/getSessionUser'
import {PropertyIdFromRequest, RegisteredUser} from '@/utilities/interfaces'
import {e401response, e500response} from '@/utilities/apiResponses'
export const dynamic: string = 'force-dynamic'
/**
 * @name    POST
 * @desc    Check if a property is bookmarked
 * @route   POST /api/properties/bookmarks/status
 * @access  private
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const {propertyId}: PropertyIdFromRequest = await request.json()
    const propertyOid: Schema.Types.ObjectId = new Schema.Types.ObjectId(propertyId)
    const sessionUser: RegisteredUser = await getSessionUser()
    if (sessionUser) {
      const userId: Schema.Types.ObjectId = sessionUser._id
      if (userId) {
        const registeredUser: RegisteredUser | null = await userModel.findById(userId)
        if (registeredUser) {
          const bookmarked: boolean | undefined = registeredUser.bookmarks?.includes(propertyOid)
          return new NextResponse(
            JSON.stringify({bookmarked}),
            {status: 200}
          )
        } else {
          return e401response
        }
      } else {
        return e401response
      }
    } else {
      return e401response
    }
  } catch (error: any) {
    return e500response(
      `checking bookmark status`,
      error
    )
  }
}