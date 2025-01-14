'use server'
import {
  Client,
  GeocodeResponse,
  LatLngLiteral
} from '@googlemaps/google-maps-services-js'
import PropertyLocation from '@/interfaces/PropertyLocation'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
const geoLocateProperty: Function = async (location: PropertyLocation): Promise<ServerActionResponse> => {
  try {
    const response: GeocodeResponse = await new Client().geocode({
      params: {
        address: `${location.street} ${location.city} ${location.state} ${location.zipcode} USA`,
        key: process.env.PRIVATE_GOOGLE_MAPS_GEOCODING_API_KEY ?? ''
      }
    })
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
        error: `500: Internal server error geolocating property:\n${response.data.error_message}`,
        success: false
      }
    }
  } catch (error: any) {
    return {
      error: `500: Internal server error geolocating property:\n${error.toString()}`,
      success: false
    }
  }
}
export default geoLocateProperty