import {NextRequest, NextResponse} from 'next/server'
import {Document, Schema} from 'mongoose'
import cloudinary from '@/utilities/cloudinary'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import getSessionUser from '@/utilities/getSessionUser'
import propertyModel from '@/models/propertyModel'
import {ListedProperty, RegisteredUser} from '@/utilities/interfaces'
/**
 * @name    GET
 * @desc    GET all properties
 * @route   GET /api/properties
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    return new NextResponse(
      JSON.stringify(await propertyModel.find()),
      {status: 200}
    )
  } catch (error: any) {
    return new NextResponse(
      `Error fetching properties:\n${error.toString()}`,
      {status: 500}
    )
  }
}
/**
 * @name    POST
 * @desc    Add a property
 * @route   POST /api/properties
 * @access  private
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const user: RegisteredUser | null = await getSessionUser()
    if (user) {
      const form: FormData = await request.formData()
      await connectToMongoDB()
      const property: Document<unknown, {}, ListedProperty> & Required<{_id: Schema.Types.ObjectId}> = new propertyModel({
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
        },
        images: await Promise.all(form.getAll('files').map(async (image: FormDataEntryValue): Promise<string> => (await cloudinary.uploader.upload(
          `data:image/png;base64,${Buffer.from(new Uint8Array(await (image as File).arrayBuffer())).toString('base64')}`,
          {folder: process.env.CLOUDINARY_FOLDER_NAME ?? ''}
        )).secure_url))
      })
      await property.save()
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/properties/${property._id.toString()}`)
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