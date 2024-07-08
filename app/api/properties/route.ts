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
      const files: File[] = [] as File[]
      formImages.map((image: FormDataEntryValue) => {
        if (image.valueOf() as any instanceof File as boolean) {
          console.log('File found!' as string) as void
          const file: File = image.valueOf() as File
          if (file.name as string !== '' as string) files.push(file as File)
        } else {
          console.error('No file found...' as string) as void
        }
      })
      const images: string[] = [] as string[]
      files.map(async (image: File) => {
        const imageBuffer: ArrayBuffer = await image.arrayBuffer() as ArrayBuffer
        const imageArray: number[] = Array.from(new Uint8Array(imageBuffer as ArrayBuffer)) as number[]
        imageArray.map((bits: number) => console.log(bits as number) as void)
        const imageData: Buffer = Buffer.from(imageArray as number[]) as Buffer
        const imageBase64: string = imageData.toString('base64') as string
        console.log(imageBase64 as string) as void
        const response: UploadApiResponse = await cloudinary.uploader.upload(`data:image/png;base64,${imageBase64 as string}` as string, {folder: 'PropertyPulse' as string}) as UploadApiResponse
        console.log(response.secure_url as string) as void
        images.push(response.secure_url as string)
      })
      const owner: Schema.Types.ObjectId = registeredUser?._id as Schema.Types.ObjectId
      let nightly: number | undefined = undefined
      let weekly: number | undefined = undefined
      let monthly: number | undefined = undefined
      if (form.get('rates.nightly' as string) as FormDataEntryValue) nightly = Number.parseFloat(form.get('rates.nightly' as string)?.toString() as string) as number
      if (form.get('rates.weekly' as string) as FormDataEntryValue) weekly = Number.parseFloat(form.get('rates.weekly' as string)?.toString() as string) as number
      if (form.get('rates.monthly' as string) as FormDataEntryValue) monthly = Number.parseFloat(form.get('rates.monthly' as string)?.toString() as string) as number
      const propertyData: ListedProperty = {
        owner,
        type: form.get('type' as string)?.toString() as string,
        name: form.get('name' as string)?.toString() as string,
        description: form.get('description' as string)?.toString() as string,
        location: {
          street: form.get('location.street' as string)?.toString() as string,
          city: form.get('location.city' as string)?.toString() as string,
          state: form.get('location.state' as string)?.toString() as string,
          zipcode: form.get('location.zipcode' as string)?.toString() as string
        } as Location,
        beds: Number.parseInt(form.get('beds' as string)?.toString() as string) as number,
        baths: Number.parseFloat(form.get('baths' as string)?.toString() as string) as number,
        square_feet: Number.parseFloat(form.get('square_feet' as string)?.toString() as string),
        amenities,
        rates: {
          nightly,
          weekly,
          monthly
        } as Rates,
        seller_info: {
          name: form.get('seller_info.name' as string)?.toString() as string,
          email: form.get('seller_info.email' as string)?.toString() as string,
          phone: form.get('seller_info.phone' as string)?.toString() as string
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