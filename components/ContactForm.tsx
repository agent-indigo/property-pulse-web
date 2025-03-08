'use client'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {toast} from 'react-toastify'
import SubmitButton from '@/components/SubmitButton'
import State from '@/interfaces/State'
import {useGlobalContext} from '@/components/GlobalContextProvider'
import DestructuredProperty from '@/interfaces/DestructuredProperty'
import PlainProperty from '@/interfaces/PlainProperty'
const ContactForm: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {
    _id,
    owner
  }: PlainProperty = property
  const {user}: State = useGlobalContext()
  const isOwner: boolean = user?._id === owner
  const handleSubmit: Function = async (body: FormData): Promise<void> => {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages`, {
        method: 'POST',
        body
      }
    )
    response.ok ? toast.success('Message sent.') : toast.error(await response.text())
  }
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h3 className='text-xl text-center font-bold py-1'>
        {user ? isOwner ? 'This is one of your properties.' : 'Inquiry Form' : 'Log in to Inquire'}
      </h3>
      {user && !isOwner && (
        <form action={handleSubmit.bind(null)}>
          <input
            type='hidden'
            id='property'
            name='property'
            required
            readOnly
            defaultValue={_id}
          />
          <input
            type='hidden'
            id='recipient'
            name='recipient'
            required
            readOnly
            defaultValue={owner}
          />
          <div className='mb-4'>
            <label
              htmlFor='name'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='email'
            >
              Email:
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='email'
              name='email'
              type='email'
              placeholder='Enter your email'
              required
            />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='phone'
            >
              Phone:
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='phone'
              name='phone'
              type='text'
              placeholder='Enter your phone number'
            />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='body'
            >
              Message:
            </label>
            <textarea
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline'
              id='body'
              name='body'
              placeholder='Enter your message'
            />
          </div>
          <div>
            <SubmitButton
              message='Sending...'
              action='Send Message'
            />
          </div>
        </form>
      )}
    </div>
  )
}
export default ContactForm