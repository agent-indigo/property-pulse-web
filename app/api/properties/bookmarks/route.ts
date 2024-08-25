import {NextRequest, NextResponse} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import getSessionUser from '@/utilities/getSessionUser'
import {ListedProperty, PropertyIdFromRequest, RegisteredUser} from '@/utilities/interfaces'
import {e400, e401, e404, e500, s200} from '@/utilities/responses'
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
    const user: RegisteredUser | undefined = await getSessionUser()
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
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      await connectToMongoDB()
      const property: ListedProperty | null = await propertyModel.findById(propertyId)
      if (property) {
        if (user.id !== property.owner?.toString()) {
          let bookmarked: boolean | undefined = user.bookmarks?.includes(propertyId)
          let message: string
          if (bookmarked) {
            user.bookmarks = user.bookmarks?.filter((bookmark: string): boolean => bookmark !== propertyId)
            message = 'Bookmark removed.'
            bookmarked = false
            action = 'removing'
          } else {
            user.bookmarks?.push(propertyId)
            message = 'Property bookmarked.'
            bookmarked = true
            action = 'adding'
          }
          await user.save()
          return s200(JSON.stringify({
            message,
            bookmarked
          }))
        } else {
          return e400('bookmark your own property')
        }
      } else {
        return e404('Property')
      }
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