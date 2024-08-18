import Link from 'next/link'
import {FunctionComponent, ReactElement} from 'react'
import {getProperties} from '@/utilities/requests'
import {ListedProperty} from '@/utilities/interfaces'
import PropertyCard from '@/components/PropertyCard'
const HomeProperties: FunctionComponent = async (): Promise<ReactElement> => {
  const properties: ListedProperty[] = await getProperties()
  return (
    <>
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