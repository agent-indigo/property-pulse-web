'use client'
import {FunctionComponent, MouseEventHandler, ReactElement, useState} from 'react'
import {toast} from 'react-toastify'
import {useGlobalContext} from '@/components/GlobalContextProvider'
import {deleteMessage, toggleMessageReadStatus} from '@/utilities/actions'
import {ActionResponse, DestructuredSerializedMessage, GlobalState} from '@/utilities/interfaces'
const MessageCard: FunctionComponent<DestructuredSerializedMessage> = ({message}): ReactElement | null => {
  const messageId: string = message._id
  const email: string = message.email
  const phone: string = message.phone
  const [read, setRead] = useState<boolean>(message.read)
  const {setUnreadMessagesCount}: GlobalState = useGlobalContext()
  const handleToggle: MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
    const {error, message, read, success}: ActionResponse = await toggleMessageReadStatus(messageId)
    if (success && read !== undefined) {
      setRead(read)
      setUnreadMessagesCount((previousValue: number) => read ? previousValue - 1 : previousValue + 1)
      toast.success(message)
    } else {
      toast.error(`Error marking message as read/unread:\n${error.toString()}`)
    }
  }
  const handleDelete: MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
    const {error, message, success}: ActionResponse = await deleteMessage(messageId)
    if (success) {
      setUnreadMessagesCount((previousValue: number) => previousValue - 1)
      toast.success(message)
    } else {
      toast.error(`Error deleting message:\n${error.toString()}`)
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
        <span className='font-bold'>
          Inquiry:
        </span>
        {message.property.name}
      </h2>
      <p className='text-gray-700'>
        {message.body}
      </p>
      <ul className='mt-4'>
        <li>
          {message.sender.username}
        </li>
        <li>
          <a
            href={`mailto:${email}`}
            className='text-blue-500'
          >
            {email}
          </a>
        </li>
        <li>
          <a
            href={`tel:${phone}`}
            className='text-blue-500'
          >
            {phone}
          </a>
        </li>
        <li>
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        onClick={handleToggle}
        className={`mt-4 mr-3 ${read ? 'bg-gray-300' : 'bg-blue-500 text-white'} py-1 px-3 rounded-md`}
      >
        `Mark as {read ? 'unread' : 'read'}`
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