'use client'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {ReadonlyURLSearchParams, useSearchParams} from 'next/navigation'
import Link from 'next/link'
import {FaArrowAltCircleLeft} from 'react-icons/fa'
import PropertyCard from '@/components/PropertyCard'
import SearchPropertiesForm from '@/components/SearchPropertiesForm'
import Spinner from '@/components/Spinner'
import {ListedProperty} from '@/utilities/interfaces'
import {getPropertySearchResults} from '@/utilities/requests'
const SearchResultsPage: FunctionComponent = (): ReactElement => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()
  const location: string | null = searchParams.get('location')
  const propertyType: string | null = searchParams.get('location')
  const [properties, setProperties] = useState<ListedProperty[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(
    (): void => {
      const getResults: Function = async (): Promise<void> => setProperties(await getPropertySearchResults(
        location,
        propertyType
      ))
      if (location && propertyType) {
        getResults()
        setLoading(false)
        document.title = 'Search Results | PropertyPulse | Find the Perfect Rental'
      }
    },
    [location, propertyType]
  )
  return (
    <>
      <section className='bg-blue-700 py-4'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
          <SearchPropertiesForm/>
        </div>
      </section>
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