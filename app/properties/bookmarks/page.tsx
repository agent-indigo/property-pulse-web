import {FunctionComponent, ReactElement} from 'react'
import {Metadata} from 'next'
import {FlattenMaps} from 'mongoose'
import PropertyCard from '@/components/PropertyCard'
import getSessionUser from '@/utilities/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import {
  LeanDocumentId,
  ListedProperty,
  SerializedProperty
} from '@/utilities/interfaces'
import propertyModel from '@/models/propertyModel'
import serialize from '@/utilities/serialize'
import BookmarkButton from '@/components/BookmarkButton'
export const metadata: Metadata = {
  title: 'Bookmarks'
}
const BookmarksPage: FunctionComponent = async (): Promise<ReactElement> => {
  await connectToMongoDB()
  const bookmarks: SerializedProperty[] = ((
    await getSessionUser().bookmarks)
    .map((bookmark: string) => propertyModel
    .findById(bookmark)
    .lean()))
    .map((
      property: FlattenMaps<ListedProperty> & Required<LeanDocumentId>
    ) => serialize(property))
  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        <h1 className='text-2xl mb-4'>
          Bookmarked Properties
        </h1>
        {bookmarks.length === 0 ? (
          <p>You have not bookmarked any properties.</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {bookmarks.map((property: SerializedProperty) => (
              <div key={property._id}>
                <PropertyCard property={property}/>
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