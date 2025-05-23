import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import SearchPropertiesForm from '@/components/SearchPropertiesForm'
import Properties from '@/components/Properties'
import propertyDocumentModel from '@/models/propertyDocumentModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import FeaturedProperties from '@/components/FeaturedProperties'
import PlainProperty from '@/types/PlainProperty'
export const metadata: Metadata = {
  title: 'Properties'
}
const PropertiesPage: FunctionComponent<any> = async ({searchParams}): Promise<ReactElement> => {
  const {
    page = 1,
    size = 6
  } = await searchParams
  await connectToMongoDB()
  const properties: PlainProperty[] = JSON.parse(JSON.stringify(await propertyDocumentModel
    .find()
    .skip((parseInt(page.toString() ?? '1') - 1) * size)
    .limit(size)
    .lean()
  ))
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
        total={await propertyDocumentModel.countDocuments()}
        page={page}
        size={size}
      />
    </>
  )
}
export default PropertiesPage