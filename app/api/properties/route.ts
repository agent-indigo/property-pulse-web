import {NextRequest, NextResponse} from 'next/server'
import {Document, Schema} from 'mongoose'
import {UploadApiResponse} from 'cloudinary'
import cloudinary from '@/utilities/cloudinary'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import getSessionUser from '@/utilities/getSessionUser'
import propertyModel from '@/models/propertyModel'
import {ListedProperty, Location, Rates, RegisteredUser, SellerInfo} from '@/utilities/interfaces'
/**
 * @name    GET
 * @desc    GET all properties
 * @route   GET /api/properties
 * @access  public
 */
export const GET: Function = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectToMongoDB() as void
    const properties: ListedProperty[] = await propertyModel.find({}) as ListedProperty[]
    return new NextResponse(JSON.stringify(properties) as string, {status: 200 as number}) as NextResponse
  } catch (error: unknown) {
    return new NextResponse(`Error fetching properties:\n${error as string}` as string, {status: 500 as number}) as NextResponse
  }
}
/**
 * @name    POST
 * @desc    Add a property
 * @route   POST /api/properties
 * @access  private
 */
export const POST: Function = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const registeredUser: RegisteredUser | null = await getSessionUser() as RegisteredUser | null
    if (registeredUser as RegisteredUser) {
      const form: FormData = await request.formData() as FormData
      const formAmenities: FormDataEntryValue[] = form.getAll('amenities' as string) as FormDataEntryValue[]
      const amenities: string[] = [] as string[]
      formAmenities.map((amenity: FormDataEntryValue) => amenities.push(amenity.valueOf() as string))
      const formImages: FormDataEntryValue[] = form.getAll('files' as string) as FormDataEntryValue[]
      const promises: string[] = [] as string[]
      formImages.map(async (image: FormDataEntryValue) => {
        const value: string = image.valueOf().toString() as string
        const blob: Blob = new Blob([value as string] as string[]) as Blob
        const buffer: ArrayBuffer = await blob.arrayBuffer() as ArrayBuffer
        const array: number[] = Array.from(new Uint8Array(buffer as ArrayBuffer) as Uint8Array) as number[]
        const data: Buffer = Buffer.from(array as number[]) as Buffer
        const b64str: string = data.toString('base64' as BufferEncoding) as string
        const response = await cloudinary.uploader.upload(`data:image/png;base64,${b64str as string}` as string, {folder: 'PropertyPulse' as string}) as UploadApiResponse
        const url: string = response.secure_url as string
        promises.push(url as string)
      })
      const images: string[] = await Promise.all(promises as string[]) as string[]
      const owner: Schema.Types.ObjectId = registeredUser?._id as Schema.Types.ObjectId
      let nightly: number | undefined = undefined
      let weekly: number | undefined = undefined
      let monthly: number | undefined = undefined
      if (form.get('rates.nightly' as string) as FormDataEntryValue) nightly = Number.parseFloat(form.get('rates.nightly' as string)?.valueOf() as string) as number
      if (form.get('rates.weekly' as string) as FormDataEntryValue) weekly = Number.parseFloat(form.get('rates.weekly' as string)?.valueOf() as string) as number
      if (form.get('rates.monthly' as string) as FormDataEntryValue) monthly = Number.parseFloat(form.get('rates.monthly' as string)?.valueOf() as string) as number
      const propertyData: ListedProperty = {
        owner,
        type: form.get('type' as string)?.valueOf() as string,
        name: form.get('name' as string)?.valueOf() as string,
        description: form.get('description' as string)?.valueOf() as string,
        location: {
          street: form.get('location.street' as string)?.valueOf() as string,
          city: form.get('location.city' as string)?.valueOf() as string,
          state: form.get('location.state' as string)?.valueOf() as string,
          zipcode: form.get('location.zipcode' as string)?.valueOf() as string
        } as Location,
        beds: Number.parseInt(form.get('beds' as string)?.valueOf() as string) as number,
        baths: Number.parseFloat(form.get('baths' as string)?.valueOf() as string) as number,
        square_feet: Number.parseFloat(form.get('square_feet' as string)?.valueOf() as string),
        amenities,
        rates: {
          nightly,
          weekly,
          monthly
        } as Rates,
        seller_info: {
          name: form.get('seller_info.name' as string)?.valueOf() as string,
          email: form.get('seller_info.email' as string)?.valueOf() as string,
          phone: form.get('seller_info.phone' as string)?.valueOf() as string
        } as SellerInfo,
        images
      }
      await connectToMongoDB() as void
      const property: Document<ListedProperty> & ListedProperty & Required<{_id: Schema.Types.ObjectId}> = new propertyModel(propertyData as ListedProperty) as Document<ListedProperty> & ListedProperty & Required<{_id: Schema.Types.ObjectId}>
      await property.save() as Document<ListedProperty> & ListedProperty & Required<{_id: Schema.Types.ObjectId}>
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL as string}/properties/${property._id.toString() as string}` as string) as NextResponse
    } else {
      return new NextResponse('Unauthorized' as string, {status: 401 as number}) as NextResponse
    }
  } catch (error: unknown) {
    return new NextResponse(`Error adding property:\n${error as string}` as string, {status: 500 as number}) as NextResponse
  }
}