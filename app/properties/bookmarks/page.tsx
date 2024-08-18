'use client'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import PropertyCard from '@/components/PropertyCard'
import Spinner from '@/components/Spinner'
import {ListedProperty} from '@/utilities/interfaces'
import {getBookmarks} from '@/utilities/requests'
const BookmarksPage: FunctionComponent = (): ReactElement => {
  const [properties, setProperties] = useState<ListedProperty[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(
    (): void => {
      const setBookmarks: Function = async (): Promise<void> => setProperties(await getBookmarks())
      setBookmarks()
      setLoading(false)
      document.title = 'Boormarked Properties | PropertyPulse | Find the Perfect Rental'
    },
    []
  )
  return loading ? <Spinner loading={loading}/> : (
    <section className='px-4 py-6'>
      <h1 className="text-2xl mb-4">
        Bookmarked properties
      </h1>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {properties.length === 0 ? (
          <p>
            No bookmarked properties.
          </p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties.map((property: ListedProperty) => (
              <PropertyCard
                key={property._id?.toString()}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
export default BookmarksPage