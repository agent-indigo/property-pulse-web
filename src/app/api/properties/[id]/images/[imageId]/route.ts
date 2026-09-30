import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import {revalidatePath} from 'next/cache'
import error401response from '@/src/library/httpResponses/error401response'
import error404response from '@/src/library/httpResponses/error404response'
import error500response from '@/src/library/httpResponses/error500response'
import PropertyDocument from '@/src/library/types/PropertyDocument'
import propertyDocumentModel from '@/src/library/models/propertyDocumentModel'
import connectToMongoDB from '@/src/library/utilities/connectToMongoDB'
import cloudinary from '@/src/library/config/cloudinary'
import success200response from '@/src/library/httpResponses/success200response'
import authOpts from '@/src/library/config/authOpts'
import UserDocument from '@/src/library/types/UserDocument'
import userDocumentModel from '@/src/library/models/userDocumentModel'
export const dynamic = 'force-dynamic'
/**
 * @name    DELETE
 * @desc    DELETE an image from a property
 * @route   DELETE /api/properties/:id/images/:imageId
 * @access  private
 */
export const DELETE = async (
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
        const {
          id,
          imageId
        }: any = await params
        const property: PropertyDocument | null = await propertyDocumentModel.findById(id)
        if (property) {
          if (property.owner.toString() === user.id) {
            property.images = property.images.filter((url: string): boolean => !url.includes(imageId))
            property.imageIds = property.imageIds.filter((id: string): boolean => id !== imageId)
            await cloudinary.uploader.destroy(imageId)
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