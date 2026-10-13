import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import Link from 'next/link'
import {FaArrowLeft} from 'react-icons/fa'
import PropertyHeaderImage from '@/src/library/components/PropertyHeaderImage'
import PropertyDetails from '@/src/library/components/PropertyDetails'
import PropertyImages from '@/src/library/components/PropertyImages'
import BookmarkButton from '@/src/library/components/BookmarkButton'
import ContactForm from '@/src/library/components/ContactForm'
import ShareButtons from '@/src/library/components/ShareButtons'
import connectToMongoDB from '@/src/library/utilities/connectToMongoDB'
import propertyDocumentModel from '@/src/library/models/propertyDocumentModel'
import PlainProperty from '@/src/library/types/PlainProperty'
export const metadata: Metadata = {
  title: 'Property Details'
}
const PropertyPage: FunctionComponent<any> = async ({params}): Promise<ReactElement> => {
  await connectToMongoDB()
  const property: PlainProperty = JSON.parse(JSON.stringify(await propertyDocumentModel.findById((await params).id).lean()))
  const {images}: PlainProperty = property
  return (
    <>
      <PropertyHeaderImage image={images[0]}/>
      <section>
        <div className='container m-auto py-6 px-6'>
          <Link
            href='/properties'
            className='text-blue-500 hover:text-blue-600 flex items-center'
          >
            <FaArrowLeft className='mr-2'/>
            Back to All Properties
          </Link>
        </div>
      </section>
      <section className='bg-blue-50'>
        <div className='container m-auto py-10 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
            <PropertyDetails property={property}/>
            <aside className='space-y-4'>
              <BookmarkButton property={property}/>
              <h3 className='text-xl font-bold text-center pt-2'>
                Share
              </h3>
              <div className='flex gap-3 justify-center pb-5'>
                <ShareButtons property={property}/>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-md'>
                <ContactForm property={property}/>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <section className='bg-blue-50 p-4'>
        <div className='container mx-auto'>
          <PropertyImages images={images}/>
        </div>
      </section>
    </>
  )
}
export default PropertyPage