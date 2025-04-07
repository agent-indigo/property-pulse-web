'use client'
import {
  FunctionComponent,
  MouseEventHandler,
  ReactElement,
  useState
} from 'react'
import {toast} from 'react-toastify'
import Link from 'next/link'
import {useGetContext} from '@/components/ContextProvider'
import ContextProps from '@/interfaces/ContextProps'
import DestructuredMessage from '@/interfaces/DestructuredMessage'
import PlainMessage from '@/interfaces/PlainMessage'
import PlainUser from '@/interfaces/PlainUser'
import PlainProperty from '@/interfaces/PlainProperty'
const MessageCard: FunctionComponent<DestructuredMessage> = ({message}): ReactElement | null => {
  const {
    _id: messageId,
    body,
    email,
    phone,
    read: messageRead,
    property,
    sender,
    createdAt
  }: PlainMessage = message
  const {username}: PlainUser = sender
  const {
    _id: propertyId,
    name
  }: PlainProperty = property
  const [
    read,
    setRead
  ] = useState<boolean>(messageRead)
  const {setUnreadMessagesCount}: ContextProps = useGetContext()
  const handleToggle: MouseEventHandler = async (): Promise<void> => {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/${messageId}`, {
        method: 'PATCH'
      }
    )
    if (response.ok) {
      const {read}: PlainMessage = await response.json()
      setRead(read)
      setUnreadMessagesCount((previousValue: number): number => read ? previousValue - 1 : previousValue + 1)
      toast.success(`Message marked as ${read ? 'read' : 'unread'}.`)
    } else {
      toast.error(await response.text())
    }
  }
  const handleDelete: MouseEventHandler = async (): Promise<void> => {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/${messageId}`, {
        method: 'DELETE'
      }
    )
    if (response.ok) {
      setUnreadMessagesCount((previousValue: number): number => previousValue - 1)
      toast.success('Message deleted.')
    } else {
      toast.error(await response.text())
    }
  }
  return (
    <div className='relative bg-white p-4 rounded-md shadow-md border border-gray-200'>
      {!read && (
        <div className='absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md'>
          New
        </div>
      )}
      <h2 className='text-xl mb-4'>
        <Link
          href={`/properties/${propertyId}`}
          className='text-blue-500'
        >
          {name}
        </Link>
      </h2>
      {body && (
        <p className='text-gray-700'>
          {body}
        </p>
      )}
      <ul className='mt-4'>
        <li>
          {username}
        </li>
        <li>
          <a
            href={`mailto:${email}`}
            className='text-blue-500'
          >
            {email}
          </a>
        </li>
        {phone && (
          <li>
            <a
              href={`tel:${phone}`}
              className='text-blue-500'
            >
              {phone}
            </a>
          </li>
        )}
        <li>
          {new Date(createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        onClick={handleToggle}
        className={`mt-4 mr-3 ${read ? 'bg-gray-300' : 'bg-blue-500 text-white'} py-1 px-3 rounded-md`}
      >
        Mark as {read ? 'unread' : 'read'}
      </button>
      <button
        onClick={handleDelete}
        className='mt-4 bg-red-500 text-white py-1 px-3 rounded-md'
      >
        Delete
      </button>
    </div>
  )
}
export default MessageCard