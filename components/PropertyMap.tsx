'use client'
import {useEffect, ReactElement, FunctionComponent} from 'react'
import {toast} from 'react-toastify'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api'
import Spinner from '@/components/Spinner'
import {DestructuredProperty, GeoCodingResponse} from '@/utilities/interfaces'
import {useGetPropertyGeoCoordinatesQuery} from '@/slices/propertiesApiSlice'
const PropertyMap: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {
    data: response,
    isLoading,
    isError,
    error
  } = useGetPropertyGeoCoordinatesQuery(property._id?.toString() ?? '')
  const {lat, lng}: GeoCodingResponse = response ?? {lat: 0, lng: 0}
  useEffect(
    (): void => {
      if (isLoading) isError && toast.error(`Error geolocating property:\n${JSON.stringify(error)}`)
    },
    [isError, error, isLoading]
  )
  return isLoading ? <Spinner loading={isLoading}/> : isError ? (
    <h1 className='text-red-500 text-center font-bold'>
      Geocoding Error
    </h1>
  ) : (
    <LoadScript googleMapsApiKey={process.env.PUBLIC_GOOGLE_MAPS_JS_API_KEY ?? ''}>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: 500
        }}
        center={{lat, lng}}
        zoom={15}
      >
        <Marker position={{lat, lng}}/>
      </GoogleMap>
    </LoadScript>
  )
}
export default PropertyMap