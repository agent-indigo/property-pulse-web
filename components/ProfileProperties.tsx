'use client'
import {
  FunctionComponent,
  ReactElement,
  useState
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {toast} from 'react-toastify'
import deleteProperty from '@/serverActions/deleteProperty'
import Properties from '@/interfaces/Properties'
import PlainProperty from '@/interfaces/PlainProperty'
import PropertyLocation from '@/interfaces/PropertyLocation'
const ProfileProperties: FunctionComponent<Properties> = ({properties: received}): ReactElement => {
  const [
    properties,
    setProperties
  ] = useState<PlainProperty[]>(received)
  const handleDelete: Function = async (propertyId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this proerty?')) {
      const {
        error,
        message,
        success
      } = await deleteProperty(propertyId)
      setProperties(properties.filter((property: PlainProperty): boolean => property._id !== propertyId))
      success ? toast.success(message) : toast.error(`Error deleting property:\n${error}`)
    }
  }
  return (
    <section>
      {properties.map((property: PlainProperty) => {
        const {
          _id,
          images,
          name,
          location
        }: PlainProperty = property
        const {
          street,
          city,
          state
        }: PropertyLocation = location
        return(
          <div
            key={_id}
            className='mb-10'
          >
            <Link href={`/properties/${_id}`}>
              <Image
                className='h-32 w-full rounded-md object-cover'
                src={images[0]}
                alt=''
                width={500}
                height={100}
                priority={true}
              />
            </Link>
            <div className='mt-2'>
              <p className='text-lg font-semibold'>
                {name}
              </p>
              <p className='text-gray-600'>
                Address: {street} {city} {state}
              </p>
            </div>
            <div className='mt-2'>
              <Link
                href={`/properties/${_id}/edit`}
                className='bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600'
              >
                Edit
              </Link>
              <button
                onClick={(): void => handleDelete(_id)}
                type='button'
                className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600'
              >
                Delete
              </button>
            </div>
          </div>
        )}
      )}
    </section>
  )
}
export default ProfileProperties