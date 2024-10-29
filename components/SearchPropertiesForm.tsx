'use client'
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  FunctionComponent,
  ReactElement,
  useState
} from 'react'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {useRouter} from 'next/navigation'
import PropertySearchParams from '@/interfaces/PropertySearchParams'
import FormInput from '@/interfaces/FormInput'
const SearchPropertiesForm: FunctionComponent = (): ReactElement => {
  const router: AppRouterInstance = useRouter()
  const [
    fields,
    setFields
  ] = useState<PropertySearchParams>({
    type: 'All'
  })
  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const {
      name,
      value
    }: FormInput = event.target
    setFields((previousValues: PropertySearchParams): PropertySearchParams => ({
      ...previousValues,
      [name]: value
    }))
  }
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    router.push(`/properties/search?location=${fields.location}&type=${fields.type}&page=1`)
  }
  return (
    <form
      onSubmit={handleSubmit}
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
          name='location'
          placeholder='Enter keywords or location'
          value={fields.location}
          onChange={handleChange}
          className='w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500'
        />
      </div>
      <div className='w-full md:w-2/5 md:pl-2'>
        <label
          htmlFor='type'
          className='sr-only'
        >
          Property Type
        </label>
        <select
          id='type'
          name='type'
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