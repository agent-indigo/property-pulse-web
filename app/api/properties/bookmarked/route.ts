import {NextRequest, NextResponse} from 'next/server'
import {FlattenMaps, ObjectId} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import {e400, e401, e404, e500, s200} from '@/utilities/responses'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import getSessionUser from '@/serverActions/getSessionUser'
import UserDocument from '@/interfaces/UserDocument'
import PropertyDocument from '@/interfaces/PropertyDocument'
import PropertyId from '@/interfaces/PropertyId'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PlainProperty from '@/interfaces/PlainProperty'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get all bookmarked properties
 * @route   GET /api/properties/bookmarked
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      return s200(JSON.stringify((await propertyModel
        .find({_id: {$in: sessionUser.bookmarks}})
        .lean()
      ).map((property: FlattenMaps<PropertyDocument>): PlainProperty => convertToPlainDocument(property))))
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
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
export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
  let action: string = 'adding/removing'
  try {
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findById(sessionUser._id)
      if (user) {
        const {propertyId}: PropertyId = await request.json()
        const property: PropertyDocument | null = await propertyModel.findById(propertyId)
        if (property) {
          if (user._id !== property.owner) {
            let bookmarked: boolean = user.bookmarks.includes(propertyId)
            let message: string
            if (bookmarked) {
              user.bookmarks = user.bookmarks.filter((bookmark: ObjectId): boolean => bookmark !== propertyId)
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