'use client'
import {useEffect, ReactElement, FunctionComponent} from 'react'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {useRouter} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {useSession} from 'next-auth/react'
import {Helmet} from 'react-helmet'
import {toast} from 'react-toastify'
import profileDefault from '@/assets/images/profile.png'
import Spinner from '@/components/Spinner'
import {ListedProperty, SessionData} from '@/utilities/interfaces'
import {useGetUserPropertiesQuery, useDeletePropertyMutation} from '@/slices/propertiesApiSlice'
const ProfilePage: FunctionComponent = (): ReactElement => {
  const router: AppRouterInstance = useRouter()
  const {data: session}: SessionData = useSession<boolean>() as SessionData
  const id: string = session?.user?.id ?? ''
  const {data: properties, isLoading, isError, error, refetch} = useGetUserPropertiesQuery(id)
  const [deleteProperty, {isLoading: deleting, isError: deleteFailed, error: deleteError}] = useDeletePropertyMutation()
  useEffect(
    (): void => {
      if (!isLoading) {
        if (isError) {
          toast.error(`Error retrieving profile:\n${JSON.stringify(error)}`)
          router.push('/error')
        }
      }
    },
    [isError, error, router, isLoading]
  )
  const handleDelete: Function = async (id: string): Promise<void> => {
    await deleteProperty(id)
    if (!deleting) {
      if (deleteFailed) {
        toast.error(`Error deleting property:\n${JSON.stringify(deleteError)}`)
      } else {
        toast.success('Propety deleted.')
        refetch()
      }
    }
  }
  return (
    <>
      <Helmet>
        <title>
          {deleting ? 'Processing...' : isLoading ? 'Loading...' : `Profle | ${session?.user.id}`} | PropertyPulse | Find the Perfect Rental
        </title>
      </Helmet>
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
                    src={session?.user?.image ?? profileDefault}
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
                {isLoading ? <Spinner loading={isLoading}/> : properties && (properties.length === 0 ? (
                  <p>You haven&apos;t listed any properties.</p>
                ) : (properties.map((property: ListedProperty): ReactElement => (
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
                      onClick={(): void => handleDelete(property._id?.toString() ?? '')}
                        className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600'
                        type='button'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
export default ProfilePage