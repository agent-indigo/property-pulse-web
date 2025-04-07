import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import {revalidatePath} from 'next/cache'
import error401response from '@/httpResponses/error401response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import PropertyDocument from '@/types/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import cloudinary from '@/config/cloudinary'
import success200response from '@/httpResponses/success200response'
import authOpts from '@/config/authOpts'
import UserDocument from '@/types/UserDocument'
import userModel from '@/models/userModel'
export const dynamic = 'force-dynammic'
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
      const user: UserDocument | null = await userModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const {
          id,
          imageId
        }: any = await params
        const property: PropertyDocument | null = await propertyModel.findById(id)
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