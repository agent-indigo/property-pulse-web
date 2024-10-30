import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import EditPropertyForm from '@/components/EditPropertyForm'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
export const metadata: Metadata = {
  title: 'Edit Property'
}
const EditPropertyPage: FunctionComponent<Params> = async ({
  params
}): Promise<ReactElement> => {
  await connectToMongoDB()
  return (
    <section className='bg-blue-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <EditPropertyForm property={convertToPlainDocument(await propertyModel
            .findById(params.id)
            .lean()
          )}/>
        </div>
      </div>
    </section>
  )
}
export default EditPropertyPage