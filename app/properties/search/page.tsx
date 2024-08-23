'use client'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {ReadonlyURLSearchParams, useRouter, useSearchParams} from 'next/navigation'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import Link from 'next/link'
import {toast} from 'react-toastify'
import {Helmet} from 'react-helmet'
import {FaArrowAltCircleLeft} from 'react-icons/fa'
import PropertyCard from '@/components/PropertyCard'
import SearchPropertiesForm from '@/components/SearchPropertiesForm'
import Spinner from '@/components/Spinner'
import {ListedProperty} from '@/utilities/interfaces'
import FeaturedProperties from '@/components/FeaturedProperties'
import Paginator from '@/components/Paginator'
import {useGetPropertySearchResultsQuery} from '@/slices/propertiesApiSlice'
const SearchResultsPage: FunctionComponent = (): ReactElement => {
  const router: AppRouterInstance = useRouter()
  const searchParams: ReadonlyURLSearchParams = useSearchParams()
  const location: string = searchParams.get('location') ?? ''
  const type: string = searchParams.get('type') ?? ''
  const [page, setPage] = useState<number>(Number.parseInt(searchParams.get('page') ?? '1'))
  const {data: response, isLoading, isError, error} = useGetPropertySearchResultsQuery({
    location,
    type,
    page
  })
  const properties: ListedProperty[] = response?.properties ?? []
  const total: number = response?.total ?? 0
  useEffect(
    (): void => {
      if (!isLoading) {
        if (isError) {
          toast.error(`Error retrieving search results:\n${JSON.stringify(error)}`)
          router.push('/error')
        }
      }
    },
    [isError, error, router, isLoading]
  )
  return (
    <>
      <Helmet>
        <title>
          {isLoading ? 'Loading...' : 'Search Results'} | PropertyPulse | Find the Perfect Rental
        </title>
      </Helmet>
      <section className='bg-blue-700 py-4'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
          <SearchPropertiesForm/>
        </div>
      </section>
      <FeaturedProperties/>
      {isLoading ? <Spinner loading={isLoading}/> : (
        <section className='px-4 py-6'>
          <div className='container-xl lg:container m-auto px-4 py-6'>
            <Link
              href='/properties?page=1'
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
                {properties.map((property: ListedProperty): ReactElement => (
                  <PropertyCard
                    key={property._id?.toString()}
                    property={property}
                  />
                ))}
              </div>
            )}
            <Paginator
              page={page}
              total={total}
              paginate={(to: number): void => setPage(to)}
            />
          </div>
        </section>
      )}
    </>
  )
}
export default SearchResultsPage