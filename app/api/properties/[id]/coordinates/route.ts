import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {NextRequest, NextResponse} from 'next/server'
import {Client, GeocodeResponse} from '@googlemaps/google-maps-services-js'
import propertyModel from '@/models/propertyModel'
import {e404, e500, s200} from '@/utilities/responses'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import {ListedProperty, Location} from '@/utilities/interfaces'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get a property's geolocation coordinates
 * @route   GET /api/properties/:id/coordinates
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: Params
): Promise<NextResponse> => {
  const activity: string = 'retrieving property geocoordinates'
  try {
    await connectToMongoDB()
    const property: ListedProperty | null = await propertyModel.findById(params.id)
    if (property) {
      const location: Location = property.location
      const client: Client = new Client()
      const response: GeocodeResponse = await client.geocode({params: {
        address: `${location.street} ${location.city} ${location.state} ${location.zipcode} USA`,
        key: process.env.PRIVATE_GOOGLE_MAPS_GEOCODING_API_KEY ?? ''
      }})
      if (response.status === 200) {
        return s200(JSON.stringify(response.data.results[0].geometry.location))
      } else {
        return e500(
          activity,
          'Geocoding error.'
        )
      }
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