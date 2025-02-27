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
import success200response from '@/httpResponses/success200response'
import error500response from '@/httpResponses/error500response'
import error404response from '@/httpResponses/error404response'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Geolocate a property
 * @route   GET /api/properties/:id/geolocate
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const property: PropertyDocument | null = await propertyModel.findById((await params).id)
    if (property) {
      const {location}: PropertyDocument = property
      const response: GeocodeResponse = await new Client().geocode({
        params: {
          address: `${location.street} ${location.city} ${location.state} ${location.zipcode} USA`,
          key: process.env.PRIVATE_GOOGLE_MAPS_GEOCODING_API_KEY ?? ''
        }
      })
      return response.status === 200 ? success200response(response.data.results[0].geometry.location) : error500response(new Error(response.data.error_message))
    } else {
      return error404response
    }
  } catch (error: any) {
    return error500response(error)
  }
}