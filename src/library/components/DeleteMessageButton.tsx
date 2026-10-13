'use client'
import {
  FunctionComponent,
  MouseEventHandler,
  ReactElement
} from 'react'
import {toast} from 'react-toastify'
import {useGetContext} from '@/components/ContextProvider'
import ContextProps from '@/types/ContextProps'
import DestructuredId from '@/types/DestructuredId'
const DeleteMessageButton: FunctionComponent<DestructuredId> = ({_id}): ReactElement => {
  const {setUnreadMessagesCount}: ContextProps = useGetContext()
  const handleDelete: MouseEventHandler = async (): Promise<void> => {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/${_id}`, {
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
    <button
      onClick={handleDelete}
      className='mt-4 bg-red-500 text-white py-1 px-3 rounded-md'
    >
      Delete
    </button>
  )
}
export default DeleteMessageButton