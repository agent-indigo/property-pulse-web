'use server'
import {revalidatePath} from 'next/cache'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import PropertyDocument from '@/interfaces/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import cloudinary from '@/config/cloudinary'
import deletedResponse from '@/serverActionResponses/deletedResponse'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import notFoundResponse from '@/serverActionResponses/notFoundResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
const deleteProperty: Function = async (propertyId: string): Promise<ServerActionResponse> => {
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
        if (sessionUser._id === property.owner.toString()) {
          property.imageIds.map(async (imageId: string): Promise<void> => await cloudinary.uploader.destroy(imageId))
          await propertyModel.findByIdAndDelete(propertyId)
          revalidatePath(
            '/',
            'layout'
          )
          return deletedResponse('Property')
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
export default deleteProperty