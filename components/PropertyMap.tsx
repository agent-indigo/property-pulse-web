'use client'
import {useEffect, useState, ReactElement} from 'react'
import Map, {Marker} from 'react-map-gl'
import {setDefaults, fromAddress, OutputFormat} from 'react-geocode'
import Image from 'next/image'
import {toast} from 'react-toastify'
import Spinner from '@/components/Spinner'
import {DestructuredProperty, GeocodeResponse} from '@/utilities/interfaces'
import pin from '@/assets/images/pin.svg'
import 'mapbox-gl/dist/mapbox-gl.css'
const PropertyMap: React.FC<DestructuredProperty> = ({property}: DestructuredProperty): ReactElement => {
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [geocodeError, setGeocodeError] = useState<boolean>(false)
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    language: 'en',
    region: 'us',
    outputFormat: OutputFormat.JSON
  })
  useEffect(
    (): void => {
      const getCoordinates: Function = async (): Promise<void> => {
        try {
          const response: GeocodeResponse = await fromAddress(`${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`)
          if (response.results.length > 0) {
            const {
              lat: latitude,
              lng: longitude
            }: {
              lat: number,
              lng: number
            } = response.results[0].geometry.location
            setLatitude(latitude)
            setLongitude(longitude)
          } else {
            setGeocodeError(true)
          }
        } catch (error: any) {
          toast.error(`Error fetching coordinates:\n${error.toString()}`)
          setGeocodeError(true)
        } finally {
          setLoading(false)
        }
      }
      getCoordinates()
    },
    [property]
  )
  const validateCoordinate: Function = (coordinate: number) => !isNaN(coordinate) && coordinate !== null && coordinate !== undefined
  if (loading) {
    return <Spinner loading={loading}/>
  } else if (geocodeError) {
    return (
      <div className="text-xl">
        Location not found.
      </div>
    )
  } else if (!validateCoordinate(latitude) || !validateCoordinate(longitude)) {
    return (
      <div className="text-xl">
        Invalid coordinates.
      </div>
    )
  } else {
    return (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import('mapbox-gl')}
        initialViewState={{
          latitude,
          longitude,
          zoom: 15
        }}
        style={{
          width: '100%',
          height: 500
        }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
      >
        <Marker
          latitude={latitude}
          longitude={longitude}
          anchor='bottom'
        >
          <Image
            src={pin}
            alt='location'
            width={40}
            height={40}
          />
        </Marker>
      </Map>
    )
  }
}
export default PropertyMap