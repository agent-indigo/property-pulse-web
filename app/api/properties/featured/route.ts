import {
  NextRequest,
  NextResponse
} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import dataResponse from '@/httpResponses/dataResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
export {dynamic} from '@/config/dynamic'
/**
 * @name    GET
 * @desc    Get featured properties
 * @route   GET /api/properties/featured
 * @access  public
 */
export const GET = async (
  request: NextRequest
): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    return dataResponse(JSON.stringify(JSON.parse(JSON.stringify(await propertyModel
      .find({
        is_featured: true
      })
      .lean()
    ))))
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving featured properties',
      error
    )
  }
}