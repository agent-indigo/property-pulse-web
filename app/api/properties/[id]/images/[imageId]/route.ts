import {
  NextRequest,
  NextResponse
} from 'next/server'
import {getServerSession} from 'next-auth'
import {revalidatePath} from 'next/cache'
import error401response from '@/httpResponses/error401response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import PropertyDocument from '@/interfaces/PropertyDocument'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import cloudinary from '@/config/cloudinary'
import success200response from '@/httpResponses/success200response'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import authOpts from '@/config/authOpts'
import UserDocument from '@/interfaces/UserDocument'
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
    const session: SessionWithUserId | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findById(session.user.id)
      if (user) {
        const property: PropertyDocument | null = await propertyModel.findById((await params).id)
        if (property) {
          if (property.owner.toString() === user.id) {
            const imageId: string = (await params).imageId
            property.images = property.images.filter((url: string): boolean => !url.includes(imageId))
            property.imageIds = property.imageIds.filter((id: string): boolean => id !== imageId)
            await cloudinary.uploader.destroy(imageId)
            await property.save()
            revalidatePath(
              '/',
              'layout'
            )
            return success200response(property)
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