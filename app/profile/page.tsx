'use client'
import {useEffect, useState, ReactElement} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useSession} from 'next-auth/react'
import {getUserProperties, deleteProperty} from '@/utilities/requests'
import profileDefault from '@/assets/images/profile.png'
import Spinner from '@/components/Spinner'
import {ListedProperty, SessionData} from '@/utilities/interfaces'
const ProfilePage: React.FC = (): ReactElement => {
  const {data: session}: SessionData = useSession<boolean>() as SessionData
  const id: string | undefined = session?.user?.id
  const name: string | null | undefined = session?.user?.name
  const [properties, setProperties] = useState<ListedProperty[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(
    (): void => {
      const fetchProperties: Function = async (id: string): Promise<void> => {
        setProperties(await getUserProperties(id))
        setLoading(false)
      }
      if (id) fetchProperties(id)
      if (name) document.title = `${name} | PropertyPulse | Find the Perfect Rental`
    },
    [id, name]
  )
  return (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>
            Your Profile
          </h1>
          <div className='flex flex-col md:flex-row'>
            <div className='md:w-1/4 mx-20 mt-10'>
              <div className='mb-4'>
                <Image
                  className='h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0'
                  src={session?.user?.image || profileDefault}
                  width={200}
                  height={200}
                  alt='User'
                />
              </div>
              <h2 className='text-2xl mb-4'>
                {session?.user?.name}
              </h2>
              <h2 className='text-2xl'>
                {session?.user?.email}
              </h2>
            </div>
            <div className='md:w-3/4 md:pl-4'>
              <h2 className='text-xl font-semibold mb-4'>Your Listings</h2>
              {!loading && properties.length === 0 && (
                <p>You haven&apos;t listed any properties.</p>
              )}
              {loading ? (<Spinner loading={loading}/>) : (
                properties.map((property: ListedProperty) => (
                  <div
                    key={property._id?.toString()}
                    className='mb-10'
                  >
                    <Link href='/property.html'>
                      <Image
                        className='h-32 w-full rounded-md object-cover'
                        src={property.images?.[0] ?? ''}
                        width={500}
                        height={100}
                        priority={true}
                        alt=''
                      />
                    </Link>
                    <div className='mt-2'>
                      <p className='text-lg font-semibold'>
                        {property.name}
                      </p>
                      <p className='text-gray-600'>
                        {property.location.street}, {property.location.city}, {property.location.state} {property.location.zipcode}
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
                        onClick={async (): Promise<void> => setProperties(await deleteProperty(property._id))}
                        className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600'
                        type='button'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ProfilePage