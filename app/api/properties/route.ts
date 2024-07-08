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
      const subittedForm: FormData = await request.formData() as FormData
      const amenitiesFromForm: FormDataEntryValue[] = subittedForm.getAll('amenities' as string) as FormDataEntryValue[]
      const amenities: string[] = [] as string[]
      amenitiesFromForm.map((amenity: FormDataEntryValue) => {
        amenities.push(amenity.valueOf() as string)
      })
      const imageFilesFromForm = subittedForm.getAll('imageFiles' as string)
      const imageFiles: File[] = [] as File[]
      imageFilesFromForm.map((imageFileFromForm: FormDataEntryValue) => {
        console.log(typeof imageFileFromForm.valueOf()) as void
        imageFiles.push(imageFileFromForm.valueOf() as File)
      })
      const imageUploadPromises: string[] = [] as string[]
      for (const image of imageFiles as File[]) {
        const imageBuffer: ArrayBuffer = await image.arrayBuffer() as ArrayBuffer
        const imageArray: number[] = Array.from(new Uint8Array(imageBuffer as ArrayBuffer)) as number[]
        const imageData: Buffer = Buffer.from(imageArray as number[]) as Buffer
        const imageBase64: string = imageData.toString('base64') as string
        const response: UploadApiResponse = await cloudinary.uploader.upload(`data:image/png;base64,${imageBase64 as string}` as string, {folder: 'PropertyPulse' as string}) as UploadApiResponse
        imageUploadPromises.push(response.secure_url as string)
      }
      const images: string[] = await Promise.all(imageUploadPromises as string[]) as string[]
      const owner: Schema.Types.ObjectId = registeredUser?._id as Schema.Types.ObjectId
      let nightly: number | undefined = undefined
      let weekly: number | undefined = undefined
      let monthly: number | undefined = undefined
      if (subittedForm.get('rates.nightly' as string) as FormDataEntryValue) nightly = Number.parseFloat(subittedForm.get('rates.nightly' as string)?.toString() as string) as number
      if (subittedForm.get('rates.weekly' as string) as FormDataEntryValue) weekly = Number.parseFloat(subittedForm.get('rates.weekly' as string)?.toString() as string) as number
      if (subittedForm.get('rates.monthly' as string) as FormDataEntryValue) monthly = Number.parseFloat(subittedForm.get('rates.monthly' as string)?.toString() as string) as number
      const propertyData: ListedProperty = {
        owner,
        type: subittedForm.get('type' as string)?.toString() as string,
        name: subittedForm.get('name' as string)?.toString() as string,
        description: subittedForm.get('description' as string)?.toString() as string,
        location: {
          street: subittedForm.get('location.street' as string)?.toString() as string,
          city: subittedForm.get('location.city' as string)?.toString() as string,
          state: subittedForm.get('location.state' as string)?.toString() as string,
          zipcode: subittedForm.get('location.zipcode' as string)?.toString() as string
        } as Location,
        beds: Number.parseInt(subittedForm.get('beds' as string)?.toString() as string) as number,
        baths: Number.parseFloat(subittedForm.get('baths' as string)?.toString() as string) as number,
        square_feet: Number.parseFloat(subittedForm.get('square_feet' as string)?.toString() as string),
        amenities,
        rates: {
          nightly,
          weekly,
          monthly
        } as Rates,
        seller_info: {
          name: subittedForm.get('seller_info.name' as string)?.toString() as string,
          email: subittedForm.get('seller_info.email' as string)?.toString() as string,
          phone: subittedForm.get('seller_info.phone' as string)?.toString() as string
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