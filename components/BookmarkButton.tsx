'use client'
import {FunctionComponent, MouseEventHandler, ReactElement, useEffect} from 'react'
import {toast} from 'react-toastify'
import {FaBookmark} from 'react-icons/fa'
import {useSession} from 'next-auth/react'
import {DestructuredProperty, SessionData} from '@/utilities/interfaces'
import {useGetPropertyBookmarkedStatusQuery, useTogglePropertyBookmarkedStatusMutation} from '@/slices/propertiesApiSlice'
import Spinner from '@/components/Spinner'
const BookmarkButton: FunctionComponent<DestructuredProperty> = ({property}): ReactElement | null => {
  const {data: session}: SessionData = useSession<boolean>() as SessionData
  const userId: string = session?.user?.id ?? ''
  const propertyId: string = property._id?.toString() ?? ''
  const owner: string = property.owner?.toString() ?? ''
  const loggedIn: boolean = userId !== ''
  const isOwner: boolean = loggedIn && owner === userId
  const {data: response, isLoading, isError, error, refetch} = useGetPropertyBookmarkedStatusQuery(propertyId)
  const [toggleBookmark, {isLoading: toggling, isError: toggleFailed, error: toggleError}] = useTogglePropertyBookmarkedStatusMutation()
  const bookmarked: boolean = loggedIn ? response?.bookmarked ?? false : false
  const buttonBg: string = bookmarked ? 'red' : 'blue'
  useEffect(
    (): void => {
      if (!isLoading) isError && toast.error(`Error retrieving bookmark status:\n${JSON.stringify(error)}`)
    },
    [isError, error, isLoading]
  )
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
    await toggleBookmark(propertyId)
    if (!toggling) toggleFailed ? toast.error(`Error adding/removing bookmark:\n${JSON.stringify(toggleError)}`) : refetch()
  }
  return isLoading ? <Spinner loading={isLoading}/> : isError ? (
    <h1 className='text-red-500 text-center font-bold'>
      Error checking bookmark status.
    </h1>
  ) : isOwner ? null : (
    <button
      onClick={handleClick}
      disabled={!loggedIn}
      className={`bg-${buttonBg}-500 hover:bg-${buttonBg}-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center`}
    >
      <FaBookmark className='mr-2'/> {loggedIn ? null : 'Log in to '}{bookmarked ? 'Remove Bookmark' : 'Bookmark'}
    </button>
  )
}
export default BookmarkButton