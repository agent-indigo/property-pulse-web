'use client'
import {ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, FunctionComponent, ReactElement, useState} from 'react'
import {FaPaperPlane} from 'react-icons/fa'
import {useSession} from 'next-auth/react'
import {ObjectId} from 'mongoose'
import {DestructuredProperty, FormInput, InquiryMessage, SessionData} from '@/utilities/interfaces'
import { sendMessage } from '@/utilities/requests'
const ContactForm: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {data: session}: SessionData = useSession<boolean>() as SessionData
  const id: string | undefined = session?.user?.id
  const isOwner: boolean = id !== undefined && id === property.owner?.toString()
  const [fields, setFields] = useState<InquiryMessage>({
    recipient: property.owner as ObjectId,
    property: property._id as ObjectId,
    name: '',
    email: '',
    phone: '',
    body: ''
  })
  const [sent, setSent] = useState<boolean>(false)
  const [errorOccured, setErrorOccured] = useState<boolean>(false)
  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const {name, value}: FormInput = event.target
    setFields((previousValues: InquiryMessage): InquiryMessage => ({
      ...previousValues,
      [name]: value
    }))
  }
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const success: boolean = await sendMessage(new FormData(event.currentTarget))
    setSent(success)
    setErrorOccured(!success)
  }
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      {!sent && (
        <h3 className='text-xl text-center font-bold'>
          {id ? isOwner ? 'This is one of your listings.' : 'Inquire' : 'Log in to Inquire'}
        </h3>
      )}
      {errorOccured && (
        <p className='text-red-500 text-center py-1'>
          Error sending message.
        </p>
      )}
      {!id ? null : (
        sent ? (
          <p className='text-green-500'>
            Your message has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
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
                name='name'
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
                name='email'
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
                Phone: (Optional)
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='phone'
                name='phone'
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
                name='body'
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
      )}
    </div>
  )
}
export default ContactForm