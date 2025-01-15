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
      return response.status === 200 ? new NextResponse(
        JSON.stringify(response.data.results[0].geometry.location), {
          status: 200,
          statusText: 'OK'
        }
      ) : new NextResponse(
        undefined, {
          status: 500,
          statusText: response.statusText
        }
      )
    } else {
      return new NextResponse(
        undefined, {
          status: 404,
          statusText: 'Property not found'
        }
      )
    }
  } catch (error: any) {
    return new NextResponse(
      undefined, {
        status: 500,
        statusText: `Internal server error:\n${error.toString()}`
      }
    )
  }
}