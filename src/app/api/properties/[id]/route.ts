import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import {revalidatePath} from 'next/cache'
import connectToMongoDB from '@/src/library/utilities/connectToMongoDB'
import propertyDocumentModel from '@/src/library/models/propertyDocumentModel'
import PropertyDocument from '@/src/library/types/PropertyDocument'
import cloudinary from '@/src/library/config/cloudinary'
import success200response from '@/src/library/httpResponses/success200response'
import error404response from '@/src/library/httpResponses/error404response'
import error500response from '@/src/library/httpResponses/error500response'
import success204response from '@/src/library/httpResponses/success204response'
import error401response from '@/src/library/httpResponses/error401response'
import authOpts from '@/src/library/config/authOpts'
import UserDocument from '@/src/library/types/UserDocument'
import userDocumentModel from '@/src/library/models/userDocumentModel'
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
    const property: PropertyDocument | null = await propertyDocumentModel.findById((await params).id)
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
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const property: PropertyDocument | null = await propertyDocumentModel.findById((await params).id)
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
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const property: PropertyDocument | null = await propertyDocumentModel.findById((await params).id)
        if (property) {
          if (property.owner.toString() === user.id) {
            await property.updateOne(await request.json())
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