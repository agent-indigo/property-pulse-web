import {NextRequest, NextResponse} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import {e500, s200} from '@/utilities/responses'
import propertyModel from '@/models/propertyModel'
import {PropertySearchQuery} from '@/utilities/interfaces'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get search results
 * @route   GET /api/properties/search?location&type
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const searchParams: URLSearchParams = new URL(request.url).searchParams
    const location: string | null = searchParams.get('location')
    const propertyType: string | null = searchParams.get('type')
    const query: PropertySearchQuery = {}
    if (location && location !== '') {
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
    await connectToMongoDB()
    return s200(JSON.stringify(await propertyModel.find(query)))
  } catch (error: any) {
    return e500(
      'searching for matching properties',
      error
    )
  }
}