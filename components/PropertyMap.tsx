'use client'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api'
import Spinner from '@/components/Spinner'
import {ActionResponse, DestructuredSerializedProperty, Location} from '@/utilities/interfaces'
import {geoLocateProperty} from '@/utilities/actions'
const PropertyMap: FunctionComponent<DestructuredSerializedProperty> = ({property}): ReactElement => {
  const location: Location = property.location
  const [lat, setLat] = useState<number>(0)
  const [lng, setLng] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [errorOccured, setErrorOccured] = useState<boolean>(false)
  useEffect(
    (): void => {
      const geoLocate: Function = async (): Promise<void> => {
        const {error, lat, lng, success}: ActionResponse = await geoLocateProperty(location)
        if (success && lat && lng) {
          setLat(lat)
          setLng(lng)
        } else {
          toast.error(`Error geolocating property:\n${error.toString()}`)
          setErrorOccured(true)
        }
        setLoading(false)
      }
      geoLocate()
    },
    [location]
  )
  return loading ? <Spinner loading={loading}/> : errorOccured ? (
    <h1 className='text-red-500 text-center font-bold'>
      Error geolocating property.
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