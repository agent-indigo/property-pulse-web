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
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get all properties listed by the given user
 * @route   GET /api/properties/user/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const {id}: any = await params
    await connectToMongoDB()
    return await userModel.findById(id) ? dataResponse(await propertyModel.find({
      owner: id
    }).lean()) : notFoundResponse('User')
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving user\'s properties',
      error
    )
  }
}