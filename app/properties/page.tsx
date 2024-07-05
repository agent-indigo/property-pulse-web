import type {Metadata} from 'next'
import {Key, ReactElement} from 'react'
import {getProperties} from '@/utilities/requests'
import {ListedProperty} from '@/utilities/interfaces'
import PropertyCard from '@/components/PropertyCard'
export const metadata: Metadata = {
  title: 'Properties' as string
} as Metadata
const PropertiesPage: React.FC = async (): Promise<ReactElement> => {
  const properties: ListedProperty[] = await getProperties() as ListedProperty[]
  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {properties.length as number === 0 as number ? (
          <p>None found...</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties.map((property: ListedProperty) => (
              <PropertyCard
                key={property._id as Key | null | undefined}
                {...property as ListedProperty}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  ) as ReactElement
}
export default PropertiesPage as React.FC