import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import Link from 'next/link'
import {FaArrowCircleLeft} from 'react-icons/fa'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import UrlSearchParams from '@/interfaces/UrlSearchParams'
import PropertySearchQuery from '@/interfaces/PropertySearchQuery'
import propertyModel from '@/models/propertyModel'
import SearchPropertiesForm from '@/components/SearchPropertiesForm'
import PropertyCard from '@/components/PropertyCard'
import FeaturedProperties from '@/components/FeaturedProperties'
import Paginator from '@/components/Paginator'
import PlainProperty from '@/interfaces/PlainProperty'
export const metadata: Metadata = {
  title: 'Search Results'
}
const ResultsPage: FunctionComponent<UrlSearchParams> = async ({
  searchParams
}): Promise<ReactElement> => {
  const {
    location = '',
    type = 'All',
    page = 1,
    size = 6
  } = await searchParams
  await connectToMongoDB()
  const query: PropertySearchQuery = {}
  if (location !== '') {
    const locationPattern: RegExp = new RegExp(
      location,
      'i'
    )
    query.$or = [{
      name: locationPattern
    }, {
      description: locationPattern
    }, {
      'location.street': locationPattern
    }, {
      'location.city': locationPattern
    }, {
      'location.state': locationPattern
    }, {
      'location.zipcode': locationPattern
    }]
  }
  if (type !== 'All') query.type = new RegExp(
    type,
    'i'
  )
  const properties: PlainProperty[] = JSON.parse(JSON.stringify(await propertyModel
    .find(query)
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
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          <Link
            href='/properties'
            className='flex items-center text-blue-500 hover:underline mb-3'
          >
            <FaArrowCircleLeft className='mr-2 mb-1'/>
            Back to all Properties
          </Link>
          <h1 className='text-2xl mb-4'>
            Search Results
          </h1>
          {properties.length === 0 ? (
            <p>
              No results.
            </p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {properties.map((property: PlainProperty): ReactElement => (
                <PropertyCard
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          )}
          <Paginator
            page={page}
            size={size}
            total={properties.length}
            fromSearch={true}
          />
        </div>
      </section>
    </>
  )
}
export default ResultsPage