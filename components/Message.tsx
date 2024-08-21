'use client'
import {useState, ReactElement, MouseEventHandler, FunctionComponent} from 'react'
import Link from 'next/link'
import {ObjectId} from 'mongoose'
import {useGlobalContext} from '@/components/GlobalContextProvider'
import {DestructuredMessage, GlobalState, ListedProperty, RegisteredUser} from '@/utilities/interfaces'
import {deleteMessage, switchMessageReadStatus} from '@/utilities/requests'
const Message: FunctionComponent<DestructuredMessage> = ({message}): ReactElement | null => {
  const {setUnreadCount}: GlobalState = useGlobalContext()
  const [read, setRead] = useState<boolean>(message.read as boolean)
  const [deleted, setDeleted] = useState<boolean>(false)
  const id: ObjectId | undefined = message._id
  const property: ListedProperty = message.property as ListedProperty
  const sender: RegisteredUser = message.sender as RegisteredUser
  const email: string = message.email
  const phone: string | undefined = message.phone
  const body: string | undefined = message.body
  const handleReadStatusSwitch: MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
    const success: boolean = switchMessageReadStatus(id)
    success && setRead((previousStatus: boolean): boolean => {
      const read: boolean = !previousStatus
      setUnreadCount((previousCount: number): number => read ? previousCount - 1 : previousCount + 1)
      return read
    })
  }
  const handleDelete: MouseEventHandler<HTMLButtonElement>  = async (): Promise<void> => {
    const success: boolean = await deleteMessage(id)
    if (success) {
      setDeleted(true)
      setUnreadCount((previousCount: number): number => previousCount - 1)
    }
  }
  return deleted ? null : (
    <div className='relative bg-white p-4 rounded-md shadow-md border border-gray-200'>
      {!read && (
        <div className='absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md'>
          New
        </div>
      )}
      <h2 className='text-xl mb-4'>
        <span className='font-bold'>Property Inquiry: </span>
        {property.name}
      </h2>
      {body && (
        <p className='text-gray-700'>
          {body}
        </p>
      )}
      <ul className='mt-4'>
        <li>
          <strong>Name: </strong>
          {sender.username}
        </li>
        <li>
          <strong>Reply Email: </strong>
          <Link
            href={`mailto:${email}`}
            className='text-blue-500'
          >
            {email}
          </Link>
        </li>
        {phone && (
          <li>
            <strong>Reply Phone: </strong>
            <Link
              href={`tel:${phone}`}
              className='text-blue-500'
            >
              {phone}
            </Link>
          </li>
        )}
        <li>
          <strong>Received: </strong>
          {new Date(message.createdAt as any).toLocaleString()}
        </li>
      </ul>
      <button
        onClick={handleReadStatusSwitch}
        className={`mt-4 mr-3 ${read ? 'bg-gray-300' : 'bg-blue-500 text-white'} py-1 px-3 rounded-md`}
      >
        Mark As {read ? 'Unread' : 'Read'}
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
export default Message