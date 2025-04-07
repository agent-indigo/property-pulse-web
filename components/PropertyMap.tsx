'use client'
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState
} from 'react'
import {toast} from 'react-toastify'
import {
  GoogleMap,
  LoadScript,
  Marker
} from '@react-google-maps/api'
import {LatLngLiteral} from '@googlemaps/google-maps-services-js'
import Spinner from '@/components/Spinner'
import DestructuredProperty from '@/types/DestructuredProperty'
import PlainProperty from '@/types/PlainProperty'
const PropertyMap: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {
    _id,
    location
  }: PlainProperty = property
  const [
    lat,
    setLat
  ] = useState<number>(0)
  const [
    lng,
    setLng
  ] = useState<number>(0)
  const [
    loading,
    setLoading
  ] = useState<boolean>(true)
  const [
    errorOccured,
    setErrorOccured
  ] = useState<boolean>(false)
  useEffect((): void => {(async (): Promise<void> => {
    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${_id}/geolocate`)
    if (response.ok) {
      const {
        lat,
        lng
      }: LatLngLiteral = await response.json()
      setLat(lat)
      setLng(lng)
    } else {
      toast.error(await response.text())
      setErrorOccured(true)
    }
    setLoading(false)
  })()}, [
    location
  ])
  return loading ? (
    <Spinner loading={loading}/>
  ) : errorOccured ? (
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
        center={{
          lat,
          lng
        }}
        zoom={15}
      >
        <Marker position={{
          lat,
          lng
        }}/>
      </GoogleMap>
    </LoadScript>
  )
}
export default PropertyMap