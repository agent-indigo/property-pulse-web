'use client'
import {ChangeEvent, ChangeEventHandler, FunctionComponent, ReactElement, SyntheticEvent, useState} from 'react'
import {FaPaperPlane} from 'react-icons/fa'
import {useSession} from 'next-auth/react'
import {toast} from 'react-toastify'
import {ObjectId} from 'mongoose'
import {DestructuredProperty, FormInput, InquiryMessage, SessionData} from '@/utilities/interfaces'
const ContactForm: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {data: session}: SessionData = useSession<boolean>() as SessionData
  const id: string | undefined = session?.user?.id
  const [fields, setFields] = useState<InquiryMessage>({
    recipient: property.owner as ObjectId,
    property: property._id as ObjectId,
    name: '',
    email: ''
  })
  const [sent, setSent] = useState<boolean>(false)
  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const {name, value}: FormInput = event.target
    setFields((previousValues: InquiryMessage): InquiryMessage => ({
      ...previousValues,
      [name]: value
    }))
  }
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h3 className='text-xl text-center font-bold'>
        {id ? id === property.owner?.toString() ? 'This is one of your listings.' : 'Inquire' : 'Log in to Inquire'}
      </h3>
      {id  && id !== property.owner?.toString() ? (
        sent ? (
          <p className='text-green-500'>
            Your message has been sent.
          </p>
        ) : (
          <form
            action='/api/messages'
            method='POST'
            encType='multipart/form-data'
            onSubmit={(): void => setSent(true)}
            onError={(event: SyntheticEvent<HTMLFormElement, Event>) => toast.error(event.currentTarget.textContent || 'Error sending message.')}
          >
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='name'
            >
              Name:
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='name'
              type='text'
              placeholder='Enter your name'             
              required
              value={fields.name}
              onChange={handleChange}
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
                type='email'
                placeholder='Enter your email'
                required
                value={fields.email}
                onChange={handleChange}
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
                type='text'
                placeholder='Enter your phone number'
                value={fields.phone}
                onChange={handleChange}
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
                placeholder='Enter your message'
                value={fields.body}
                onChange={handleChange}
              />
            </div>
            <div>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center'
                type='submit'
              >
                <FaPaperPlane className='mr-2'/> Send
              </button>
            </div>
          </form>
        )
      ) : null}
    </div>
  )
}
export default ContactForm