'use client'
import {ChangeEvent, ChangeEventHandler, FunctionComponent, ReactElement, SyntheticEvent, useState} from 'react'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {useRouter} from 'next/navigation'
import {toast} from 'react-toastify'
import {FormInput, PropertySearchParams} from '@/utilities/interfaces'
const SearchPropertiesForm: FunctionComponent = (): ReactElement => {
  const router: AppRouterInstance = useRouter()
  const [fields, setFields] = useState<PropertySearchParams>({type: 'All'})
  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const {name, value}: FormInput = event.target
    setFields((previousValues: PropertySearchParams): PropertySearchParams => ({
      ...previousValues,
      [name]: value
    }))
  }
  return (
    <form
      action={`/api/properties/search?location=${fields.location}&type=${fields.type}`}
      method='GET'
      encType='multipart/form-data'
      onSubmit={(): void => router.push(`/properties/search?location=${fields.location}&type=${fields.type}`)}
      onError={(event: SyntheticEvent<HTMLFormElement, Event>) => toast.error(event.currentTarget.textContent || 'Error sending message.')}
      className='mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center'
    >
      <div className='w-full md:w-3/5 md:pr-2 mb-4 md:mb-0'>
        <label
          htmlFor='location'
          className='sr-only'
        >
          Location
        </label>
        <input
          type='text'
          id='location'
          placeholder='Enter keywords or location'
          value={fields.location}
          onChange={handleChange}
          className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500'
        />
      </div>
      <div className='w-full md:w-2/5 md:pl-2'>
        <label
          htmlFor='property-type'
          className='sr-only'
        >
          Property Type
        </label>
        <select
          id='property-type'
          value={fields.type}
          onChange={handleChange}
          className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500'
        >
          <option value='All'>
            All
          </option>
          <option value='Apartment'>
            Apartment
          </option>
          <option value='Studio'>
            Studio
          </option>
          <option value='Condo'>
            Condo
          </option>
          <option value='House'>
            House
          </option>
          <option value='Cabin Or Cottage'>
            Cabin or Cottage
          </option>
          <option value='Loft'>
            Loft
          </option>
          <option value='Room'>
            Room
          </option>
          <option value='Other'>
            Other
          </option>
        </select>
      </div>
      <button
        type='submit'
        className='md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500'
      >
        Search
      </button>
    </form>
  )
}
export default SearchPropertiesForm