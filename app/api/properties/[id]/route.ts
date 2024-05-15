import {NextApiRequest} from 'next'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import {Property} from '@/utilities/interfaces'
/**
 * @name    GET
 * @desc    GET a single property
 * @route   GET /api/properties/:_id
 * @access  public
 */
export const GET: Function = async (request: NextApiRequest, {params}: {params: any}): Promise<Response> => {
    try {
        await connectToMongoDB()
        const property: Property | null = await propertyModel.findById(params._id)
        if (property) {
            return new Response(JSON.stringify(property), {status: 200})
        } else {
            return new Response('Property not found.', {status: 404})
        }
    } catch (error) {
        return new Response(`Error fetching property:\n${error}`, {status: 500})
    }
}