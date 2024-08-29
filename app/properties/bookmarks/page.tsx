import {FunctionComponent, ReactElement} from 'react'
import {Metadata} from 'next'
import PropertyCard from '@/components/PropertyCard'
import getSessionUser from '@/serverActions/getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import BookmarkButton from '@/components/BookmarkButton'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PlainProperty from '@/interfaces/PlainProperty'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
export const metadata: Metadata = {
  title: 'Bookmarks'
}
const BookmarksPage: FunctionComponent = async (): Promise<ReactElement> => {
  await connectToMongoDB()
  const {sessionUser}: ServerActionResponse = await getSessionUser()
  const bookmarks: PlainProperty[] = []
  sessionUser && await Promise.all(sessionUser.bookmarks.map(async (bookmark: string): Promise<void> => {
    const property: PlainProperty = convertToPlainDocument(await propertyModel.findById(bookmark).lean())
    bookmarks.push(property)
  }))
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
            {bookmarks.map((
              property: PlainProperty
            ): ReactElement => (
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