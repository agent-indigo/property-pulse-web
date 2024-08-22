import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {NextRequest, NextResponse} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import {ListedProperty, RegisteredUser} from '@/utilities/interfaces'
import getSessionUser from '@/utilities/getSessionUser'
import {e401, e404, e500, s200, redirect} from '@/utilities/responses'
import cloudinary from '@/utilities/cloudinary'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    GET a single property
 * @route   GET /api/properties/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: Params
): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const property: ListedProperty | null = await propertyModel.findById(params.id)
    return property ? s200(JSON.stringify(property)) : e404('Property')
  } catch (error: any) {
    return e500(
      'retrieving property',
      error
    )
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
  {params}: Params
): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const property: ListedProperty | null = await propertyModel.findById(params.id)
    if (property) {
      const user: RegisteredUser | undefined = await getSessionUser()
      if (user) {
        if (property.owner?.toString() === user._id.toString()) {
          property.imageIds?.map(async (id: string): Promise<void> => await cloudinary.uploader.destroy(id))
          await propertyModel.findByIdAndDelete(property._id)
          return s200('Property deleted.')
        } else {
          return e401
        }
      } else {
        return e401
      }
    } else {
      return e404('Property')
    }
  } catch (error: any) {
    return e500(
      'deleting property',
      error
    )
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
  {params}: Params
): Promise<NextResponse> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      const id: string = params.id
      await connectToMongoDB()
      const property: ListedProperty | null = await propertyModel.findById(id)
      if (property) {
        if (property.owner?.toString() === user._id.toString()) {
          await propertyModel.findByIdAndUpdate(id, await request.json())
          return redirect(`${process.env.NEXTAUTH_URL ?? ''}/properties/${id}`)
        } else {
          return e401
        }
      } else {
        return e404('Property')
      }
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      'saving changes',
      error
    )
  }
}