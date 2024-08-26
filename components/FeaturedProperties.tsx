import {FunctionComponent, ReactElement} from 'react'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import {SerializedProperty} from '@/utilities/interfaces'
import FeaturedPropertyCard from '@/components/FeaturedPropertyCard'
import serialize from '@/utilities/serialize'
const FeaturedProperties: FunctionComponent = async (): Promise<ReactElement | null> => {
  await connectToMongoDB()
  const featuredProperties: SerializedProperty[] = serialize(
    await propertyModel
    .find({is_featured: true})
    .lean()
  )
  return featuredProperties.length > 0 ? (
    <section className='bg-blue-50 px-4 pt-6 pb-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
          Featured Properties
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {featuredProperties.map((property: SerializedProperty) => (
            <FeaturedPropertyCard
              key={property._id}
              property={property}
            />
          ))}
        </div>
      </div>
    </section>
  ) : null
}
export default FeaturedProperties