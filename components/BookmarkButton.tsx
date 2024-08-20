'use client'
import {FunctionComponent, MouseEventHandler, ReactElement, useEffect, useState} from 'react'
import {FaBookmark} from 'react-icons/fa'
import {useSession} from 'next-auth/react'
import {DestructuredProperty, SessionData} from '@/utilities/interfaces'
import {getBookmarkStatus, toggleBookmark} from '@/utilities/requests'
import Spinner from '@/components/Spinner'
const BookmarkButton: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {data: session}: SessionData = useSession<boolean>() as SessionData
  const userId: string | undefined = session?.user?.id
  const propertyId: string | undefined = property._id?.toString()
  const [bookmarked, setBookmarked] = useState<boolean>(false)
  const [errorOccured, setErrorOccured] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const buttonBg: string = bookmarked ? 'red' : 'blue'
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
    if (userId && userId !== '') {
      if (propertyId) {
        const result: boolean | undefined = await toggleBookmark(propertyId)
        if (result) setBookmarked(result)
      }
    }
  }
  useEffect(
    (): void => {
      const getStatus: Function = async (): Promise<void> => {
        if (userId && userId !== '') {
          if (propertyId) {
            const result: boolean | undefined = await getBookmarkStatus(propertyId)
            result !== undefined ? setBookmarked(result) : setErrorOccured(true)
          }
        }
        setLoading(false)
      }
      getStatus()
    },
    [propertyId, userId]
  )
  return loading ? <Spinner loading={loading}/> : errorOccured ? (
    <h1 className='text-red-500 text-center font-bold'>
      Error checking bookmark status.
    </h1>
  ) : (
    <button
      onClick={handleClick}
      disabled={!userId || userId === ''}
      className={`bg-${buttonBg}-500 hover:bg-${buttonBg}-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center`}
    >
      <FaBookmark className='mr-2'/> {userId && userId !== '' ? null : 'Log in to '}{bookmarked ? 'Remove Bookmark' : 'Bookmark'}
    </button>
  )
}
export default BookmarkButton