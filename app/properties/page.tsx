import type {Metadata} from 'next'
import {FunctionComponent, ReactElement} from 'react'
import {getProperties} from '@/utilities/requests'
import {ListedProperty} from '@/utilities/interfaces'
import PropertyCard from '@/components/PropertyCard'
import SearchPropertiesForm from '@/components/SearchPropertiesForm'
export const metadata: Metadata = {
  title: 'Properties'
}
const PropertiesPage: FunctionComponent = async (): Promise<ReactElement> => {
  const properties: ListedProperty[] = await getProperties()
  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <SearchPropertiesForm/>
        </div>
      </section>
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          {properties.length === 0 ? (
            <p>
              No properties currently available.
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
    </>
  )
}
export default PropertiesPage