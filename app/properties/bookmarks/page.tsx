'use client'
import {FunctionComponent, ReactElement, useEffect} from 'react'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {useRouter} from 'next/navigation'
import {Helmet} from 'react-helmet'
import {toast} from 'react-toastify'
import PropertyCard from '@/components/PropertyCard'
import Spinner from '@/components/Spinner'
import {ListedProperty} from '@/utilities/interfaces'
import {useGetBookmarkedPropertiesQuery} from '@/slices/propertiesApiSlice'
import BookmarkButton from '@/components/BookmarkButton'
const BookmarksPage: FunctionComponent = (): ReactElement | null => {
  const router: AppRouterInstance = useRouter()
  const {data: properties, isLoading, isError, error} = useGetBookmarkedPropertiesQuery()
  useEffect(
    (): void => {
      if (!isLoading) {
        if (isError) {
          toast.error(`Error retrieving bookmarked properties:\n${JSON.stringify(error)}`)
          router.push('/error')
        }
      }
    },
    [isError, error, router, isLoading]
  )
  return isLoading ? (
    <>
      <Helmet>
        <title>
          Loading... | PropertyPulse | Find the Perfect Rental
        </title>
      </Helmet>
      <Spinner loading={isLoading}/>
    </>
  ) : properties ? (
    <>
      <Helmet>
        <title>
          Bookmerked Properties | PropertyPulse | Find the Perfect Rental
        </title>
      </Helmet>
      <section className='px-4 py-6'>
        <h1 className='text-2xl mb-4'>
          Bookmarked properties
        </h1>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          {properties.length === 0 ? (
            <p>
              No bookmarked properties.
            </p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {properties.map((property: ListedProperty): ReactElement => (
                <div key={property._id?.toString()}>
                  <PropertyCard property={property}/>
                  <div className="py-1"/>
                  <BookmarkButton property={property}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  ) : null
}
export default BookmarksPage