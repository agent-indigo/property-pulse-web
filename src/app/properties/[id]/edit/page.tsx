import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import EditPropertyForm from '@/components/EditPropertyForm'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyDocumentModel from '@/models/propertyDocumentModel'
export const metadata: Metadata = {
  title: 'Edit Property'
}
const EditPropertyPage: FunctionComponent<any> = async ({params}): Promise<ReactElement> => {
  await connectToMongoDB()
  return (
    <section className='bg-blue-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <EditPropertyForm property={JSON.parse(JSON.stringify(await propertyDocumentModel.findById((await params).id).lean()))}/>
        </div>
      </div>
    </section>
  )
}
export default EditPropertyPage