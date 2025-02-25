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
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const property: PropertyDocument | null = await propertyModel.findById(propertyId)
      if (property) {
        if (sessionUser._id === property.owner.toString()) {
          await propertyModel.findByIdAndUpdate(
            propertyId,
            Object.fromEntries(form.entries())
          )
          revalidatePath(
            '/',
            'layout'
          )
          return {
            message: 'Changes saved.',
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
          error: '404: Property not found',
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
      error: `500: Internal server error editing property:\n${error.toString()}`,
      success: false
    }
  }
}
export default editProperty