import {
  NextRequest,
  NextResponse
} from 'next/server'
import {FlattenMaps} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import PropertyDocument from '@/interfaces/PropertyDocument'
import PlainProperty from '@/interfaces/PlainProperty'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
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
    return dataResponse(JSON.stringify((await propertyModel.find({
      is_featured: true
    }).lean()).map((
      property: FlattenMaps<PropertyDocument>
    ): PlainProperty => convertToPlainDocument(property))))
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving featured properties',
      error
    )
  }
}