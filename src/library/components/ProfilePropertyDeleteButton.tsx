'use client'
import {
  FunctionComponent,
  MouseEventHandler,
  ReactElement
} from 'react'
import {toast} from 'react-toastify'
import DestructuredId from '@/types/DestructuredId'
const ProfilePropertyDeleteButton: FunctionComponent<DestructuredId> = ({_id}): ReactElement => {
  const handleDelete: MouseEventHandler = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${_id}`, {
          method: 'DELETE'
        }
      )
      response.ok ? toast.success('Property deleted.') : toast.error(await response.text())
    }
  }
  return (
    <button
      onClick={handleDelete}
      type='button'
      className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600'
    >
      Delete Property
    </button>
  )
}
export default ProfilePropertyDeleteButton