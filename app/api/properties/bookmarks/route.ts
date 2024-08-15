import {NextRequest, NextResponse} from 'next/server'
import {Schema} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import getSessionUser from '@/utilities/getSessionUser'
import {PropertyIdFromRequest, RegisteredUser} from '@/utilities/interfaces'
import {e401response, e500response} from '@/utilities/apiResponses'
import propertyModel from '@/models/propertyModel'
export const dynamic: string = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get all bookmarked properties
 * @route   GET /api/properties/bookmarks
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const sessionUser: RegisteredUser = await getSessionUser()
    if (sessionUser) {
      const userId: Schema.Types.ObjectId = sessionUser._id
      if (userId) {
        const registeredUser: RegisteredUser | null = await userModel.findById(userId)
        if (registeredUser) {
          return new NextResponse(
            JSON.stringify(await propertyModel.find({_id: {$in: registeredUser.bookmarks}})),
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
  } catch (error) {
    return e500response(
      'fetching bookmars',
      error
    )
  }
}
/**
 * @name    POST
 * @desc    Add or remove a bookmark
 * @route   POST /api/properties/bookmarks
 * @access  private
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  let action: string = 'adding/removing'
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
          let bookmarked: boolean | undefined = registeredUser.bookmarks?.includes(propertyOid)
          let message: string
          if (bookmarked) {
            registeredUser.bookmarks?.filter((bookmark: Schema.Types.ObjectId) => bookmark !== propertyOid)
            message = 'Bookmark removed.'
            bookmarked = false
            action = 'removing'
          } else {
            registeredUser.bookmarks?.push(propertyOid)
            message = 'Property bookmarked.'
            bookmarked = true
            action = 'adding'
          }
          await registeredUser.save()
          return new NextResponse(
            JSON.stringify({
              message,
              bookmarked
            }),
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
      `${action} bookmark`,
      error
    )
  }
}