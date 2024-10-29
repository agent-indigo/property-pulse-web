'use server'
import {revalidatePath} from 'next/cache'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import PropertyDocument from '@/interfaces/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import cloudinary from '@/utilities/cloudinary'
const deleteProperty: Function = async (
  propertyId: string
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
        if (sessionUser._id === property.owner.toString()) {
          property.imageIds.map(async (
            imageId: string
          ): Promise<void> => await cloudinary.uploader.destroy(imageId))
          await propertyModel.findByIdAndDelete(propertyId)
          revalidatePath(
            '/',
            'layout'
          )
          return {
            message: 'Property deleted.',
            success: true
          }
        } else {
          return {
            error: '401: Unauthorized',
            success: false
          }
        }
      } else {
        return {
          error: '404: Property Not Found',
          success: false
        }
      }
    } else {
      return {
        error,
        success: false
      }
    }
  } catch (error: any) {
    return {
      error: `500: Internal Server Error:\n${error.toString()}`,
      success: false
    }
  }
}
export default deleteProperty