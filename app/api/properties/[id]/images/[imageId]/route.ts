import {
  NextRequest,
  NextResponse
} from 'next/server'
import error401response from '@/httpResponses/error401response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import PropertyDocument from '@/interfaces/PropertyDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import propertyModel from '@/models/propertyModel'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import cloudinary from '@/config/cloudinary'
import success200response from '@/httpResponses/success200response'
export const DELETE = async (
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
      const property: PropertyDocument | null = await propertyModel.findById((await params).id)
      if (property) {
        if (property.owner.toString() === sessionUser._id) {
          const imageId: string = (await params).imageId
          property.images = property.images.filter((url: string): boolean => !url.includes(imageId))
          property.imageIds = property.imageIds.filter((id: string): boolean => id !== imageId)
          await cloudinary.uploader.destroy(imageId)
          await property.save()
          return success200response(property)
        } else {
          return error401response
        }
      } else {
        return error404response
      }
    } else {
      return error ? error500response(error) : error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}