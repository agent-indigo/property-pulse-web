import {
  NextRequest,
  NextResponse
} from 'next/server'
import {UploadApiResponse} from 'cloudinary'
import {
  getServerSession,
  Session
} from 'next-auth'
import {revalidatePath} from 'next/cache'
import cloudinary from '@/config/cloudinary'
import error401response from '@/httpResponses/error401response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import success200response from '@/httpResponses/success200response'
import PropertyDocument from '@/types/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import authOpts from '@/config/authOpts'
import UserDocument from '@/types/UserDocument'
import userModel from '@/models/userModel'
export const dynamic = 'force-dynamic'
/**
 * @name    POST
 * @desc    Add (an) image(s) to a property
 * @route   POST /api/properties/:id/images
 * @access  private
 */
export const POST = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const property: PropertyDocument | null = await propertyModel.findById((await params).id)
        if (property) {
          if (property.owner.toString() === user.id) {
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
            revalidatePath(
              '/',
              'layout'
            )
            return success200response(property.toObject())
          } else {
            return error401response
          }
        } else {
          return error404response
        }
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