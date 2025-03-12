import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  Client,
  GeocodeResponse,
  GeocodeResponseData
} from '@googlemaps/google-maps-services-js'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import PropertyDocument from '@/interfaces/PropertyDocument'
import success200response from '@/httpResponses/success200response'
import error500response from '@/httpResponses/error500response'
import error404response from '@/httpResponses/error404response'
import PropertyLocation from '@/interfaces/PropertyLocation'
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
      const location: PropertyLocation = property.get('location')
      const {
        city,
        state,
        street,
        zipcode
      }: PropertyLocation = location
      const response: GeocodeResponse = await new Client().geocode({
        params: {
          address: `${street} ${city} ${state} ${zipcode} USA`,
          key: process.env.PRIVATE_GOOGLE_MAPS_GEOCODING_API_KEY ?? ''
        }
      })
      const {
        data,
        status
      }: GeocodeResponse = response
      const {
        error_message,
        results
      }: GeocodeResponseData = data
      return status === 200 ? success200response(results[0].geometry.location) : error500response(new Error(error_message))
    } else {
      return error404response
    }
  } catch (error: any) {
    return error500response(error)
  }
}