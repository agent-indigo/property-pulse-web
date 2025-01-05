import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  Client,
  GeocodeResponse
} from '@googlemaps/google-maps-services-js'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import PropertyDocument from '@/interfaces/PropertyDocument'
import PropertyLocation from '@/interfaces/PropertyLocation'
import dataResponse from '@/httpResponses/dataResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
import notFoundResponse from '@/httpResponses/notFoundResponse'
import UrlParams from '@/interfaces/UrlParams'
export {dynamic} from '@/config/dynamic'
/**
 * @name    GET
 * @desc    Geolocate a property
 * @route   GET /api/properties/:id/geolocate
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: UrlParams
): Promise<NextResponse> => {
  const activity: string = 'geolocating property'
  try {
    await connectToMongoDB()
    const property: PropertyDocument | null = await propertyModel.findById(params.id)
    if (property) {
      const location: PropertyLocation = property.location
      const geolocator: Client = new Client()
      const response: GeocodeResponse = await geolocator.geocode({params: {
        address: `${
          location.street
        } ${
          location.city
        } ${
          location.state
        } ${
          location.zipcode
        } USA`,
        key: process.env.PRIVATE_GOOGLE_MAPS_GEOCODING_API_KEY ?? ''
      }})
      return response.status === 200
      ? dataResponse(JSON.stringify(response.data.results[0].geometry.location))
      : serverErrorResponse(
        activity,
        'Geocoding error.'
      )
    } else {
      return notFoundResponse('Property')
    }
  } catch (error: any) {
    return serverErrorResponse(
      activity,
      error
    )
  }
}