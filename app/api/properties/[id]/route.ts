import {NextApiRequest} from 'next'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import {ListedProperty} from '@/utilities/interfaces'
/**
 * @name    GET
 * @desc    GET a single property
 * @route   GET /api/properties/:_id
 * @access  public
 */
export const GET: Function = async (request: NextApiRequest, {params}: {params: {id: string}}): Promise<Response> => {
  try {
    await connectToMongoDB() as void
    const property: ListedProperty | null = await propertyModel.findById(params.id as string) as ListedProperty
    if (property as ListedProperty) {
      return new Response(JSON.stringify(property as ListedProperty) as string, {status: 200 as number}) as Response
    } else {
      return new Response('Property not found.' as string, {status: 404 as number}) as Response
    }
  } catch (error: unknown) {
    return new Response(`Error fetching property:\n${error as string}` as string, {status: 500 as number}) as Response
  }
}