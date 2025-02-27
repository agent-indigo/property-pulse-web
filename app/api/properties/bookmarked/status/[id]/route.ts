import {
  NextRequest,
  NextResponse
} from 'next/server'
import {ObjectId} from 'mongoose'
import getSessionUser from '@/serverActions/getSessionUser'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PropertyDocument from '@/interfaces/PropertyDocument'
import UserDocument from '@/interfaces/UserDocument'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import success200response from '@/httpResponses/success200response'
import error401response from '@/httpResponses/error401response'
import error500response from '@/httpResponses/error500response'
import error400response from '@/httpResponses/error400response'
import error404response from '@/httpResponses/error404response'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Check if a property is bookmarked
 * @route   GET /api/properties/bookmarks/status/:id
 * @access  private
 */
export const GET = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const {
      error,
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    return success && sessionUser ? success200response({bookmarked: sessionUser.bookmarks.includes((await params).id)}) : error401response
  } catch (error: any) {
    return error ? error500response(error) : error500response(error)
  }
}
/**
 * @name    PATCH
 * @desc    Add or remove a bookmark
 * @route   PATCH /api/properties/bookmarked/status/:id
 * @access  private
 */
export const PATCH = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const {
      error,
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findById(sessionUser._id)
      if (user) {
        const property: PropertyDocument | null = await propertyModel.findById((await params).id)
        if (property) {
          if (user.id !== property.owner.toString()) {
            const {id}: PropertyDocument = property
            let bookmarked: boolean = user.bookmarks.includes(id)
            let message: string = ''
            if (bookmarked) {
              user.bookmarks = user.bookmarks.filter((bookmark: ObjectId): boolean => bookmark.toString() !== id)
              message = 'Bookmark removed.'
              bookmarked = false
            } else {
              user.bookmarks.push(id)
              message = 'Property bookmarked.'
              bookmarked = true
            }
            await user.save()
            return success200response({
              message,
              bookmarked
            })
          } else {
            return error400response('bookmark your own property')
          }
        } else {
          return error404response
        }
      } else {
        return error401response
      }
    } else {
      return error ? error500response(error) : error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}