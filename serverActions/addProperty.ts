'use server'
import {revalidatePath} from 'next/cache'
import {UploadApiResponse} from 'cloudinary'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import cloudinary from '@/config/cloudinary'
import PropertyDocument from '@/interfaces/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
const addProperty: Function = async (
  form: FormData
): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const images: string[] = []
      const imageIds: string[] = []
      await Promise.all(form.getAll('files').map(async (
        image: FormDataEntryValue
      ): Promise<void> => {
          const {
            secure_url,
            public_id
          }: UploadApiResponse = await cloudinary.uploader.upload(
            `data:image/png;base64,${Buffer.from(new Uint8Array(await (
              image as File
            ).arrayBuffer())).toString('base64')
            }`, {
              folder: process.env.CLOUDINARY_FOLDER_NAME ?? 'PropertyPulse'
            }
          )
          images.push(secure_url)
          imageIds.push(public_id)
        }
      ))
      await connectToMongoDB()
      const property: PropertyDocument = await propertyModel.create({
        owner: sessionUser._id,
        type: form.get('type')?.valueOf(),
        name: form.get('name')?.valueOf(),
        description: form.get('description')?.valueOf(),
        location: {
          street: form.get('location.street')?.valueOf(),
          city: form.get('location.city')?.valueOf(),
          state: form.get('location.state')?.valueOf(),
          zipcode: form.get('location.zipcode')?.valueOf()
        },
        beds: form.get('beds')?.valueOf(),
        baths: form.get('baths')?.valueOf(),
        square_feet: form.get('square_feet')?.valueOf(),
        amenities: form.getAll('amenities').map((
          amenity: FormDataEntryValue
        ): string => amenity
          .valueOf()
          .toString()
        ),
        rates: {
          nightly: form.get('rates.nightly')?.valueOf(),
          weekly: form.get('rates.weekly')?.valueOf(),
          monthly: form.get('rates.monthly')?.valueOf()
        },
        seller_info: {
          name: form.get('seller_info.name')?.valueOf(),
          email: form.get('seller_info.email')?.valueOf(),
          phone: form.get('seller_info.phone')?.valueOf()
        },
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
      error: `500: Internal Server Error:\n${error.toString()}`,
      success: false
    }
  }
}
export default addProperty