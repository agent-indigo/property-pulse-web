'use client'
import {useEffect, useState, ReactElement, FunctionComponent} from 'react'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api'
import Spinner from '@/components/Spinner'
import {DestructuredProperty} from '@/utilities/interfaces'
import {getPropertyGeoCoordinates} from '@/utilities/requests'
const PropertyMap: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const [lat, setLat] = useState<number>(0)
  const [lng, setLng] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [geocodingError, setGeocodingError] = useState<boolean>(true)
  useEffect(
    (): void => {
      const setCoordinates: Function = async (): Promise<void> => {
        const {lat, lng} = await getPropertyGeoCoordinates(property._id)
        if (!isNaN(lat) && !isNaN(lng)) {
          setLat(lat)
          setLng(lng)
          setGeocodingError(false)
        }
      }
      setCoordinates()
      setLoading(false)
    },
    [property]
  )
  return loading ? <Spinner loading={loading}/> : geocodingError ? (
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