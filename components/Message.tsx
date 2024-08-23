'use client'
import {useState, ReactElement, MouseEventHandler, FunctionComponent} from 'react'
import Link from 'next/link'
import {useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import {DestructuredMessage, ListedProperty, RegisteredUser, ResourceStatusResponse} from '@/utilities/interfaces'
import {useDeleteMessageMutation, useToggleMessageReadStatusMutation} from '@/slices/messagesApiSlice'
import { decrementUnreadMessagesCount, incrementUnreadMessagesCount } from '@/slices/unreadMessagesCountSlice'
const Message: FunctionComponent<DestructuredMessage> = ({message}): ReactElement | null => {
  const dispatch = useDispatch()
  const [deleteMessage, {
    isLoading: deleting,
    isError: deleteFailed,
    error: deleteError
  }] = useDeleteMessageMutation()
  const [togggleMessageReadStatus, {
    isLoading: toggling,
    isError: toggleFailed,
    error: toggleError
  }] = useToggleMessageReadStatusMutation()
  const [read, setRead] = useState<boolean>(message.read as boolean)
  const [deleted, setDeleted] = useState<boolean>(false)
  const id: string = message._id?.toString() ?? ''
  const property: ListedProperty = message.property as ListedProperty
  const sender: RegisteredUser = message.sender as RegisteredUser
  const email: string = message.email
  const phone: string | undefined = message.phone
  const body: string | undefined = message.body
  const handleReadStatusSwitch: MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
    const {read}: ResourceStatusResponse =  await togggleMessageReadStatus(id).unwrap()
    if (!toggling) {
      if (toggleFailed) {
        toast.error(`Error marking message as read/unread:\n${JSON.stringify(toggleError)}`)
      } else {
        if (read !== undefined) {
          setRead(read)
          read ? dispatch(decrementUnreadMessagesCount()) : dispatch(incrementUnreadMessagesCount())
          toast.success(`Message marked as ${read ? 'read' : 'unread'}.`)
        } else {
          toast.error('Error marking message as read/unread.')
        }
      }
    }
  }
  const handleDelete: MouseEventHandler<HTMLButtonElement>  = async (): Promise<void> => {
    await deleteMessage(id)
    if (!deleting) {
      if (deleteFailed) {
        toast.error(`Error deleting message:\n${JSON.stringify(deleteError)}`)
      } else {
        setDeleted(true)
        toast.success('Message deleted.')
      }
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