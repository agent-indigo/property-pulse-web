'use client'
import {
  FunctionComponent,
  MouseEventHandler,
  ReactElement,
  useEffect,
  useState
} from 'react'
import {FaBookmark} from 'react-icons/fa'
import {toast} from 'react-toastify'
import Spinner from '@/components/Spinner'
import ContextProps from '@/types/ContextProps'
import {useGetContext} from '@/components/ContextProvider'
import DestructuredProperty from '@/types/DestructuredProperty'
import PlainProperty from '@/types/PlainProperty'
const BookmarkButton: FunctionComponent<DestructuredProperty> = ({property}): ReactElement | null => {
  const {user}: ContextProps = useGetContext()
  const {_id}: PlainProperty = property
  const [
    bookmarked,
    setBookmarked
  ] = useState<boolean>(false)
  const buttonBg: string = bookmarked ? 'red' : 'blue'
  const [
    loading,
    setLoading
  ] = useState<boolean>(true)
  const [
    errorOccured,
    setErrorOccured
  ] = useState<boolean>(false)
  useEffect((): void => {(async (): Promise<void> => {
    if (user) {
      const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/bookmarked/status/${_id}`)
      if (response.ok) {
        setBookmarked((await response.json()).bookmarked)
      } else {
        setErrorOccured(true)
        toast.error(await response.text())
      }
    }
    setLoading(false)
  })()}, [
    _id,
    user
  ])
  const handleClick: MouseEventHandler = async (): Promise<void> => {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/bookmarked/status/${_id}`, {
        method: 'PATCH'
      }
    )
    if (response.ok) {
      const bookmarked: boolean = (await response.json()).bookmarked
      setBookmarked(bookmarked)
      toast.success(`Bookmark ${bookmarked ? 'added' : 'removed'}.`)
    } else {
      toast.error(await response.text())
    }
  }
  return loading ? (
    <Spinner loading={loading}/>
  ) : errorOccured ? (
    <h1 className='text-red-500 text-center font-bold'>
      Error checking bookmark status.
    </h1>
  ) : user && user._id === property.owner ? (
    null
  ) : (
    <button
      disabled={!user}
      onClick={handleClick}
      className={`bg-${buttonBg}-500 hover:bg-${buttonBg}-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center`}
    >
      <FaBookmark className='mr-2'/> {!user && 'Log in to '}{bookmarked ? 'Remove Bookmark' : 'Bookmark'}
    </button>
  )
}
export default BookmarkButton