'use client'
import {
  FunctionComponent,
  MouseEventHandler,
  ReactElement
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {toast} from 'react-toastify'
import DestructuredProperty from '@/interfaces/DestructuredProperty'
import PlainProperty from '@/interfaces/PlainProperty'
import PropertyLocation from '@/interfaces/PropertyLocation'
const ProfilePropertyCard: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {
    _id,
    images,
    name,
    location
  }: PlainProperty = property
  const {
    city,
    state,
    street
  }: PropertyLocation = location
  const handleDelete: MouseEventHandler = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${_id}`, {
          method: 'DELETE'
        }
      )
      response.ok ? toast.success('Property deleted.') : toast.error(await response.text())
    }
  }
  return (
    <div className='mb-10'>
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
          Address: {street}, {city}, {state}
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
          onClick={handleDelete}
          type='button'
          className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600'
        >
          Delete
        </button>
      </div>
    </div>
  )
}
export default ProfilePropertyCard