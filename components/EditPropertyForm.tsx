'use client'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {useRouter} from 'next/navigation'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {toast} from 'react-toastify'
import editProperty from '@/serverActions/editProperty'
import SubmitButton from '@/components/SubmitButton'
import DestructuredProperty from '@/interfaces/DestructuredProperty'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PlainProperty from '@/interfaces/PlainProperty'
import PropertyLocation from '@/interfaces/PropertyLocation'
import PropertyRates from '@/interfaces/PropertyRates'
import PropertyContact from '@/interfaces/PropertyContact'
const EditPropertyForm: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {
    _id,
    name,
    type,
    rates,
    beds,
    baths,
    square_feet,
    location,
    description,
    seller_info,
    amenities
  }: PlainProperty = property
  const {
    nightly,
    weekly,
    monthly
  }: PropertyRates = rates
  const {
    city,
    state,
    street,
    zipcode
  }: PropertyLocation = location
  const {
    name: sellerName,
    email,
    phone
  }: PropertyContact = seller_info
  const router: AppRouterInstance = useRouter()
  const handleSubmit: Function = async (form: FormData): Promise<void> => {
    const {
      error,
      message,
      success
    }: ServerActionResponse = await editProperty(
      _id,
      form
    )
    if (success) {
      toast.success(message)
      router.push(`/properties/${_id}`)
    } else {
      toast.error(`Error saving changes:\n${error}`)
    }
  }
  return (
    <form action={handleSubmit.bind(null)}>
      <h2 className='text-3xl text-center font-semibold mb-6'>
        Edit Property
      </h2>
      <div className='mb-4'>
        <label
          htmlFor='type'
          className='block text-gray-700 font-bold mb-2'
        >
          Property Type
        </label>
        <select
          id='type'
          name='type'
          className='border rounded w-full py-2 px-3'
          required
          defaultValue={type}
        >
          <option defaultValue='Apartment'>
            Apartment
          </option>
          <option defaultValue='Condo'>
            Condo
          </option>
          <option defaultValue='House'>
            House
          </option>
          <option defaultValue='Cabin Or Cottage'>
            Cabin or Cottage
          </option>
          <option defaultValue='Room'>
            Room
          </option>
          <option defaultValue='Studio'>
            Studio
          </option>
          <option defaultValue='Other'>
            Other
          </option>
        </select>
      </div>
      <div className='mb-4'>
        <label
          htmlFor='name'
          className='block text-gray-700 font-bold mb-2'
        >
          Listing Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='eg. Beautiful Apartment In Miami'
          required
          defaultValue={name}
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='description'
          className='block text-gray-700 font-bold mb-2'
        >
          Description
        </label>
        <textarea
          id='description'
          name='description'
          className='border rounded w-full py-2 px-3'
          rows={4}
          placeholder='Add an optional description of your property'
          defaultValue={description}
        />
      </div>
      <div className='mb-4 bg-blue-50 p-4'>
        <label
          htmlFor='location'
          className='block text-gray-700 font-bold mb-2'
        >
          Location
        </label>
        <input
          type='text'
          id='street'
          name='location.street'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Street'
          defaultValue={street}
        />
        <input
          type='text'
          id='city'
          name='location.city'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='City'
          required
          defaultValue={city}
        />
        <input
          type='text'
          id='state'
          name='location.state'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='State'
          required
          defaultValue={state}
        />
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Zipcode'
          defaultValue={zipcode}
        />
      </div>
      <div className='mb-4 flex flex-wrap'>
        <div className='w-full sm:w-1/3 pr-2'>
          <label
            htmlFor='beds'
            className='block text-gray-700 font-bold mb-2'
          >
            Beds
          </label>
          <input
            type='number'
            id='beds'
            name='beds'
            className='border rounded w-full py-2 px-3'
            required
            defaultValue={beds}
          />
        </div>
        <div className='w-full sm:w-1/3 px-2'>
          <label
            htmlFor='baths'
            className='block text-gray-700 font-bold mb-2'
          >
            Baths
          </label>
          <input
            type='number'
            id='baths'
            name='baths'
            className='border rounded w-full py-2 px-3'
            required
            defaultValue={baths}
          />
        </div>
        <div className='w-full sm:w-1/3 pl-2'>
          <label
            htmlFor='square_feet'
            className='block text-gray-700 font-bold mb-2'
          >
            Square Feet
          </label>
          <input
            type='number'
            id='square_feet'
            name='square_feet'
            className='border rounded w-full py-2 px-3'
            required
            defaultValue={square_feet}
          />
        </div>
      </div>
      <div className='mb-4'>
        <label
          htmlFor='amenities'
          className='block text-gray-700 font-bold mb-2'
        >
          Amenities
        </label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          <div>
            <input
              type='checkbox'
              id='amenity_wifi'
              name='amenities'
              defaultValue='Wifi'
              className='mr-2'
              defaultChecked={amenities.includes('Wifi')}
            />
            <label htmlFor='amenity_wifi'>
              Wifi
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_kitchen'
              name='amenities'
              defaultValue='Full Kitchen'
              className='mr-2'
              defaultChecked={amenities.includes('Full Kitchen')}
            />
            <label htmlFor='amenity_kitchen'>
              Full kitchen
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_washer_dryer'
              name='amenities'
              defaultValue='Washer & Dryer'
              className='mr-2'
              defaultChecked={amenities.includes('Washer & Dryer')}
            />
            <label htmlFor='amenity_washer_dryer'>
              Washer & Dryer
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_free_parking'
              name='amenities'
              defaultValue='Free Parking'
              className='mr-2'
              defaultChecked={amenities.includes('Free Parking')}
            />
            <label htmlFor='amenity_free_parking'>
              Free Parking
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_pool'
              name='amenities'
              defaultValue='Swimming Pool'
              className='mr-2'
              defaultChecked={amenities.includes('Swimming Pool')}
            />
            <label htmlFor='amenity_pool'>
              Swimming Pool
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_hot_tub'
              name='amenities'
              defaultValue='Hot Tub'
              className='mr-2'
              defaultChecked={amenities.includes('Hot Tub')}
            />
            <label htmlFor='amenity_hot_tub'>
              Hot Tub
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_24_7_security'
              name='amenities'
              defaultValue='24/7 Security'
              className='mr-2'
              defaultChecked={amenities.includes('24/7 Security')}
            />
            <label htmlFor='amenity_24_7_security'>
              24/7 Security
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_wheelchair_accessible'
              name='amenities'
              defaultValue='Wheelchair Accessible'
              className='mr-2'
              defaultChecked={amenities.includes('Wheelchair Accessible')}
            />
            <label htmlFor='amenity_wheelchair_accessible'>
              Wheelchair Accessible
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_elevator_access'
              name='amenities'
              defaultValue='Elevator Access'
              className='mr-2'
              defaultChecked={amenities.includes('Elevator Access')}
            />
            <label htmlFor='amenity_elevator_access'>
              Elevator Access
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_dishwasher'
              name='amenities'
              defaultValue='Dishwasher'
              className='mr-2'
              defaultChecked={amenities.includes('Dishwasher')}
            />
            <label htmlFor='amenity_dishwasher'>
              Dishwasher
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_gym_fitness_center'
              name='amenities'
              defaultValue='Gym/Fitness Center'
              className='mr-2'
              defaultChecked={amenities.includes('Gym/Fitness Center')}
            />
            <label htmlFor='amenity_gym_fitness_center'>
              Gym/Fitness Center
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_air_conditioning'
              name='amenities'
              defaultValue='Air Conditioning'
              className='mr-2'
              defaultChecked={amenities.includes('Air Conditioning')}
            />
            <label htmlFor='amenity_air_conditioning'>
              Air Conditioning
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_balcony_patio'
              name='amenities'
              defaultValue='Balcony/Patio'
              className='mr-2'
              defaultChecked={amenities.includes('Balcony/Patio')}
            />
            <label htmlFor='amenity_balcony_patio'>
              Balcony/Patio
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_smart_tv'
              name='amenities'
              defaultValue='Smart TV'
              className='mr-2'
              defaultChecked={amenities.includes('Smart TV')}
            />
            <label htmlFor='amenity_smart_tv'>
              Smart TV
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_coffee_maker'
              name='amenities'
              defaultValue='Coffee Maker'
              className='mr-2'
              defaultChecked={amenities.includes('Coffee Maker')}
            />
            <label htmlFor='amenity_coffee_maker'>
              Coffee Maker
            </label>
          </div>
        </div>
      </div>
      <div className='mb-4 bg-blue-50 p-4'>
        <label
          htmlFor='rates'
          className='block text-gray-700 font-bold mb-2'
        >
          Rates (Leave blank if not applicable)
        </label>
        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          <div className='flex items-center'>
            <label
              htmlFor='weekly_rate'
              className='mr-2'
            >
              Weekly
            </label>
            <input
              type='number'
              id='weekly_rate'
              name='rates.weekly'
              className='border rounded w-full py-2 px-3'
              defaultValue={weekly}
            />
          </div>
          <div className='flex items-center'>
            <label
              htmlFor='monthly_rate'
              className='mr-2'
            >
              Monthly
            </label>
            <input
              type='number'
              id='monthly_rate'
              name='rates.monthly'
              className='border rounded w-full py-2 px-3'
              defaultValue={monthly}
            />
          </div>
          <div className='flex items-center'>
            <label
              htmlFor='nightly_rate'
              className='mr-2'
            >
              Nightly
            </label>
            <input
              type='number'
              id='nightly_rate'
              name='rates.nightly'
              className='border rounded w-full py-2 px-3'
              defaultValue={nightly}
            />
          </div>
        </div>
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_name'
          className='block text-gray-700 font-bold mb-2'
        >
          Seller Name
        </label>
        <input
          type='text'
          id='seller_name'
          name='seller_info.name'
          className='border rounded w-full py-2 px-3'
          placeholder='Name'
          defaultValue={sellerName}
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_email'
          className='block text-gray-700 font-bold mb-2'
        >
          Seller Email
        </label>
        <input
          type='email'
          id='seller_email'
          name='seller_info.email'
          className='border rounded w-full py-2 px-3'
          placeholder='Email address'
          required
          defaultValue={email}
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_phone'
          className='block text-gray-700 font-bold mb-2'
        >
          Seller Phone
        </label>
        <input
          type='tel'
          id='seller_phone'
          name='seller_info.phone'
          className='border rounded w-full py-2 px-3'
          placeholder='Phone'
          defaultValue={phone}
        />
      </div>
      <div>
        <SubmitButton
          message='Saving changes...'
          action='Save Changes'
        />
      </div>
    </form>
  )
}
export default EditPropertyForm