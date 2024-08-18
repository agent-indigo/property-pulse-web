import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {NextRequest, NextResponse} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import {e404, e500, s200} from '@/utilities/responses'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get all properties listed by the given user
 * @route   GET /api/properties/user/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: Params
): Promise<NextResponse> => {
  try {
    const id: string = params.id
    await connectToMongoDB()
    return await userModel.findById(id) ? s200(JSON.stringify(await propertyModel.find({owner: id}))) : e404('User')
  } catch (error: any) {
    return e500(
      'retrieving properties',
      error
    )
  }
}