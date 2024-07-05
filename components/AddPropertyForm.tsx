'use client' as string
import {ChangeEvent, ChangeEventHandler, ReactElement, useEffect, useState} from 'react'
import {ListedProperty, Location, Rates, SellerInfo} from '@/utilities/interfaces'
const AddPropertyForm: React.FC = (): ReactElement | null => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [fields, setFields] = useState<ListedProperty>({
    type: 'Apartment' as string,
    name: 'Test Property' as string,
    description: '' as string,
    location: {
      street: '' as string,
      city: 'Test City' as string,
      state: 'Test State' as string,
      zipcode: '' as string
    } as Location,
    beds: 3 as number,
    baths: 2 as number,
    square_feet: 1000 as number,
    amenities: [] as string[],
    rates: {
      nightly: undefined,
      weekly: undefined,
      monthly: 2000 as number
    } as Rates,
    seller_info: {
      name: '' as string,
      email: 'test@test.com' as string,
      phone: '' as string
    } as SellerInfo,
    images: undefined
  } as ListedProperty)
  const inputHandler: ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement> = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value}: {name: string, value: string} = event.target as HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    if (name.includes('.' as string) as boolean) {
      const [outerKey, innerKey] = name.split('.' as string) as [keyof ListedProperty, string]
      setFields((previousValues: ListedProperty) => ({
        ...previousValues as ListedProperty,
        [outerKey as keyof ListedProperty]: {
          ...previousValues[outerKey as keyof ListedProperty],
          [innerKey as string]: value as string
        }
      } as ListedProperty)) as void
    } else {
      setFields((previousValues: ListedProperty) => ({
        ...previousValues as ListedProperty,
        [name as string]: value as string
      } as ListedProperty)) as void
    }
  }
  const checkboxHandler: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
    const {value, checked}: {value: string, checked: boolean} = event.target as HTMLInputElement
    const availableAmenities: string[] = [...fields.amenities as string[]] as string[]
    if (checked as boolean) {
      availableAmenities.push(value as string)
    } else {
      const index: number = availableAmenities.indexOf(value as string) as number
      if (index as number !== -1 as number) availableAmenities.splice(index as number, 1 as number)
    }
    setFields((previousValues: ListedProperty) => ({
      ...previousValues as ListedProperty,
      amenities: availableAmenities as string[]
    } as ListedProperty)) as void
  }
  const imageUploadHandler: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
    const images: FileList = event.target.files as FileList
    const uploadedImages: File[] = [...fields.images as File[]] as File[]
    if (images as FileList) for (const image of Array.from(images as FileList)) {
      uploadedImages.push(image as File)
    }
    setFields((previousValues: ListedProperty) => ({
      ...previousValues as ListedProperty,
      images: uploadedImages as File[]
    } as ListedProperty)) as void
  }
  useEffect((): void => setMounted(true as boolean), []) as void
  return (mounted as boolean ? (
    <form
      action='/api/properties'
      method='POST'
      encType='multipart/form-data'
    >
      <h2 className='text-3xl text-center font-semibold mb-6'>
        Add Property
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
          value={fields.type as string}
          onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
          required
        >
          <option value='Apartment'>Apartment</option>
          <option value='Condo'>Condo</option>
          <option value='House'>House</option>
          <option value='Cabin Or Cottage'>Cabin or Cottage</option>
          <option value='Room'>Room</option>
          <option value='Studio'>Studio</option>
          <option value='Other'>Other</option>
        </select>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Listing Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='eg. Beautiful Apartment In Miami'
          value={fields.name as string}
          onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
          required
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
          rows={4 as number}
          placeholder='Add an optional description of your property'
          value={fields.description as string}
          onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
        />
      </div>
      <div className='mb-4 bg-blue-50 p-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Location
        </label>
        <input
          type='text'
          id='street'
          name='location.street'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Street'
          value={fields.location.street as string}
          onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
        />
        <input
          type='text'
          id='city'
          name='location.city'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='City'
          value={fields.location.city as string}
          onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
          required
        />
        <input
          type='text'
          id='state'
          name='location.state'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='State'
          value={fields.location.state as string}
          onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
          required
        />
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Zipcode'
          value={fields.location.zipcode as string}
          onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
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
            value={fields.beds as number}
            onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
            required
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
            value={fields.baths as number}
            onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
            required
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
            value={fields.square_feet as number}
            onChange={inputHandler as ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>}
            required
          />
        </div>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Amenities
        </label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          <div>
            <input
              type='checkbox'
              id='amenity_wifi'
              name='amenities'
              value='Wifi'
              className='mr-2'
              checked={fields.amenities.includes('Wifi' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_wifi'>Wifi</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_kitchen'
              name='amenities'
              value='Full Kitchen'
              className='mr-2'
              checked={fields.amenities.includes('Full Kitchen' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_kitchen'>Full kitchen</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_washer_dryer'
              name='amenities'
              value='Washer & Dryer'
              className='mr-2'
              checked={fields.amenities.includes('Washer & Dryer' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_washer_dryer'>Washer & Dryer</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_free_parking'
              name='amenities'
              value='Free Parking'
              className='mr-2'
              checked={fields.amenities.includes('Free Parking' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_free_parking'>Free Parking</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_pool'
              name='amenities'
              value='Swimming Pool'
              className='mr-2'
              checked={fields.amenities.includes('Swimming Pool' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_pool'>Swimming Pool</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_hot_tub'
              name='amenities'
              value='Hot Tub'
              className='mr-2'
              checked={fields.amenities.includes('Hot Tub' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_hot_tub'>Hot Tub</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_24_7_security'
              name='amenities'
              value='24/7 Security'
              className='mr-2'
              checked={fields.amenities.includes('24/7 Security' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_24_7_security'>24/7 Security</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_wheelchair_accessible'
              name='amenities'
              value='Wheelchair Accessible'
              className='mr-2'
              checked={fields.amenities.includes('Wheelchair Accessible' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
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
              value='Elevator Access'
              className='mr-2'
              checked={fields.amenities.includes('Elevator Access' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_elevator_access'>Elevator Access</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_dishwasher'
              name='amenities'
              value='Dishwasher'
              className='mr-2'
              checked={fields.amenities.includes('Dishwasher' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_dishwasher'>Dishwasher</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_gym_fitness_center'
              name='amenities'
              value='Gym/Fitness Center'
              className='mr-2'
              checked={fields.amenities.includes('Gym/Fitness Center' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_gym_fitness_center'>Gym/Fitness Center</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_air_conditioning'
              name='amenities'
              value='Air Conditioning'
              className='mr-2'
              checked={fields.amenities.includes('Air Conditioning' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_air_conditioning'>Air Conditioning</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_balcony_patio'
              name='amenities'
              value='Balcony/Patio'
              className='mr-2'
              checked={fields.amenities.includes('Balcony/Patio' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_balcony_patio'>Balcony/Patio</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_smart_tv'
              name='amenities'
              value='Smart TV'
              className='mr-2'
              checked={fields.amenities.includes('Smart TV' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_smart_tv'>Smart TV</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_coffee_maker'
              name='amenities'
              value='Coffee Maker'
              className='mr-2'
              checked={fields.amenities.includes('Coffee Maker' as string) as boolean}
              onChange={checkboxHandler as ChangeEventHandler<HTMLInputElement>}
            />
            <label htmlFor='amenity_coffee_maker'>Coffee Maker</label>
          </div>
        </div>
      </div>
      <div className='mb-4 bg-blue-50 p-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Rates (Leave blank if not applicable)
        </label>
        <div
          className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'
        >
          <div className='flex items-center'>
            <label htmlFor='weekly_rate' className='mr-2'>Weekly</label>
            <input
              type='number'
              id='weekly_rate'
              name='rates.weekly'
              className='border rounded w-full py-2 px-3'
              value={fields.rates.weekly as number}
              onChange={inputHandler as ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
            />
          </div>
          <div className='flex items-center'>
            <label htmlFor='monthly_rate' className='mr-2'>Monthly</label>
            <input
              type='number'
              id='monthly_rate'
              name='rates.monthly'
              className='border rounded w-full py-2 px-3'
              value={fields.rates.monthly as number}
              onChange={inputHandler as ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
            />
          </div>
          <div className='flex items-center'>
            <label htmlFor='nightly_rate' className='mr-2'>Nightly</label>
            <input
              type='number'
              id='nightly_rate'
              name='rates.nightly'
              className='border rounded w-full py-2 px-3'
              value={fields.rates.nightly as number}
              onChange={inputHandler as ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
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
          value={fields.seller_info.name as string}
          onChange={inputHandler as ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
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
          value={fields.seller_info.email as string}
          onChange={inputHandler as ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
          required
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
          value={fields.seller_info.phone as string}
          onChange={inputHandler as ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='images'
          className='block text-gray-700 font-bold mb-2'
        >
          Images (Select up to 4 images)
        </label>
        <input
          type='file'
          id='images'
          name='images'
          className='border rounded w-full py-2 px-3'
          accept='image/*'
          onChange={imageUploadHandler as ChangeEventHandler<any>}
          multiple
          required
        />
      </div>
      <div>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
          type='submit'
        >
          Add Property
        </button>
      </div>
    </form>
  ) : null) as ReactElement
}
export default AddPropertyForm as React.FC