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
    return new NextResponse(
      JSON.stringify({
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
      }), {
        status: 200,
        statusText: 'OK'
      }
    )
  } catch (error: any) {
    return new NextResponse(
      undefined, {
        status: 500,
        statusText: `Internal server error:\n${error.toString()}`
      }
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
        ...Object.fromEntries(form.entries().filter(([key]): boolean => key !== 'files')),
        images,
        imageIds
      })
      return new NextResponse(
        JSON.stringify(property), {
          status: 201,
          statusText: 'Property added.'
        }
      )
    } else {
      return new NextResponse(
        undefined, {
          status: 401,
          statusText: 'Unauthorized'
        }
      )
    }
  } catch (error: any) {
    return new NextResponse(
      undefined, {
        status: 500,
        statusText: `Internal server error:\n${error.toString()}`
      }
    )
  }
}