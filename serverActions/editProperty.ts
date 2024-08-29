'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import PropertyDocument from '@/interfaces/PropertyDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from './getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
const editProperty: Function = async (
  propertyId: string,
  form: FormData
): Promise<ServerActionResponse> => {
  try {
    const {error, success, sessionUser}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const property: PropertyDocument | null = await propertyModel.findById(propertyId)
      if (property) {
        if (sessionUser._id === property.owner?.toString()) {
          property.type = form.get('type')?.valueOf().toString() ?? ''
          property.name = form.get('name')?.valueOf().toString()?? ''
          property.description = form.get('description')?.valueOf().toString() ?? ''
          property.location.street = form.get('location.street')?.valueOf().toString() ?? ''
          property.location.city = form.get('location.city')?.valueOf().toString() ?? ''
          property.location.state = form.get('location.state')?.valueOf().toString() ?? ''
          property.location.zipcode = form.get('location.zipcode')?.valueOf().toString() ?? ''
          property.beds = parseInt(form.get('beds')?.valueOf().toString() ?? '')
          property.baths = parseInt(form.get('baths')?.valueOf().toString() ?? '')
          property.square_feet = parseFloat(form.get('square_feet')?.valueOf().toString() ?? '')
          property.amenities = form.getAll('amenities').map((
            amenity: FormDataEntryValue
          ): string => amenity
            .valueOf()
            .toString()
          )
          property.rates.nightly = parseFloat(form.get('rates.nightly')?.valueOf().toString() ?? '')
          property.rates.weekly = parseFloat(form.get('rates.weekly')?.valueOf().toString() ?? '')
          property.rates.monthly = parseFloat(form.get('rates.monthly')?.valueOf().toString() ?? '')
          property.seller_info.name = form.get('seller_info.name')?.valueOf().toString() ?? ''
          property.seller_info.email = form.get('seller_info.email')?.valueOf().toString() ?? ''
          property.seller_info.phone = form.get('seller_info.phone')?.valueOf().toString() ?? ''
          await property.save()
          revalidatePath('/', 'layout')
          redirect(`/properties/${propertyId}`)
        } else {
          return {
            error: '401: Unauthorized',
            success: false
          }
        }
      } else {
        return {
          error: '404: Property Not Found',
          success: false
        }
      }
    } else {
      return {
        error,
        success: false
      }
    }
  } catch (error: any) {
    return {
      error: `500: Internal Server Error:\n${error.toString()}`,
      success: false
    }
  }
}
export default editProperty