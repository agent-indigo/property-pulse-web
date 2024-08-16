import {NextRequest, NextResponse} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import {e500response} from '@/utilities/apiResponses'
import propertyModel from '@/models/propertyModel'
import {PropertySearchQuery} from '@/utilities/interfaces'
/**
 * @name    GET
 * @desc    Get search results
 * @route   GET /api/properties/search
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const searchParams: URLSearchParams = new URL(request.url).searchParams
    const location: string | null = searchParams.get('location')
    const propertyType: string | null = searchParams.get('type')
    const query: PropertySearchQuery = {}
    if (location) {
      const locationPattern: RegExp = new RegExp(
        location,
        'i'
      )
      query.$or = [
        {name: locationPattern},
        {description: locationPattern},
        {'location.street': locationPattern},
        {'location.city': locationPattern},
        {'location.state': locationPattern},
        {'location.zipcode': locationPattern}
      ]
    }
    if (propertyType && propertyType !== 'All') query.type = new RegExp(
      propertyType,
      'i'
    )
    return new NextResponse(
      JSON.stringify(await propertyModel.find(query)),
      {status: 200}
    )
  } catch (error: any) {
    return e500response(
      'searching for matching properties',
      error
    )
  }
}