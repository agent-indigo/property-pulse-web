import {
  NextRequest,
  NextResponse
} from 'next/server'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import dataResponse from '@/httpResponses/dataResponse'
import notFoundResponse from '@/httpResponses/notFoundResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
import UrlParams from '@/interfaces/UrlParams'
export {dynamic} from '@/config/dynamic'
/**
 * @name    GET
 * @desc    Get all properties listed by the given user
 * @route   GET /api/properties/user/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: UrlParams
): Promise<NextResponse> => {
  try {
    const id: string = params.id
    await connectToMongoDB()
    return await userModel.findById(id)
    ? dataResponse(JSON.stringify(JSON.parse(JSON.stringify(await propertyModel
      .find({
        owner: id
      })
      .lean()
    ))))
    : notFoundResponse('User')
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving user\'s properties',
      error
    )
  }
}