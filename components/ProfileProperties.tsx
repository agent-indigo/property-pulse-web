'use client'
import {FunctionComponent, ReactElement, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {toast} from 'react-toastify'
import {FlattenMaps} from 'mongoose'
import deleteProperty from '@/serverActions/deleteProperty'
import LeanProperties from '@/interfaces/LeanProperties'
import PropertyDocument from '@/interfaces/PropertyDocument'
const ProfileProperties: FunctionComponent<LeanProperties> = ({properties: received}): ReactElement => {
  const [properties, setProperties] = useState<FlattenMaps<PropertyDocument>[]>(received)
  const handleDelete: Function = async (propertyId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this proerty?')) {
      const {message, success} = await deleteProperty(propertyId)
      setProperties(properties.filter((
        property: FlattenMaps<PropertyDocument>
      ): boolean => property._id !== propertyId))
      success ? toast.success(message) : toast.error(message)
    }
  }
  return (
    <>
      {properties.map((property: FlattenMaps<PropertyDocument>) => (
        <div
          key={property._id}
          className='mb-10'
        >
          <Link href={`/properties/${property._id}`}>
            <Image
              className='h-32 w-full rounded-md object-cover'
              src={property.images?.[0] ?? ''}
              alt=''
              width={500}
              height={100}
              priority={true}
            />
          </Link>
          <div className='mt-2'>
            <p className='text-lg font-semibold'>
              {property.name}
            </p>
            <p className='text-gray-600'>
              Address: {property.location.street} {property.location.city} {property.location.state}
            </p>
          </div>
          <div className='mt-2'>
            <Link
              href={`/properties/${property._id}/edit`}
              className='bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600'
            >
              Edit
            </Link>
            <button
              onClick={(): void => handleDelete(property._id)}
              type='button'
              className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600'
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
export default ProfileProperties