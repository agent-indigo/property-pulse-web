import {
  NextRequest,
  NextResponse
} from 'next/server'
import {ObjectId} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import getSessionUser from '@/serverActions/getSessionUser'
import UserDocument from '@/interfaces/UserDocument'
import PropertyDocument from '@/interfaces/PropertyDocument'
import PropertyId from '@/interfaces/PropertyId'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import dataResponse from '@/httpResponses/dataResponse'
import unauthorizedResponse from '@/httpResponses/unauthorizedResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
import badRequestResponse from '@/httpResponses/badRequestResponse'
import notFoundResponse from '@/httpResponses/notFoundResponse'
export {dynamic} from '@/config/dynamic'
/**
 * @name    GET
 * @desc    Get all bookmarked properties
 * @route   GET /api/properties/bookmarked
 * @access  private
 */
export const GET = async (
  request: NextRequest
): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      return dataResponse(JSON.stringify(JSON.parse(JSON.stringify(await propertyModel
        .find({
          _id: {
            $in: sessionUser.bookmarks
          }
        })
        .lean()
      ))))
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
/**
 * @name    PATCH
 * @desc    Add or remove a bookmark
 * @route   PATCH /api/properties/bookmarked
 * @access  private
 */
export const PATCH = async (
  request: NextRequest
): Promise<NextResponse> => {
  let action: string = 'adding/removing'
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findById(sessionUser._id)
      if (user) {
        const {propertyId}: PropertyId = await request.json()
        const property: PropertyDocument | null = await propertyModel.findById(propertyId)
        if (property) {
          if (user.id !== property.owner.toString()) {
            let bookmarked: boolean = user.bookmarks.includes(propertyId)
            let message: string
            if (bookmarked) {
              user.bookmarks = user.bookmarks.filter((
                bookmark: ObjectId
              ): boolean => bookmark.toString() !== propertyId.toString())
              message = 'Bookmark removed.'
              bookmarked = false
              action = 'removing'
            } else {
              user.bookmarks.push(propertyId)
              message = 'Property bookmarked.'
              bookmarked = true
              action = 'adding'
            }
            await user.save()
            return dataResponse(JSON.stringify({
              message,
              bookmarked
            }))
          } else {
            return badRequestResponse('bookmark your own property')
          }
        } else {
          return notFoundResponse('Property')
        }
      } else {
        return unauthorizedResponse
      }
    } else {
      return unauthorizedResponse
    }
  } catch (error: any) {
    return serverErrorResponse(
      `${action} bookmark`,
      error
    )
  }
}