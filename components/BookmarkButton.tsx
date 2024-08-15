'use client'
import {MouseEventHandler, ReactElement, useEffect, useState} from 'react'
import {FaBookmark} from 'react-icons/fa'
import {useSession} from 'next-auth/react'
import {toast} from 'react-toastify'
import {DestructuredProperty, SessionData} from '@/utilities/interfaces'
import {getBookmarkStatus, toggleBookmark} from '@/utilities/requests'
import Spinner from '@/components/Spinner'
const BookmarkButton: React.FC<DestructuredProperty> = ({property}: DestructuredProperty): ReactElement => {
  const {data: session}: SessionData = useSession<boolean>() as SessionData
  const userId: string | undefined = session?.user?.id
  const propertyId: string | undefined = property._id?.toString()
  const [bookmarked, setBookmarked] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const buttonBg: string = bookmarked ? 'red' : 'blue'
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
    if (userId) {
      if (propertyId) {
        const result: boolean | undefined = await toggleBookmark(propertyId)
        if (result) setBookmarked(result)
      } else {
        toast.error('Error adding/removing bookmark.')
      }
    } else {
      toast.error('You are not logged in.')
      return
    }
  }
  useEffect(
    (): void => {
      const getStatus: Function = async (): Promise<void> => {
        if (userId) {
          if (propertyId) {
            const result: boolean | undefined = await getBookmarkStatus(propertyId)
            if (result) setBookmarked(result)
          } else {
            toast.error('Error checking bookmark status.')
          }
        } else {
          return
        }
      }
      getStatus()
      setLoading(false)
    },
    [propertyId, userId]
  )
  return loading ? <Spinner loading={loading}/> : (
    <button
      onClick={handleClick}
      className={`bg-${buttonBg}-500 hover:bg-${buttonBg}-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center`}
    >
      <FaBookmark className='mr-2'/> {bookmarked ? 'Remove Bookmark' : 'Bookmark'}
    </button>
  )
}
export default BookmarkButton