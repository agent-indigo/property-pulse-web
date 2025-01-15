import {
  NextRequest,
  NextResponse
} from 'next/server'
import {UploadApiResponse} from 'cloudinary'
import PropertyDocument from '@/interfaces/PropertyDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import propertyModel from '@/models/propertyModel'
import getSessionUser from '@/serverActions/getSessionUser'
import cloudinary from '@/config/cloudinary'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import dataResponse from '@/httpResponses/dataResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
import redirectResponse from '@/httpResponses/redirectResponse'
import unauthorizedResponse from '@/httpResponses/unauthorizedResponse'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    GET all properties
 * @route   GET /api/properties
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const page: string = new URL(request.url).searchParams.get('page') ?? ''
    await connectToMongoDB()
    return dataResponse({
      properties: page === ''
      ? await propertyModel
        .find()
        .lean()
      : await propertyModel
        .find()
        .skip((parseInt(page) - 1) * 6)
        .limit(6)
        .lean(),
      total: await propertyModel.countDocuments()
    })
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving properties',
      error
    )
  }
}
/**
 * @name    POST
 * @desc    Add a property
 * @route   POST /api/properties
 * @access  private
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const form: FormData = await request.formData()
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
        amenities: form.getAll('amenities').map((amenity: FormDataEntryValue): string => amenity.valueOf().toString()),
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
      return redirectResponse(`${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property.id}`)
    } else {
      return unauthorizedResponse
    }
  } catch (error: any) {
    return serverErrorResponse(
      'adding property',
      error
    )
  }
}