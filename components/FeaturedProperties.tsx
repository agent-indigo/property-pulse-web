'use client'
import {FunctionComponent, ReactElement, useEffect} from 'react'
import {toast} from 'react-toastify'
import {ListedProperty} from '@/utilities/interfaces'
import {useGetFeaturedPropertiesQuery} from '@/slices/propertiesApiSlice'
import FeaturedPropertyCard from '@/components/FeaturedPropertyCard'
import Spinner from '@/components/Spinner'
const FeaturedProperties: FunctionComponent = (): ReactElement | null => {
  const {data: properties, isLoading, isError, error} = useGetFeaturedPropertiesQuery()
  useEffect(
    (): void => {
      if (!isLoading) isError && toast.error(`Error retrieving featured properties:\n${JSON.stringify(error)}`)
    },
    [isError, error, isLoading]
  )
  return isLoading ? <Spinner loading={isLoading}/> : !isError && properties && properties.length > 0 ? (
    <section className='bg-blue-50 px-4 pt-6 pb-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
          Featured Properties
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {properties.map((property: ListedProperty): ReactElement => (
            <FeaturedPropertyCard
              key={property._id?.toString()}
              property={property}
            />
          ))}
        </div>
      </div>
    </section>
  ) : null
}
export default FeaturedProperties