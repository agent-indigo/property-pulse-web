import {
  NextRequest,
  NextResponse
} from 'next/server'
import connectToMongoDB from '@/src/library/utilities/connectToMongoDB'
import propertyDocumentModel from '@/src/library/models/propertyDocumentModel'
import success200response from '@/src/library/httpResponses/success200response'
import error500response from '@/src/library/httpResponses/error500response'
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