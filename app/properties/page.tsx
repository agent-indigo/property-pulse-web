import type {Metadata} from 'next'
import {ReactElement} from 'react'
import {getProperties} from '@/utilities/requests'
import {IProperty} from '@/utilities/interfaces'
import PropertyCard from '@/components/PropertyCard'
export const metadata: Metadata = {
  title: 'Properties'
}
const PropertiesPage: React.FC = async (): Promise<ReactElement> => {
  const properties: IProperty[] = await getProperties()
  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {properties.length === 0 ? (
          <p>None found...</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties.map((property: IProperty) => (
              <PropertyCard
                key={property._id}
                {...property}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
export default PropertiesPage