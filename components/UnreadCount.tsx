'use client'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {useSession} from 'next-auth/react'
import {useGlobalContext} from '@/components/GlobalContextProvider'
import {getUnreadCount} from '@/utilities/requests'
import {ImportedGlobalState, SessionData} from '@/utilities/interfaces'
const UnreadCount: FunctionComponent = (): ReactElement | null => {
  const {data: session}: SessionData = useSession<boolean>() as SessionData
  const {unreadCount, setUnreadCount}: ImportedGlobalState = useGlobalContext()
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(
    (): void => {
      const getCount: Function = async (): Promise<void> => {
        setUnreadCount(await getUnreadCount())
        setLoading(false)
      }
      if (session) getCount()
    },
    [session, setUnreadCount]
  )
  return !loading && unreadCount && unreadCount > 0 ? (
    <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
      {unreadCount}
    </span>
  ) : null
}
export default UnreadCount