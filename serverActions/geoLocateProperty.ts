'use server'
import {
  Client,
  GeocodeResponse,
  LatLngLiteral
} from '@googlemaps/google-maps-services-js'
import PropertyLocation from '@/interfaces/PropertyLocation'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
const geoLocateProperty: Function = async (
  location: PropertyLocation
): Promise<ServerActionResponse> => {
  try {
    const geoLocator: Client = new Client()
    const response: GeocodeResponse = await geoLocator.geocode({params: {
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
    if (response.status === 200) {
      const {
        lat,
        lng
      }: LatLngLiteral = response.data.results[0].geometry.location
      return {
        lat,
        lng,
        success: true
      }
    } else {
      return {
        error: `500: Internal Server Error:\n${response.data.error_message}`,
        success: false
      }
    }
  } catch (error: any) {
    return {
      error: `500: Internal Server Error:\n${error.toString()}`,
      success: false
    }
  }
}
export default geoLocateProperty