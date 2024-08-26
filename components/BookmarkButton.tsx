'use client'
import {FunctionComponent, MouseEventHandler, ReactElement, useEffect, useState} from 'react'
import {FaBookmark} from 'react-icons/fa'
import {toast} from 'react-toastify'
import getSessionUser from '@/utilities/getSessionUser'
import {getBookmarkStatus, toggleBookmark} from '@/utilities/actions'
import {ActionResponse, DestructuredSerializedProperty, RegisteredUser} from '@/utilities/interfaces'
import Spinner from '@/components/Spinner'
const BookmarkButton: FunctionComponent<DestructuredSerializedProperty> = ({property}): ReactElement | null => {
  const user: RegisteredUser | undefined = getSessionUser()
  const propertyId: string = property._id
  const [bookmarked, setBookmarked] = useState<boolean>(false)
  const buttonBg: string = bookmarked ? 'red' : 'blue'
  const [loading, setLoading] = useState<boolean>(true)
  const [errorOccured, setErrorOccured] = useState<boolean>(false)
  useEffect(
    (): void => {
      const getStatus: Function = async (propertyId: string): Promise<void> => {
        const {bookmarked, error, success}: ActionResponse = await getBookmarkStatus(propertyId)
        if (success && bookmarked !== undefined) {
          setBookmarked(bookmarked)
        } else {
          setErrorOccured(true)
          toast.error(error)
        }
        setLoading(false)
      }
      getStatus(propertyId)
    },
    [propertyId]
  )
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
    const {bookmarked, error, message, success}: ActionResponse = await toggleBookmark(propertyId)
    if (success && bookmarked !== undefined) {
      setBookmarked(bookmarked)
      toast.success(message)
    } else {
      toast.error(error)
    }
  }
  return loading ? <Spinner loading={loading}/> : errorOccured ? (
    <h1 className='text-red-500 text-center font-bold'>
      Error checking bookmark status.
    </h1>
  ) : user?.id === property.owner ? null : (
    <button
      disabled={!user}
      onClick={handleClick}
      className={`bg-${buttonBg}-500 hover:bg-${buttonBg}-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center`}
    >
      <FaBookmark className='mr-2'/>
      {!user && 'Log in to '}{bookmarked ? 'Remove Bookmark' : 'Bookmark'}
    </button>
  )
}
export default BookmarkButton