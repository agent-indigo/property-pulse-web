import {
  FunctionComponent,
  ReactElement
} from 'react'
import Link from 'next/link'
import DestructuredMessage from '@/src/library/types/DestructuredMessage'
import PlainMessage from '@/src/library/types/PlainMessage'
import PlainUser from '@/src/library/types/PlainUser'
import PlainProperty from '@/src/library/types/PlainProperty'
import ToggleMessageReadButton from './ToggleMessageReadButton'
import DeleteMessageButton from './DeleteMessageButton'
const MessageCard: FunctionComponent<DestructuredMessage> = ({message}): ReactElement | null => {
  const {
    _id,
    body,
    email,
    phone,
    read,
    property,
    sender,
    createdAt
  }: PlainMessage = message
  const {username}: PlainUser = sender
  const {
    _id: propertyId,
    name
  }: PlainProperty = property
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
      <ToggleMessageReadButton
        _id={_id}
        read={read}
      />
      <DeleteMessageButton _id={_id}/>
    </div>
  )
}
export default MessageCard