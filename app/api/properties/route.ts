import {NextApiRequest} from 'next'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import {ListedProperty} from '@/utilities/interfaces'
/**
 * @name    GET
 * @desc    GET all properties
 * @route   GET /api/properties
 * @access  public
 */
export const GET: Function = async (request: NextApiRequest): Promise<Response> => {
  try {
    await connectToMongoDB()
    const properties: ListedProperty[] = await propertyModel.find({})
    return new Response(JSON.stringify(properties), {status: 200})
  } catch (error: unknown) {
    return new Response(`Error fetching properties:\n${error}`, {status: 500})
  }
}