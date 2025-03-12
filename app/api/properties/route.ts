import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import {revalidatePath} from 'next/cache'
import {UploadApiResponse} from 'cloudinary'
import PropertyDocument from '@/interfaces/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import cloudinary from '@/config/cloudinary'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import error500response from '@/httpResponses/error500response'
import success200response from '@/httpResponses/success200response'
import success201response from '@/httpResponses/success201response'
import error401response from '@/httpResponses/error401response'
import authOpts from '@/config/authOpts'
import UserDocument from '@/interfaces/UserDocument'
import userModel from '@/models/userModel'
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
    return success200response({
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
    return error500response(error)
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
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findOne({
        email: session.user?.email
      })
      if (user) {
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
        const property: PropertyDocument = await propertyModel.create({
          owner: user.id,
          ...Object.fromEntries(form.entries().filter(([key]): boolean => key !== 'files')),
          images,
          imageIds
        })
        revalidatePath(
          '/',
          'layout'
        )
        return success201response(property.toObject())
      } else {
        return error401response
      }
    } else {
      return error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}