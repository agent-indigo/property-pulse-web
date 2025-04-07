import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import {getServerSession} from 'next-auth'
import PropertyCard from '@/components/PropertyCard'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import BookmarkButton from '@/components/BookmarkButton'
import PlainProperty from '@/types/PlainProperty'
import userModel from '@/models/userModel'
export const metadata: Metadata = {
  title: 'Bookmarks'
}
const BookmarksPage: FunctionComponent = async (): Promise<ReactElement> => {
  await connectToMongoDB()
  const bookmarks: PlainProperty[] = JSON.parse(JSON.stringify(await propertyModel.find({
    _id: {
      $in: (await userModel.findOne({
        email: (await getServerSession())?.user?.email
      }))?.bookmarks
    }
  }).lean()))
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