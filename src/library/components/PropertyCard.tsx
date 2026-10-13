import Link from 'next/link'
import Image from 'next/image'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarker
} from 'react-icons/fa'
import getRateDisplay from '@/utilities/getRateDisplay'
import PropertyLocation from '@/types/PropertyLocation'
import PropertyRates from '@/types/PropertyRates'
import DestructuredProperty from '@/types/DestructuredProperty'
import PlainProperty from '@/types/PlainProperty'
const PropertyCard: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {
    _id,
    images,
    name,
    type,
    rates,
    beds,
    baths,
    square_feet,
    location,
  }: PlainProperty = property
  const {
    nightly,
    weekly,
    monthly
  }: PropertyRates = rates
  const {
    city,
    state
  }: PropertyLocation = location
  return (
    <div className='rounded-xl shadow-md relative'>
      <Image
        src={images[0]}
        alt=''
        height={0}
        width={0}
        sizes='100vw'
        className='w-full h-auto rounded-t-xl'
      />
      <div className='p-4'>
        <div className='text-left md:text-center lg:text-left mb-6'>
          <div className='text-gray-600'>
            {type}
          </div>
          <h3 className='text-xl font-bold'>
            {name}
          </h3>
        </div>
        <h3 className='absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right'>
          ${getRateDisplay(rates)}
        </h3>
        <div className='flex justify-center gap-4 text-gray-500 mb-4'>
          <p>
            <FaBed className='inline mr-2'/>
            {beds}
            <span className='md:hidden lg:inline'> Beds</span>
          </p>
          <p>
            <FaBath className='inline mr-2'/>
            {baths}
            <span className='md:hidden lg:inline'> Baths</span>
          </p>
          <p>
            <FaRulerCombined className='inline mr-2'/>
            {square_feet}
            <span className='md:hidden lg:inline'> sqft</span>
          </p>
        </div>
        <div className='flex justify-center gap-4 text-green-900 text-sm mb-4'>
            <p>
              <FaMoneyBill className='inline mr-2'/>
              {nightly && `$${nightly.toLocaleString()} Nightly${weekly && ' '}`}
              {weekly && `$${weekly.toLocaleString()} Weekly${monthly && ' '}`}
              {monthly && `$${monthly.toLocaleString()} Monthly`}
            </p>
        </div>
        <div className='border border-gray-100 mb-5'/>
        <div className='flex flex-col lg:flex-row justify-between mb-4'>
          <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
            <FaMapMarker className='text-orange-700 mt-1'/>
            <span className='text-orange-700'>
              {city}, {state}
            </span>
          </div>
          <Link
            href={`/properties/${_id}`}
            className='h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm'
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
export default PropertyCard