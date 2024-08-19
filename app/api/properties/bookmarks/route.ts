import {NextRequest, NextResponse} from 'next/server'
import {Schema} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import getSessionUser from '@/utilities/getSessionUser'
import {PropertyIdFromRequest, RegisteredUser} from '@/utilities/interfaces'
import {e401, e500, s200} from '@/utilities/responses'
import propertyModel from '@/models/propertyModel'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get all bookmarked properties
 * @route   GET /api/properties/bookmarks
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const user: RegisteredUser | null = await getSessionUser()
    if (user) {
      await connectToMongoDB()
      return s200(JSON.stringify(await propertyModel.find({_id: {$in: user.bookmarks}})))
    } else {
      return e401
    }
  } catch (error) {
    return e500(
      'retrieving bookmars',
      error
    )
  }
}
/**
 * @name    PATCH
 * @desc    Add or remove a bookmark
 * @route   PATCH /api/properties/bookmarks
 * @access  private
 */
export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
  let action: string = 'adding/removing'
  try {
    const {propertyId}: PropertyIdFromRequest = await request.json()
    const propertyOid: Schema.Types.ObjectId = new Schema.Types.ObjectId(propertyId)
    const user: RegisteredUser | null = await getSessionUser()
    if (user && user.bookmarks) {
      let bookmarked: boolean = user.bookmarks.includes(propertyOid)
      let message: string
      if (bookmarked) {
        user.bookmarks?.filter((bookmark: Schema.Types.ObjectId) => bookmark !== propertyOid)
        message = 'Bookmark removed.'
        bookmarked = false
        action = 'removing'
      } else {
        user.bookmarks?.push(propertyOid)
        message = 'Property bookmarked.'
        bookmarked = true
        action = 'adding'
      }
      await connectToMongoDB()
      await user.save()
      return s200(JSON.stringify({
        message,
        bookmarked
      }))
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      `${action} bookmark`,
      error
    )
  }
}