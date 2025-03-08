import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import {revalidatePath} from 'next/cache'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import PropertyDocument from '@/interfaces/PropertyDocument'
import cloudinary from '@/config/cloudinary'
import success200response from '@/httpResponses/success200response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import success204response from '@/httpResponses/success204response'
import error401response from '@/httpResponses/error401response'
import authOpts from '@/config/authOpts'
import UserDocument from '@/interfaces/UserDocument'
import userModel from '@/models/userModel'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    GET a single property
 * @route   GET /api/properties/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const property: PropertyDocument | null = await propertyModel.findById((await params).id)
    return property ? success200response(property.toObject()) : error404response
  } catch (error: any) {
    return error500response(error)
  }
}
/**
 * @name    DELETE
 * @desc    DELETE a property
 * @route   DELETE /api/properties/:id
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
        const property: PropertyDocument | null = await propertyModel.findById((await params).id)
        if (property) {
          if (property.owner.toString() === user.id) {
            property.imageIds.map(async (id: string): Promise<void> => await cloudinary.uploader.destroy(id))
            await property.deleteOne()
            revalidatePath(
              '/',
              'layout'
            )
            return success204response
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
/**
 * @name    PATCH
 * @desc    Edit a property
 * @route   PATCH /api/properties/:id
 * @access  private
 */
export const PATCH = async (
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
            property.overwrite(await request.json())
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