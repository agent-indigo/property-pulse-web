import {
  NextRequest,
  NextResponse
} from 'next/server'
import {FlattenMaps} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import PropertySearchQuery from '@/interfaces/PropertySearchQuery'
import PropertyDocument from '@/interfaces/PropertyDocument'
import PlainProperty from '@/interfaces/PlainProperty'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
import dataResponse from '@/httpResponses/dataResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get search results
 * @route   GET /api/properties/search?location&type&page
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const searchParams: URLSearchParams = new URL(request.url).searchParams
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
    return dataResponse(JSON.stringify({
      properties: (await propertyModel.find(query).skip((parseInt(
        page && page !== '' ? page : '1'
      ) - 1) * 6).limit(6).lean()).map((
        property: FlattenMaps<PropertyDocument>
      ): PlainProperty => convertToPlainDocument(property)),
      total: (await propertyModel.find(query)).length
    }))
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving property search results',
      error
    )
  }
}