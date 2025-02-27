'use server'
import {ObjectId} from 'mongoose'
import {revalidatePath} from 'next/cache'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import PropertyDocument from '@/interfaces/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import UserDocument from '@/interfaces/UserDocument'
import userModel from '@/models/userModel'
import notFoundResponse from '@/serverActionResponses/notFoundResponse'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
import badRequestResponse from '@/serverActionResponses/badRequestResponse'
const togglePropertyBookmarked: Function = async (propertyId: ObjectId): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findById(sessionUser._id)
      const property: PropertyDocument | null = await propertyModel.findById(propertyId)
      if (user && property) {
        if (user.id !== property.owner.toString()) {
          let bookmarked: boolean = user.bookmarks.includes(propertyId)
          let message: string
          if (bookmarked) {
            user.bookmarks = user.bookmarks.filter((bookmark: ObjectId): boolean => bookmark.toString() !== propertyId.toString())
            bookmarked = false
            message = 'Bookmark removed.'
          } else {
            user.bookmarks.push(propertyId)
            bookmarked = true
            message = 'Property bookmarked.'
          }
          await user.save()
          revalidatePath(
            '/properties/bookmarks',
            'page'
          )
          return {
            bookmarked,
            message,
            success: true
          }
        } else {
          return badRequestResponse('bookmark your own property')
        }
      } else {
        return notFoundResponse('Property')
      }
    } else {
      return error ? internalServerErrorResponse(error) : unauthorizedResponse
    }
  } catch (error: any) {
    return internalServerErrorResponse(error)
  }
}
export default togglePropertyBookmarked