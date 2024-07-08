import Link from 'next/link'
import Image from 'next/image'
import {Key, ReactElement} from 'react'
import {FaBed, FaBath, FaRulerCombined, FaMoneyBill, FaMapMarker} from 'react-icons/fa'
import {ListedProperty} from '@/utilities/interfaces'
const PropertyCard: React.FC<ListedProperty> = (property: ListedProperty): ReactElement => {
  const getRateDisplay = (): string | undefined => {
    if (property.rates.monthly as number) {
      return `${property.rates.monthly?.toLocaleString() as string}/mo` as string
    } else if (property.rates.weekly as number) {
      return `${property.rates.weekly?.toLocaleString() as string}/wk` as string
    } else if (property.rates.nightly as number) {
      return `${property.rates.nightly?.toLocaleString() as string}/night` as string
    }
  }
  return (
    <div className='rounded-xl shadow-md relative'>
      <Image
        src={property.images[0 as number] as string}
        alt=''
        height={0 as number}
        width={0 as number}
        sizes='100vw'
        className='w-full h-auto rounded-t-xl'
      />
      <div className='p-4'>
        <div className='text-left md:text-center lg:text-left mb-6'>
          <div className='text-gray-600'>{property.type as string}</div>
          <h3 className='text-xl font-bold'>{property.name as string}</h3>
        </div>
        <h3 className='absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right'>
          ${getRateDisplay() as string}
        </h3>
        <div className='flex justify-center gap-4 text-gray-500 mb-4'>
          <p>
            <FaBed className='inline mr-2'/>{property.beds as number}
            <span className='md:hidden lg:inline'> Beds</span>
          </p>
          <p>
            <FaBath className='inline mr-2'/>{property.baths as number}
            <span className='md:hidden lg:inline'> Baths</span>
          </p>
          <p>
            <FaRulerCombined className='inline mr-2'/>{property.square_feet as number}
            <span className='md:hidden lg:inline'> sqft</span>
          </p>
        </div>
        <div className='flex justify-center gap-4 text-green-900 text-sm mb-4'>
            <p>
              <FaMoneyBill className='inline mr-2'/>
              {property.rates.nightly as number && ' Nightly' as string}
              {property.rates.weekly as number && ' Weekly' as string}
              {property.rates.monthly as number && ' Monthly' as string}
            </p>
        </div>
        <div className='border border-gray-100 mb-5'/>
        <div className='flex flex-col lg:flex-row justify-between mb-4'>
          <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
            <FaMapMarker className='text-orange-700 mt-1'/>
            <span className='text-orange-700'>{property.location.city as string}, {property.location.state as string}</span>
          </div>
          <Link
            href={`/properties/${property._id as Key | null | undefined}` as string}
            className='h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm'
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  ) as ReactElement
}
export default PropertyCard as React.FC<ListedProperty>