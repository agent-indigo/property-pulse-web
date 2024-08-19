import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {NextRequest, NextResponse} from 'next/server'
import mongoose, {Document} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import {ListedProperty, RegisteredUser} from '@/utilities/interfaces'
import getSessionUser from '@/utilities/getSessionUser'
import {e401, e404, e500, s200, redirect, s204} from '@/utilities/responses'
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
      const user: RegisteredUser | null = await getSessionUser()
      if (user) {
        if (property.owner === user._id) {
          await propertyModel.findByIdAndDelete(property._id)
          return s204('Property deleted.')
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
 * @name    PUT
 * @desc    Edit a property
 * @route   PUT /api/properties/:id
 * @access  private
 */
export const PUT = async (
  request: NextRequest,
  {params}: Params
): Promise<NextResponse> => {
  try {
    const user: RegisteredUser | null = await getSessionUser()
    if (user) {
      const id: string = params.id
      await connectToMongoDB()
      const property: ListedProperty | null = await propertyModel.findById(id)
      if (property) {
        if (property.owner === user._id) {
          const form: FormData = await request.formData()
          const update: Document<unknown, {}, ListedProperty> & Required<{_id: mongoose.Types.ObjectId}> = new propertyModel({
            type: form.get('type')?.valueOf(),
            name: form.get('name')?.valueOf(),
            description: form.get('description')?.valueOf(),
            location: {
              street: form.get('location.street')?.valueOf(),
              city: form.get('location.city')?.valueOf(),
              state: form.get('location.state')?.valueOf(),
              zipcode: form.get('location.zipcode')?.valueOf()
            },
            beds: form.get('beds')?.valueOf(),
            baths: form.get('baths')?.valueOf(),
            square_feet: form.get('square_feet')?.valueOf(),
            amenities: form.getAll('amenities').map((amenity: FormDataEntryValue) => amenity.valueOf()),
            rates: {
              nightly: form.get('rates.nightly')?.valueOf(),
              weekly: form.get('rates.weekly')?.valueOf(),
              monthly: form.get('rates.monthly')?.valueOf()
            },
            seller_info: {
              name: form.get('seller_info.name')?.valueOf(),
              email: form.get('seller_info.email')?.valueOf(),
              phone: form.get('seller_info.phone')?.valueOf()
            }
          })
          await propertyModel.findByIdAndUpdate(id, update)
          return redirect(`${process.env.NEXTAUTH_URL}/properties/${id}`)
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