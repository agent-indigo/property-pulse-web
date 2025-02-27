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
import Spinner from '@/components/Spinner'
import geoLocateProperty from '@/serverActions/geoLocateProperty'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import DestructuredProperty from '@/interfaces/DestructuredProperty'
import PlainProperty from '@/interfaces/PlainProperty'
const PropertyMap: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {location}: PlainProperty = property
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
  useEffect((): void => {
    const geoLocate: Function = async (): Promise<void> => {
      const {
        error,
        lat,
        lng,
        success
      }: ServerActionResponse = await geoLocateProperty(location)
      if (success && lat !== undefined && lng !== undefined) {
        setLat(lat)
        setLng(lng)
      } else {
        toast.error(`Error geolocating property:\n${error}`)
        setErrorOccured(true)
      }
      setLoading(false)
    }
    geoLocate()
  }, [location])
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