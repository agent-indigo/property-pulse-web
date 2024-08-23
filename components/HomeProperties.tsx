'use client'
import Link from 'next/link'
import {FunctionComponent, ReactElement, useEffect} from 'react'
import {toast} from 'react-toastify'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {useRouter} from 'next/navigation'
import {ListedProperty} from '@/utilities/interfaces'
import PropertyCard from '@/components/PropertyCard'
import {useGetPropertiesQuery} from '@/slices/propertiesApiSlice'
import FeaturedProperties from '@/components/FeaturedProperties'
import Spinner from '@/components/Spinner'
const HomeProperties: FunctionComponent = (): ReactElement => {
  const {data: response, isLoading, isError, error} = useGetPropertiesQuery(undefined)
  const properties: ListedProperty[] = response?.properties ?? []
  const router: AppRouterInstance = useRouter()
  useEffect(
    (): void => {
      if (isLoading) {
        if (isError) {
          toast.error(`Error retrieving properties:\n${JSON.stringify(error)}`)
          router.push('/error')
        }
      }
    },
    [isError, error, router, isLoading]
  )
  return isLoading ? <Spinner loading={isLoading}/> : (
    <>
      <FeaturedProperties/>
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto'>
          <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
            Recent Properties
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[...properties].length === 0 ? (
              <p>
                No current listings.
              </p>
            ) : (
              [...properties].sort((): number => Math.random() - Math.random()).slice(
                0,
                3
              ).map((property: ListedProperty): ReactElement => (
                <PropertyCard
                  key={property._id?.toString()}
                  property={property}
                />
              ))
            )}
          </div>
        </div>
      </section>
      <section className='m-auto max-w-lg my-10 px-6'>
        <Link
          href='/properties?page=1'
          className='block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700'
        >
          View All Properties
        </Link>
      </section>
    </>
  )
}
export default HomeProperties