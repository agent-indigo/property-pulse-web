import {
  NextRequest,
  NextResponse
} from 'next/server'
import {ObjectId} from 'mongoose'
import getSessionUser from '@/serverActions/getSessionUser'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import dataResponse from '@/httpResponses/dataResponse'
import unauthorizedResponse from '@/httpResponses/unauthorizedResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
import badRequestResponse from '@/httpResponses/badRequestResponse'
import notFoundResponse from '@/httpResponses/notFoundResponse'
import PropertyDocument from '@/interfaces/PropertyDocument'
import UserDocument from '@/interfaces/UserDocument'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
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
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    return success && sessionUser ? dataResponse({
      bookmarked: sessionUser.bookmarks.includes((await params).id)
    }) : unauthorizedResponse
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving bookmark status',
      error
    )
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
        const property: PropertyDocument | null = await propertyModel.findById((await params).id)
        if (property) {
          if (user.id !== property.owner.toString()) {
            const {id}: PropertyDocument = property
            let bookmarked: boolean = user.bookmarks.includes(id)
            let message: string
            if (bookmarked) {
              user.bookmarks = user.bookmarks.filter((bookmark: ObjectId): boolean => bookmark.toString() !== id)
              message = 'Bookmark removed.'
              bookmarked = false
              action = 'removing'
            } else {
              user.bookmarks.push(id)
              message = 'Property bookmarked.'
              bookmarked = true
              action = 'adding'
            }
            await user.save()
            return dataResponse({
              message,
              bookmarked
            })
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