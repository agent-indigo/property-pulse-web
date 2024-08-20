'use client'
import Link from 'next/link'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {getProperties} from '@/utilities/requests'
import {GetPropertiesResponse, ListedProperty} from '@/utilities/interfaces'
import PropertyCard from '@/components/PropertyCard'
import FeaturedProperties from '@/components/FeaturedProperties'
import Spinner from './Spinner'
const HomeProperties: FunctionComponent = (): ReactElement => {
  const [properties, setProperties] = useState<ListedProperty[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(
    (): void => {
      const populate: Function = async (): Promise<void> => {
        const {properties}: GetPropertiesResponse = await getProperties()
        setProperties(properties)
        setLoading(false)
      }
      populate()
    },
    []
  )
  return loading ? <Spinner loading={loading}/> : (
    <>
      <FeaturedProperties/>
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto'>
          <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
            Recent Properties
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties.length === 0 ? (
              <p>
                None found...
              </p>
            ) : (
              properties.sort((): number => Math.random() - Math.random()).slice(
                0,
                3
              ).map((property: ListedProperty) => (
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
          href='/properties'
          className='block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700'
        >
          View All Properties
        </Link>
      </section>
    </>
  )
}
export default HomeProperties