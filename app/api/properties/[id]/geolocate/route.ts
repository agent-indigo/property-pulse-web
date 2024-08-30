import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {NextRequest, NextResponse} from 'next/server'
import {Client, GeocodeResponse} from '@googlemaps/google-maps-services-js'
import propertyModel from '@/models/propertyModel'
import {e404, e500, s200} from '@/utilities/responses'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import PropertyDocument from '@/interfaces/PropertyDocument'
import PropertyLocation from '@/interfaces/PropertyLocation'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Geolocate a property
 * @route   GET /api/properties/:id/geolocate
 * @access  public
 */
export const GET = async (request: NextRequest, {params}: Params): Promise<NextResponse> => {
  const activity: string = 'geolocating property'
  try {
    await connectToMongoDB()
    const property: PropertyDocument | null = await propertyModel.findById(params.id)
    if (property) {
      const location: PropertyLocation = property.location
      const geolocator: Client = new Client()
      const response: GeocodeResponse = await geolocator.geocode({params: {
        address: `${location.street} ${location.city} ${location.state} ${location.zipcode} USA`,
        key: process.env.PRIVATE_GOOGLE_MAPS_GEOCODING_API_KEY ?? ''
      }})
      return response.status === 200
      ? s200(JSON.stringify(response.data.results[0].geometry.location))
      : e500(
        activity,
        'Geocoding error.'
      )
    } else {
      return e404('Property')
    }
  } catch (error: any) {
    return e500(
      activity,
      error
    )
  }
}