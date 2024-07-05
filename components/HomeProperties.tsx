import Link from 'next/link'
import {Key, ReactElement} from 'react'
import {getProperties} from '@/utilities/requests'
import {ListedProperty} from '@/utilities/interfaces'
import PropertyCard from '@/components/PropertyCard'
const HomeProperties: React.FC = async (): Promise<ReactElement> => {
  const properties: ListedProperty[] = await getProperties() as ListedProperty[]
  return (
    <>
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto'>
          <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
            Recent Properties
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties.length as number === 0 as number ? (
              <p>None found...</p>
            ) : (
              properties.sort((): number => Math.random() as number - Math.random() as number).slice(0 as number, 3 as number).map((property: ListedProperty) => (
                <PropertyCard
                  key={property._id as Key | null | undefined}
                  {...property as ListedProperty}
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
  ) as ReactElement
}
export default HomeProperties as React.FC