'use client'
import {FunctionComponent, ReactElement, useEffect} from 'react'
import {toast} from 'react-toastify'
import {useDispatch, useSelector} from 'react-redux'
import {useGetUnreadMessagesCountQuery} from '@/slices/messagesApiSlice'
import {setUnreadMessagesCount} from '@/slices/unreadMessagesCountSlice'
const UnreadCount: FunctionComponent = (): ReactElement | null => {
  const dispatch = useDispatch()
  const {data: response, isLoading, isError, error, refetch} = useGetUnreadMessagesCountQuery()
  const currentCount: number = response?.unread ?? 0
  const {unreadMessagesCount} = useSelector((state: any) => state.unreadMessagesCount)
  useEffect(
    (): void => {
      if (!isLoading) {
        if (isError) {
          toast.error(`Error retrieving unread messages count:\n${JSON.stringify(error)}`)
        } else if (!isNaN(unreadMessagesCount) && unreadMessagesCount !== currentCount) {
          dispatch(setUnreadMessagesCount(currentCount))
          refetch()
        }
      }
    },
    [isLoading, isError, error, unreadMessagesCount, currentCount, dispatch, refetch]
  )
  return !isError && !isLoading && unreadMessagesCount > 0 ? (
    <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
      {unreadMessagesCount}
    </span>
  ) : null
}
export default UnreadCount