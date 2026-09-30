import {
  NextRequest,
  NextResponse
} from 'next/server'
import connectToMongoDB from '@/src/library/utilities/connectToMongoDB'
import propertyDocumentModel from '@/src/library/models/propertyDocumentModel'
import PropertySearchQuery from '@/src/library/types/PropertySearchQuery'
import success200response from '@/src/library/httpResponses/success200response'
import error500response from '@/src/library/httpResponses/error500response'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get search results
 * @route   GET /api/properties/search?location&type&page
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const {searchParams}: URL = new URL(request.url)
    const location: string | null = searchParams.get('location')
    const propertyType: string | null = searchParams.get('type')
    const page: string | null = searchParams.get('page')
    const query: PropertySearchQuery = {}
    if (location && location !== '') {
      const locationPattern: RegExp = new RegExp(
        location,
        'i'
      )
      query.$or = [{
        name: locationPattern
      }, {
        description: locationPattern
      }, {
        'location.street': locationPattern
      }, {
        'location.city': locationPattern
      }, {
        'location.state': locationPattern
      }, {
        'location.zipcode': locationPattern
      }]
    }
    if (propertyType && propertyType !== 'All') query.type = new RegExp(
      propertyType,
      'i'
    )
    await connectToMongoDB()
    return success200response({
      properties: await propertyDocumentModel
        .find(query)
        .skip((parseInt(page && page !== '' ? page : '1') - 1) * 6)
        .limit(6)
        .lean(),
      total: (await propertyDocumentModel.find(query)).length
    })
  } catch (error: any) {
    return error500response(error)
  }
}