'use client'
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  FunctionComponent,
  ReactElement,
  useEffect,
  useState
} from 'react'
import {toast} from 'react-toastify'
import {useRouter} from 'next/navigation'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import editProperty from '@/serverActions/editProperty'
import SubmitButton from '@/components/SubmitButton'
import DestructuredProperty from '@/interfaces/DestructuredProperty'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PropertyUpdate from '@/interfaces/PropertyUpdate'
import FormInput from '@/interfaces/FormInput'
import FormCheckBox from '@/interfaces/FormCheckBox'
const EditPropertyForm: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const router: AppRouterInstance = useRouter()
  const [fields, setFields] = useState<PropertyUpdate>({
    name: '',
    type: '',
    description: '',
    location: {
      street: '',
      city: '',
      state: '',
      zipcode: ''
    },
    beds: 0,
    baths: 0,
    square_feet: 0,
    amenities: [],
    rates: {},
    seller_info: {
      name: '',
      email: '',
      phone: ''
    }
  })
  const handleInput: ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement> = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const {name, value}: FormInput = event.target
    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.')
      setFields((previousValues: PropertyUpdate): PropertyUpdate => ({
        ...previousValues,
        [outerKey]: {
          ...previousValues[outerKey as keyof PropertyUpdate] as object,
          [innerKey]: value
        }
      }))
    } else {
      setFields((previousValues: PropertyUpdate): PropertyUpdate => ({
        ...previousValues,
        [name]: value
      }))
    }
  }
  const handleCheckBox: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const {value, checked}: FormCheckBox = event.target
    const amenities: string[] = [...fields.amenities]
    if (checked) {
      amenities.push(value)
    } else {
      const index: number = amenities.indexOf(value)
      index !== -1 && amenities.splice(index, 1)
    }
    setFields((previousValues: PropertyUpdate): PropertyUpdate => ({
      ...previousValues,
      amenities
    }))
  }
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    const {error, message, success}: ServerActionResponse = await editProperty(property._id, fields)
    if (success) {
      toast.success(message)
      router.push(`/properties/${property._id}`)
    } else {
      toast.error(`Error saving changes:\n${error}`)
    }
  }
  useEffect(
    (): void => setFields(property),
    [property]
  )
  return (
    <form onSubmit={handleSubmit}>
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
          value={fields.type}
          onChange={handleInput}
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
          value={fields.name}
          onChange={handleInput}
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
          value={fields.description}
          onChange={handleInput}
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
          value={fields.location.street}
          onChange={handleInput}
        />
        <input
          type='text'
          id='city'
          name='location.city'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='City'
          required
          value={fields.location.city}
          onChange={handleInput}
        />
        <input
          type='text'
          id='state'
          name='location.state'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='State'
          required
          value={fields.location.state}
          onChange={handleInput}
        />
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Zipcode'
          value={fields.location.zipcode}
          onChange={handleInput}
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
            value={fields.beds}
            onChange={handleInput}
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
            value={fields.baths}
            onChange={handleInput}
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
            value={fields.square_feet}
            onChange={handleInput}
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
              checked={fields.amenities.includes('Wifi')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Full Kitchen')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Washer & Dryer')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Free Parking')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Swimming Pool')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Hot Tub')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('24/7 Security')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Wheelchair Accessible')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Elevator Access')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Dishwasher')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Gym/Fitness Center')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Air Conditioning')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Balcony/Patio')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Smart TV')}
              onChange={handleCheckBox}
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
              checked={fields.amenities.includes('Coffee Maker')}
              onChange={handleCheckBox}
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
              value={fields.rates.weekly}
              onChange={handleInput}
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
              value={fields.rates.monthly}
              onChange={handleInput}
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
              value={fields.rates.nightly}
              onChange={handleInput}
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
          value={fields.seller_info.name}
          onChange={handleInput}
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
          value={fields.seller_info.email}
          onChange={handleInput}
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
          value={fields.seller_info.phone}
          onChange={handleInput}
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