'use server'
import {revalidatePath} from 'next/cache'
import {UploadApiResponse} from 'cloudinary'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import cloudinary from '@/config/cloudinary'
import PropertyDocument from '@/interfaces/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
const addProperty: Function = async (form: FormData): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const images: string[] = []
      const imageIds: string[] = []
      await Promise.all(form.getAll('files').map(async (image: FormDataEntryValue): Promise<void> => {
        if (image instanceof File) {
          const {
            secure_url,
            public_id
          }: UploadApiResponse = await cloudinary.uploader.upload(
            `data:image/png;base64,${Buffer.from(new Uint8Array(await image.arrayBuffer())).toString('base64')}`, {
              folder: process.env.CLOUDINARY_FOLDER_NAME ?? 'PropertyPulse'
            }
          )
          images.push(secure_url)
          imageIds.push(public_id)
        }
      }))
      await connectToMongoDB()
      const property: PropertyDocument = await propertyModel.create({
        owner: sessionUser._id,
        ...Object.fromEntries(form.entries().filter(([key]: FormDataEntryValue[]): boolean => key !== 'files')),
        images,
        imageIds
      })
      revalidatePath(
        '/',
        'layout'
      )
      return {
        message: 'Property added.',
        propertyId: property.id,
        success: true
      }
    } else {
      return {
        error,
        success: false
      }
    }
  } catch (error: any) {
    return {
      error: `500: Internal server error adding property:\n${error.toString()}`,
      success: false
    }
  }
}
export default addProperty