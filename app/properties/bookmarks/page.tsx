import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import {FlattenMaps} from 'mongoose'
import PropertyCard from '@/components/PropertyCard'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import BookmarkButton from '@/components/BookmarkButton'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PlainProperty from '@/interfaces/PlainProperty'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
import PropertyDocument from '@/interfaces/PropertyDocument'
export const metadata: Metadata = {
  title: 'Bookmarks'
}
const BookmarksPage: FunctionComponent = async (): Promise<ReactElement> => {
  const {sessionUser}: ServerActionResponse = await getSessionUser()
  await connectToMongoDB()
  const bookmarks: PlainProperty[] = (await propertyModel.find({
    _id: {
      $in: sessionUser?.bookmarks
    }
  }).lean()).map((
    property: FlattenMaps<PropertyDocument>
  ): PlainProperty => convertToPlainDocument(property))
  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        <h1 className='text-2xl mb-4'>
          Bookmarked Properties
        </h1>
        {bookmarks.length === 0 ? (
          <p>
            You have not bookmarked any properties.
          </p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {bookmarks.map((property: PlainProperty): ReactElement => (
              <div key={property._id}>
                <PropertyCard property={property}/>
                <div className='my-2'/>
                <BookmarkButton property={property}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
export default BookmarksPage