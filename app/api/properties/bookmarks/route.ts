import {NextRequest, NextResponse} from 'next/server'
import mongoose, {Schema} from 'mongoose'
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
      const userId: Schema.Types.ObjectId = user._id
      if (userId) {
        await connectToMongoDB()
        return s200(JSON.stringify(await propertyModel.find({_id: {$in: user.bookmarks}})))
      } else {
        return e401
      }
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
    const propertyOid: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(propertyId)
    const user: RegisteredUser | null = await getSessionUser()
    if (user) {
      let bookmarked: boolean | undefined = user.bookmarks?.includes(propertyOid)
      let message: string
      if (bookmarked) {
        user.bookmarks?.filter((bookmark) => bookmark !== propertyOid)
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