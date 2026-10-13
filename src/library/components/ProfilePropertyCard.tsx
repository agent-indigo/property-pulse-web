import {
  FunctionComponent,
  ReactElement
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProfilePropertyDeleteButton from '@/src/library/components/ProfilePropertyDeleteButton'
import DestructuredProperty from '@/src/library/types/DestructuredProperty'
import PlainProperty from '@/src/library/types/PlainProperty'
import PropertyLocation from '@/src/library/types/PropertyLocation'
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
        <Link
          href={`/properties/${_id}/images/add`}
          className='bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600'
        >
          Add Images
        </Link>
        <Link
          href={`/properties/${_id}/images/delete`}
          className='bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600'
        >
          Delete Images
        </Link>
        <ProfilePropertyDeleteButton _id={_id}/>
      </div>
    </div>
  )
}
export default ProfilePropertyCard