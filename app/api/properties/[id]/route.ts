import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {NextRequest, NextResponse} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import PropertyDocument from '@/interfaces/PropertyDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import {e401, e404, e500, s200, redirect, s204} from '@/utilities/responses'
import cloudinary from '@/utilities/cloudinary'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    GET a single property
 * @route   GET /api/properties/:id
 * @access  public
 */
export const GET = async (request: NextRequest, {params}: Params): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const property: PropertyDocument | null = await propertyModel.findById(params.id)
    return property ? s200(JSON.stringify(convertToPlainDocument(property))) : e404('Property')
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
export const DELETE = async (request: NextRequest, {params}: Params): Promise<NextResponse> => {
  try {
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const property: PropertyDocument | null = await propertyModel.findById(params.id)
      if (property) {
        if (sessionUser._id === property.owner.toString()) {
          property.imageIds.map(async (image: string): Promise<void> => await cloudinary.uploader.destroy(image))
          await propertyModel.findByIdAndDelete(property._id)
          return s204('Property deleted.')
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
export const PATCH = async (request: NextRequest, {params}: Params): Promise<NextResponse> => {
  try {
    const {sessionUser, success}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const property: PropertyDocument | null = await propertyModel.findById(params.id)
      if (property) {
        if (sessionUser._id === property.owner.toString()) {
          const form: FormData = await request.formData()
          await propertyModel.findByIdAndUpdate(property._id, {
            type: form.get('type')?.valueOf().toString(),
            name: form.get('name')?.valueOf().toString(),
            description: form.get('description')?.valueOf().toString(),
            location: {
              street: form.get('location.street')?.valueOf().toString(),
              city: form.get('location.city')?.valueOf().toString(),
              state: form.get('location.state')?.valueOf().toString(),
              zipcode: form.get('location.zipcode')?.valueOf().toString()
            },
            beds: form.get('beds')?.valueOf().toString(),
            baths: form.get('baths')?.valueOf().toString(),
            square_feet: form.get('square_feet')?.valueOf().toString(),
            amenities: form.getAll('amenities').map((
              amenity: FormDataEntryValue
            ): string => amenity
              .valueOf()
              .toString()
            ),
            rates: {
              nightly: form.get('rates.nightly')?.valueOf().toString(),
              weekly: form.get('rates.weekly')?.valueOf().toString(),
              monthly: form.get('rates.monthly')?.valueOf().toString()
            },
            seller_info: {
              name: form.get('seller_info.name')?.valueOf().toString(),
              email: form.get('seller_info.email')?.valueOf().toString(),
              phone: form.get('seller_info')?.valueOf().toString()
            }
          })
          return redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property.id}`)
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