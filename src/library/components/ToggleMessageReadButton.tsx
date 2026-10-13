'use client'
import {
  FunctionComponent,
  MouseEventHandler,
  ReactElement,
  useState
} from 'react'
import {toast} from 'react-toastify'
import {useGetContext} from '@/src/library/components/ContextProvider'
import ContextProps from '@/src/library/types/ContextProps'
import ToggleMsgReadBtnProps from '@/src/library/types/ToggleMsgReadBtnProps'
import PlainMessage from '@/src/library/types/PlainMessage'
const ToggleMessageReadButton: FunctionComponent<ToggleMsgReadBtnProps> = ({_id, read}): ReactElement => {
  const {setUnreadMessagesCount}: ContextProps = useGetContext()
  const [
    messageRead,
    setMessageRead
  ] = useState<boolean>(read)
  const handleToggle: MouseEventHandler = async (): Promise<void> => {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/${_id}`, {
        method: 'PATCH'
      }
    )
    if (response.ok) {
      const {read}: PlainMessage = await response.json()
      setMessageRead(read)
      setUnreadMessagesCount((previousValue: number): number => read ? previousValue - 1 : previousValue + 1)
      toast.success(`Message marked as ${read ? 'read' : 'unread'}.`)
    } else {
      toast.error(await response.text())
    }
  }
  return (
    <button
      onClick={handleToggle}
      className={`mt-4 mr-3 ${read ? 'bg-gray-300' : 'bg-blue-500 text-white'} py-1 px-3 rounded-md`}
    >
      Mark as {read ? 'unread' : 'read'}
    </button>
  )
}
export default ToggleMessageReadButton