import {FunctionComponent, ReactElement} from 'react'
import {ListedProperty} from '@/utilities/interfaces'
import {getFeaturedProperties} from '@/utilities/requests'
import FeaturedPropertyCard from '@/components/FeaturedPropertyCard'
const FeaturedProperties: FunctionComponent = async (): Promise<ReactElement | null> => {
  const properties: ListedProperty[] = await getFeaturedProperties()
  return properties.length > 0 ? (
    <section className='bg-blue-50 px-4 pt-6 pb-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
          Featured Properties
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {properties.map((property: ListedProperty) => (
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