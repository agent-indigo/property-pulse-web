'use server'
import {revalidatePath} from 'next/cache'
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
        if (sessionUser._id === property.owner.toString()) {
          await propertyModel.findByIdAndUpdate(propertyId, {
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
          revalidatePath('/', 'layout')
          return {
            message: 'Changes saved. Await redirect...',
            success: true
          }
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