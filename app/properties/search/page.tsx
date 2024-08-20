'use client'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {ReadonlyURLSearchParams, useRouter, useSearchParams} from 'next/navigation'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import Link from 'next/link'
import {FaArrowAltCircleLeft} from 'react-icons/fa'
import PropertyCard from '@/components/PropertyCard'
import SearchPropertiesForm from '@/components/SearchPropertiesForm'
import Spinner from '@/components/Spinner'
import {ListedProperty} from '@/utilities/interfaces'
import {getPropertySearchResults} from '@/utilities/requests'
import FeaturedProperties from '@/components/FeaturedProperties'
const SearchResultsPage: FunctionComponent = (): ReactElement => {
  const router: AppRouterInstance = useRouter()
  const searchParams: ReadonlyURLSearchParams = useSearchParams()
  const location: string | null = searchParams.get('location')
  const propertyType: string | null = searchParams.get('type')
  const [properties, setProperties] = useState<ListedProperty[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(
    (): void => {
      const getResults: Function = async (): Promise<void> => {
        setProperties(await getPropertySearchResults(
          location ?? '',
          propertyType ?? 'All'
        ))
        setLoading(false)
      }
      document.title = `${loading ? 'Loading...' : 'Search Results'} | PropertyPulse | Find the Perfect Rental`
      location || propertyType ? getResults() : router.push('/properties')
    },
    [location, propertyType, loading, router]
  )
  return (
    <>
      <section className='bg-blue-700 py-4'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
          <SearchPropertiesForm/>
        </div>
      </section>
      <FeaturedProperties/>
      {loading ? <Spinner loading={loading}/> : (
        <section className='px-4 py-6'>
          <div className='container-xl lg:container m-auto px-4 py-6'>
            <Link
              href='/properties'
              className='flex items-center text-blue-500 hover:underline mb-3'
            >
              <FaArrowAltCircleLeft className='mr-2 mb-1'/> All Properties
            </Link>
            <h1 className='text-2xl mb-4'>
              Search Results
            </h1>
            {properties.length === 0 ? (
              <p>
                No currently available properties match your search criteria.
              </p>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {properties.map((property: ListedProperty) => (
                  <PropertyCard
                    key={property._id?.toString()}
                    property={property}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
export default SearchResultsPage