import {FunctionComponent, ReactElement} from 'react'
import {FlattenMaps} from 'mongoose'
import Link from 'next/link'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import PropertyCard from '@/components/PropertyCard'
import {LeanDocumentId, ListedProperty, SerializedProperty} from '@/utilities/interfaces'
import serialize from '@/utilities/serialize'
const HomeProperties: FunctionComponent = async (): Promise<ReactElement> => {
  await connectToMongoDB()
  const recents: (FlattenMaps<ListedProperty> & Required<LeanDocumentId>)[] = await propertyModel.find().sort({createdAt: -1}).limit(3).lean()
  const properties: SerializedProperty[] = recents.map((property: FlattenMaps<ListedProperty> & Required<LeanDocumentId>) => serialize(property))
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
                No current properties.
              </p>
            ) : (properties.map((property: SerializedProperty) => (
              <PropertyCard
                key={property._id}
                property={property}
              />
            )))}
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