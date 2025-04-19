'use client'
import {
  ChangeEvent,
  ChangeEventHandler,
  FunctionComponent,
  ReactElement,
  useState
} from 'react'
import {useRouter} from 'next/navigation'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {toast} from 'react-toastify'
import SubmitButton from '@/components/SubmitButton'
import DestructuredProperty from '@/types/DestructuredProperty'
import PlainProperty from '@/types/PlainProperty'
const EditPropertyForm: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {_id}: PlainProperty = property
  const [
    propertyName,
    setPropertyName
  ] = useState<string>(property.name)
  const [
    type,
    setType
  ] = useState<string>(property.type)
  const [
    nightly,
    setNightly
  ] = useState<number | undefined>(property.rates.nightly)
  const [
    weekly,
    setWeekly
  ] = useState<number | undefined>(property.rates.weekly)
  const [
    monthly,
    setMonthly
  ] = useState<number | undefined>(property.rates.monthly)
  const [
    beds,
    setBeds
  ] = useState<number>(property.beds)
  const [
    baths,
    setBaths
  ] = useState<number>(property.baths)
  const [
    square_feet,
    setSqFt
  ] = useState<number>(property.square_feet)
  const [
    city,
    setCity
  ] = useState<string>(property.location.city)
  const [
    street,
    setStreet
  ] = useState<string>(property.location.street)
  const [
    state,
    setState
  ] = useState<string>(property.location.state)
  const [
    zipcode,
    setZip
  ] = useState<string>(property.location.zipcode)
  const [
    description,
    setDesc
  ] = useState<string>(property.description)
  const [
    sellerName,
    setSellerName
  ] = useState<string>(property.seller_info.name)
  const [
    email,
    setEmail
  ] = useState<string>(property.seller_info.email)
  const [
    phone,
    setPhone
  ] = useState<string | undefined>(property.seller_info.phone)
  const [
    amenities,
    setAmenities
  ] = useState<string[]>(property.amenities)
  const router: AppRouterInstance = useRouter()
  const handleCheckbox: ChangeEventHandler = (event: ChangeEvent<HTMLInputElement>): void => setAmenities((amenities: string[]): string[] => event.target.checked ? [
    ...amenities,
    event.target.value
  ] : amenities.filter((amenity: string): boolean => amenity !== event.target.value))
  const handleSubmit: Function = async (): Promise<void> => {
    const patch: FormData = new FormData
    propertyName !== property.name && patch.append(
      'name',
      propertyName
    )
    type !== property.type && patch.append(
      'type',
      type
    )
    nightly !== property.rates.nightly && patch.append(
      'rates.nightly',
      nightly ? nightly.toString() : 'null'
    )
    weekly !== property.rates.weekly && patch.append(
      'rates.weekly',
      weekly ? weekly.toString() : 'null'
    )
    monthly !== property.rates.monthly && patch.append(
      'rates.monthly',
      monthly ? monthly.toString() : 'null'
    )
    beds !== property.beds && patch.append(
      'beds',
      beds.toString()
    )
    baths !== property.baths && patch.append(
      'baths',
      baths.toString()
    )
    square_feet !== property.square_feet && patch.append(
      'square_feet',
      square_feet.toString()
    )
    city !== property.location.city && patch.append(
      'location.city',
      city
    )
    street !== property.location.street && patch.append(
      'location.street',
      street
    )
    state !== property.location.state && patch.append(
      'location.state',
      state
    )
    zipcode !== property.location.zipcode && patch.append(
      'location.zipcode',
      zipcode
    )
    description !== property.description && patch.append(
      'description',
      description
    )
    sellerName !== property.seller_info.name && patch.append(
      'seller_info.name',
      sellerName
    )
    email !== property.seller_info.email && patch.append(
      'seller_info.email',
      email
    )
    phone !== property.seller_info.phone && patch.append(
      'seller_info.phone',
      phone ?? 'null'
    )
    const body: Object = Object.fromEntries(patch.entries())
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${_id}`, {
        method: 'PATCH',
        body: JSON.stringify(amenities.length === property.amenities.length ? body : {
          ...body,
          amenities
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.ok) {
      toast.success('Changes saved.')
      router.push(`/properties/${_id}`)
    } else {
      toast.error(await response.text())
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
          onChange={(event: ChangeEvent<HTMLSelectElement>): void => setType(event.target.value)}
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
          required
          defaultValue={propertyName}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setPropertyName(event.target.value)}
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
          required
          defaultValue={description}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>): void => setDesc(event.target.value)}
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
          required
          defaultValue={street}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setStreet(event.target.value)}
        />
        <input
          type='text'
          id='city'
          name='location.city'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='City'
          required
          defaultValue={city}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setCity(event.target.value)}
        />
        <input
          type='text'
          id='state'
          name='location.state'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='State'
          required
          defaultValue={state}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setState(event.target.value)}
        />
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Zipcode'
          required
          defaultValue={zipcode}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setZip(event.target.value)}
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
            onChange={(event: ChangeEvent<HTMLInputElement>): void => setBeds(parseInt(event.target.value))}
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
            onChange={(event: ChangeEvent<HTMLInputElement>): void => setBaths(parseFloat(event.target.value))}
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
            onChange={(event: ChangeEvent<HTMLInputElement>): void => setSqFt(parseFloat(event.target.value))}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={handleCheckbox}
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
              onChange={(event: ChangeEvent<HTMLInputElement>): void => setWeekly(parseFloat(event.target.value))}
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
              onChange={(event: ChangeEvent<HTMLInputElement>): void => setMonthly(parseFloat(event.target.value))}
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
              onChange={(event: ChangeEvent<HTMLInputElement>): void => setNightly(parseFloat(event.target.value))}
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
          required
          defaultValue={sellerName}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setSellerName(event.target.value)}
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
          required
          defaultValue={email}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setEmail(event.target.value)}
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
          defaultValue={phone}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setPhone(event.target.value)}
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