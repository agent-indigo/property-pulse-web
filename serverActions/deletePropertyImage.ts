'use server'
import {revalidatePath} from 'next/cache'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import PropertyDocument from '@/interfaces/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import cloudinary from '@/config/cloudinary'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import deletedResponse from '@/serverActionResponses/deletedResponse'
import notFoundResponse from '@/serverActionResponses/notFoundResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
const deletePropertyImage: Function = async (
  propertyId: string,
  imageId: string
): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const property: PropertyDocument | null = await propertyModel.findById(propertyId)
      if (property) {
        if (property.owner.toString() === sessionUser._id) {
          property.images = property.images.filter((url: string): boolean => !url.includes(imageId))
          property.imageIds = property.imageIds.filter((id: string): boolean => id !== imageId)
          await cloudinary.uploader.destroy(imageId)
          await property.save()
          revalidatePath(
            '/',
            'layout'
          )
          return deletedResponse('Image')
        } else {
          return unauthorizedResponse
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
export default deletePropertyImage