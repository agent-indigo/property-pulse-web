'use client'
import {
  Context,
  createContext,
  FunctionComponent,
  ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import {toast} from 'react-toastify'
import getUnreadMessagesCount from '@/serverActions/getUnreadMessagesCount'
import State from '@/interfaces/State'
import DestructuredReactNode from '@/interfaces/DestructuredReactNode'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import PlainUser from '@/interfaces/PlainUser'
const GlobalContext: Context<State> = createContext<State>({
  unreadMessagesCount: 0,
  setUnreadMessagesCount: (): void => {}
})
const GlobalContextProvider: FunctionComponent<DestructuredReactNode> = ({children}): ReactElement => {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0)
  const [user, setUser] = useState<PlainUser | undefined>(undefined)
  useEffect(
    (): void => {
      const getUser: Function = async (): Promise<void> => {
        const {success, sessionUser}: ServerActionResponse = await getSessionUser()
        success && sessionUser && setUser(sessionUser)
      }
      getUser()
    },
    []
  )
  useEffect(
    (): void => {
      const getCount: Function = async (): Promise<void> => {
        const {
          error,
          success,
          unreadMessagesCount
        }: ServerActionResponse = await getUnreadMessagesCount()
        success && unreadMessagesCount !== undefined
        ? setUnreadMessagesCount(unreadMessagesCount)
        : toast.error(`Error retrieving unread messages count:\n${error.toString()}`)
      }
      user && getCount()
    }
  )
  return (
    <GlobalContext.Provider value={{
      unreadMessagesCount,
      setUnreadMessagesCount,
      user
    }}>
      {children}
    </GlobalContext.Provider>
  )
}
export const useGlobalContext: Function = (): State => useContext<State>(GlobalContext)
export default GlobalContextProvider