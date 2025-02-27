import {UploadApiResponse} from 'cloudinary'
import {
  NextRequest,
  NextResponse
} from 'next/server'
import cloudinary from '@/config/cloudinary'
import error401response from '@/httpResponses/error401response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import success200response from '@/httpResponses/success200response'
import PropertyDocument from '@/interfaces/PropertyDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import propertyModel from '@/models/propertyModel'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
export const POST = async (
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
          await Promise.all((await request.formData()).getAll('files').map(async (image: FormDataEntryValue): Promise<void> => {
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
          }))
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