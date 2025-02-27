import {
  NextRequest,
  NextResponse
} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import PropertyDocument from '@/interfaces/PropertyDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import cloudinary from '@/config/cloudinary'
import success200response from '@/httpResponses/success200response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import success204response from '@/httpResponses/success204response'
import error401response from '@/httpResponses/error401response'
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
    return property ? success200response(property) : error404response
  } catch (error: any) {
    return error500response(error)
  }
}
/**
 * @name    DELETE
 * @desc    Delete a property
 * @route   DELETE /api/properties/:id
 * @access  private
 */
export const DELETE = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const property: PropertyDocument | null = await propertyModel.findById((await params).id)
      if (property) {
        if (sessionUser._id === property.owner.toString()) {
          property.imageIds.map(async (image: string): Promise<void> => await cloudinary.uploader.destroy(image))
          await propertyModel.findByIdAndDelete(property._id)
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
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const property: PropertyDocument | null = await propertyModel.findById((await params).id)
      if (property) {
        if (sessionUser._id === property.owner.toString()) {
          await propertyModel.findByIdAndUpdate(
            property._id,
            Object.fromEntries((await request.formData()).entries())
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
  } catch (error: any) {
    return error500response(error)
  }
}