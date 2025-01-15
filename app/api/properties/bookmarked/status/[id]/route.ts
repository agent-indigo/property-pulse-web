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
    return success && sessionUser ? new NextResponse(
      JSON.stringify({
        bookmarked: sessionUser.bookmarks.includes((await params).id)
      }), {
        status: 200,
        statusText: 'OK'
      }
    ) : new NextResponse(
      undefined, {
        status: 401,
        statusText: 'Unauthorized'
      }
    )
  } catch (error: any) {
    return new NextResponse(
      undefined, {
        status: 500,
        statusText: `Internal server error:\n${error.toString()}`
      }
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
            return new NextResponse(
              JSON.stringify({
                message,
                bookmarked
              }), {
                status: 200,
                statusText: 'OK'
              }
            )
          } else {
            return new NextResponse(
              undefined, {
                status: 400,
                statusText: 'You can\'t bookmark your own property.'
              }
            )
          }
        } else {
          return new NextResponse(
            undefined, {
              status: 404,
              statusText: 'Property not found'
            }
          )
        }
      } else {
        return new NextResponse(
          undefined, {
            status: 401,
            statusText: 'Unauthorized'
          }
        )
      }
    } else {
      return new NextResponse(
        undefined, {
          status: 401,
          statusText: 'Unauthorized'
        }
      )
    }
  } catch (error: any) {
    return new NextResponse(
      undefined, {
        status: 500,
        statusText: `Internal server error:\n${error.toString()}`
      }
    )
  }
}