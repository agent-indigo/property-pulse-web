import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import {FlattenMaps} from 'mongoose'
import SearchPropertiesForm from '@/components/SearchPropertiesForm'
import Properties from '@/components/Properties'
import propertyModel from '@/models/propertyModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import UrlSearchParams from '@/interfaces/UrlSearchParams'
import FeaturedProperties from '@/components/FeaturedProperties'
import PropertyDocument from '@/interfaces/PropertyDocument'
import PlainProperty from '@/interfaces/PlainProperty'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
export const metadata: Metadata = {
  title: 'Properties'
}
const PropertiesPage: FunctionComponent<UrlSearchParams> = async ({searchParams: {
  page = 1,
  size = 6
}}): Promise<ReactElement> => {
  await connectToMongoDB()
  const properties: PlainProperty[] = (await propertyModel.find().skip((
    parseInt(page.toString() ?? '1'
  ) - 1) * size).limit(size).lean()).map((
    property: FlattenMaps<PropertyDocument>
  ): PlainProperty => convertToPlainDocument(property))
  return (
    <>
      <section className='bg-blue-700 py-4'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
          <SearchPropertiesForm/>
        </div>
      </section>
      <FeaturedProperties/>
      <Properties
        properties={properties}
        total={await propertyModel.countDocuments()}
        page={page}
        size={size}
      />
    </>
  )
}
export default PropertiesPage