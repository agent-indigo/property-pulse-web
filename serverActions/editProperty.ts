'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {FlattenMaps} from 'mongoose'
import PropertyDocument from '@/interfaces/PropertyDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from './getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
const editProperty: Function = async (
  propertyId: string,
  update: FlattenMaps<PropertyDocument>
): Promise<ServerActionResponse> => {
  try {
    const {error, success, sessionUser}: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const property: PropertyDocument | null = await propertyModel.findById(propertyId)
      if (property) {
        await propertyModel.findByIdAndUpdate(propertyId, update)
        revalidatePath('/', 'layout')
        redirect(`/properties/${propertyId}`)
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