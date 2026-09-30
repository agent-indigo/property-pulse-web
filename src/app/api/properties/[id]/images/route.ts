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
import cloudinary from '@/src/library/config/cloudinary'
import error401response from '@/src/library/httpResponses/error401response'
import error404response from '@/src/library/httpResponses/error404response'
import error500response from '@/src/library/httpResponses/error500response'
import success200response from '@/src/library/httpResponses/success200response'
import PropertyDocument from '@/src/library/types/PropertyDocument'
import propertyDocumentModel from '@/src/library/models/propertyDocumentModel'
import connectToMongoDB from '@/src/library/utilities/connectToMongoDB'
import authOpts from '@/src/library/config/authOpts'
import UserDocument from '@/src/library/types/UserDocument'
import userDocumentModel from '@/src/library/models/userDocumentModel'
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
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const property: PropertyDocument | null = await propertyDocumentModel.findById((await params).id)
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