import {
  NextRequest,
  NextResponse
} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyDocumentModel from '@/models/propertyDocumentModel'
import success200response from '@/httpResponses/success200response'
import error500response from '@/httpResponses/error500response'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get featured properties
 * @route   GET /api/properties/featured
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    return success200response(await propertyDocumentModel.find({
      is_featured: true
    }).lean())
  } catch (error: any) {
    return error500response(error)
  }
}