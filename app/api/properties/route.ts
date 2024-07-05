import {NextApiRequest} from 'next'
import {Document, Schema} from 'mongoose'
import {UploadApiResponse} from 'cloudinary'
import cloudinary from '@/utilities/cloudinary'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import getSessionUser from '@/utilities/getSessionUser'
import propertyModel from '@/models/propertyModel'
import {ListedProperty, Location, Rates, SellerInfo} from '@/utilities/interfaces'
/**
 * @name    GET
 * @desc    GET all properties
 * @route   GET /api/properties
 * @access  public
 */
export const GET: Function = async (request: NextApiRequest): Promise<Response> => {
  try {
    await connectToMongoDB() as void
    const properties: ListedProperty[] = await propertyModel.find({}) as ListedProperty[]
    return new Response(JSON.stringify(properties) as string, {status: 200 as number}) as Response
  } catch (error: unknown) {
    return new Response(`Error fetching properties:\n${error as string}` as string, {status: 500 as number}) as Response
  }
}
/**
 * @name    POST
 * @desc    Add a property
 * @route   POST /api/properties
 * @access  private
 */
export const POST: Function = async (request: NextApiRequest): Promise<Response> => {
  try {
    const subittedForm: ListedProperty = await request.body.formData() as ListedProperty
    const imageFiles: File[] = subittedForm.imageFiles?.filter((image: File) => image.name as string !== '' as string) as File[]
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
    await connectToMongoDB() as void
    const owner: Schema.Types.ObjectId = await getSessionUser()._id as Schema.Types.ObjectId
    const propertyData: ListedProperty = {
      owner,
      type: subittedForm.type as string,
      name: subittedForm.name as string,
      description: subittedForm.description as string,
      location: {
        street: subittedForm.location.street as string,
        city: subittedForm.location.city as string,
        state: subittedForm.location.state as string,
        zipcode: subittedForm.location.zipcode as string
      } as Location,
      beds: subittedForm.beds as number,
      baths: subittedForm.baths as number,
      square_feet: subittedForm.square_feet as number,
      amenities: subittedForm.amenities as string[],
      rates: {
        nightly: subittedForm.rates.nightly as number,
        weekly: subittedForm.rates.weekly as number,
        monthly: subittedForm.rates.monthly as number
      } as Rates,
      seller_info: {
        name: subittedForm.seller_info.name as string,
        email: subittedForm.seller_info.email as string,
        phone: subittedForm.seller_info.phone as string
      } as SellerInfo,
      images
    } as ListedProperty
    const property: Document<ListedProperty> & ListedProperty & Required<{_id: Schema.Types.ObjectId}> = new propertyModel(propertyData as ListedProperty) as Document<ListedProperty> & ListedProperty & Required<{_id: Schema.Types.ObjectId}>
    await property.save() as Document<ListedProperty> & ListedProperty & Required<{_id: Schema.Types.ObjectId}>
    return Response.redirect(`${process.env.NEXTAUTH_URL as string}/properties/${property._id as Schema.Types.ObjectId}` as string) as Response
  } catch (error: unknown) {
    return new Response(`Error adding property:\n${error as string}` as string, {status: 500 as number}) as Response
  }
}