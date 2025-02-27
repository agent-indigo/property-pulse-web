'use server'
import {UploadApiResponse} from 'cloudinary'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import cloudinary from '@/config/cloudinary'
import PropertyDocument from '@/interfaces/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import notFoundResponse from '@/serverActionResponses/notFoundResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
const addPropertyImages: Function = async (
  propertyId: string,
  form: FormData
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
            await Promise.all((form.getAll('files').map(async (image: FormDataEntryValue): Promise<void> => {
              if (image instanceof File) {
                const {
                  secure_url,
                  public_id
                }: UploadApiResponse = await cloudinary.uploader.upload(
                  `data:image/png;base64,${Buffer.from(new Uint8Array(await image.arrayBuffer())).toString('base64')}`, {
                    folder: process.env.CLOUDINARY_FOLDER_NAME ?? 'PropertyPulse'
                  }
                )
                property.images.push(secure_url)
                property.imageIds.push(public_id)
              }
            })))
            await property.save()
            return {
              success: true,
              message: 'Photo uploaded.'
            }
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
export default addPropertyImages