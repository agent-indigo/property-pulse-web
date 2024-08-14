import {NextRequest, NextResponse} from 'next/server'
import {Document, Schema} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import {ListedProperty, RegisteredUser} from '@/utilities/interfaces'
import getSessionUser from '@/utilities/getSessionUser'
/**
 * @name    GET
 * @desc    GET a single property
 * @route   GET /api/properties/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: {params: {id: string}}
): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const property: ListedProperty | null = await propertyModel.findById(params.id)
    return new NextResponse(
      property ? JSON.stringify(property) : 'Property not found.',
      {status: property ? 200 : 404}
    )
  } catch (error: any) {
    return new NextResponse(
      `Error fetching property:\n${error.toString()}`,
      {status: 500}
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
  {params}: {params: {id: string}}
): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const property: ListedProperty | null = await propertyModel.findById(params.id)
    if (property) {
      const user: RegisteredUser | null = await getSessionUser()
      if (user) {
        if (property.owner === user._id) {
          await propertyModel.findByIdAndDelete(property._id)
          return new NextResponse(
            'Property deleted.',
            {status: 204}
          )
        } else {
          return new NextResponse(
            'Unauthorized.',
            {status: 401}
          )
        }
      } else {
        return new NextResponse(
          'Unauthorized.',
          {status: 401}
        )
      }
    } else {
      return new NextResponse(
        'Property not found.',
        {status: 404}
      )
    }
  } catch (error: any) {
    return new NextResponse(
      `Error deleting property:\n${error.toString()}`,
      {status: 500}
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
  {params}: {params: {id: string}}
): Promise<NextResponse> => {
  try {
    const user: RegisteredUser | null = await getSessionUser()
    if (user) {
      const form: FormData = await request.formData()
      const id: string = params.id
      await connectToMongoDB()
      const property: ListedProperty | null = await propertyModel.findById(id)
      const update: Document<unknown, {}, ListedProperty> & Required<{_id: Schema.Types.ObjectId}> = new propertyModel({
        owner: user._id,
        type: form.get('type')?.valueOf() as string,
        name: form.get('name')?.valueOf() as string,
        description: form.get('description')?.valueOf() as string,
        location: {
          street: form.get('location.street')?.valueOf() as string,
          city: form.get('location.city')?.valueOf() as string,
          state: form.get('location.state')?.valueOf() as string,
          zipcode: form.get('location.zipcode')?.valueOf() as string
        },
        beds: Number.parseInt(form.get('beds')?.valueOf() as string),
        baths: Number.parseFloat(form.get('baths')?.valueOf() as string),
        square_feet: Number.parseFloat(form.get('square_feet')?.valueOf() as string),
        amenities: form.getAll('amenities').map((amenity: FormDataEntryValue) => amenity.valueOf() as string),
        rates: {
          nightly: form.get('rates.nightly') ? Number.parseFloat(form.get('rates.nightly')?.valueOf() as string) : undefined,
          weekly: form.get('rates.weekly') ? Number.parseFloat(form.get('rates.weekly')?.valueOf() as string) : undefined,
          monthly: form.get('rates.monthly') ? Number.parseFloat(form.get('rates.monthly')?.valueOf() as string) : undefined
        },
        seller_info: {
          name: form.get('seller_info.name')?.valueOf() as string,
          email: form.get('seller_info.email')?.valueOf() as string,
          phone: form.get('seller_info.phone')?.valueOf() as string
        }
      })
      if (property) {
        if (property.owner === user._id) {
          await propertyModel.findByIdAndUpdate(id, update)
          return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/properties/${id}`)
        } else {
          return new NextResponse(
            'Unauthorized.',
            {status: 401}
          )
        }
      } else {
        return new NextResponse(
          'Property not found.',
          {status: 404}
        )
      }
    } else {
      return new NextResponse(
        'Unauthorized.',
        {status: 401}
      )
    }
  } catch (error: any) {
    return new NextResponse(
      `Error adding property:\n${error.toString()}`,
      {status: 500}
    )
  }
}