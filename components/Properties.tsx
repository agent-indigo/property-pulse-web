'use client'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {useRouter} from 'next/navigation'
import {toast} from 'react-toastify'
import {ListedProperty, PageNumber} from '@/utilities/interfaces'
import PropertyCard from '@/components/PropertyCard'
import Spinner from '@/components/Spinner'
import Paginator from '@/components/Paginator'
import FeaturedProperties from '@/components/FeaturedProperties'
import {useGetPropertiesQuery} from '@/slices/propertiesApiSlice'
const Properties: FunctionComponent<PageNumber> = ({pageNumber}): ReactElement => {
  const {data: response, isLoading, isError, error} = useGetPropertiesQuery(pageNumber)
  const properties: ListedProperty[] = response?.properties ?? []
  const total: number = response?.total ?? 0
  const [page, setPage] = useState<number>(pageNumber)
  const router: AppRouterInstance = useRouter()
  useEffect(
    (): void => {
      router.push(`/properties?page=${page}`)
      if (!isLoading) {
        if (isError) {
          toast.error(`Error retrieving properties:\n${JSON.stringify(error)}`)
          router.push('/error')
        }
      }
    },
    [isError, error, router, isLoading, page]
  )
  return isLoading ? <Spinner loading={isLoading}/> : (
    <>
      <FeaturedProperties/>
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          {properties?.length === 0 ? (
            <p>
              No properties currently available.
            </p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {properties?.map((property: ListedProperty): ReactElement => (
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
    </>
  )
}
export default Properties