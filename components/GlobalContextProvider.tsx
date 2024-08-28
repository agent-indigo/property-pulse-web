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
import {FlattenMaps} from 'mongoose'
import getUnreadMessagesCount from '@/serverActions/getUnreadMessagesCount'
import State from '@/interfaces/State'
import DestructuredReactNode from '@/interfaces/DestructuredReactNode'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import UserDocument from '@/interfaces/UserDocument'
const GlobalContext: Context<State> = createContext<State>({
  unreadMessagesCount: 0,
  setUnreadMessagesCount: null
})
const GlobalContextProvider: FunctionComponent<DestructuredReactNode> = ({children}): ReactElement => {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0)
  const [user, setUser] = useState<FlattenMaps<UserDocument> | undefined>(undefined)
  useEffect(
    (): void => {
      const getUser: Function = async (): Promise<void> => {
        const {success, sessionUser}: ServerActionResponse = await getSessionUser()
        success && sessionUser && setUser(sessionUser)
      }
      const getCount: Function = async (): Promise<void> => {
        if (user) {
          const {
            error,
            success,
            unreadMessagesCount
          }: ServerActionResponse = await getUnreadMessagesCount()
          success && unreadMessagesCount !== undefined
          ? setUnreadMessagesCount(unreadMessagesCount)
          : toast.error(`Error retrieving unread messages count:\n${error.toString()}`)
        }
      }
      getUser()
      getCount()
    },
    [user]
  )
  return (
    <GlobalContext.Provider value={{
      unreadMessagesCount,
      setUnreadMessagesCount
    }}>
      {children}
    </GlobalContext.Provider>
  )
}
export const useGlobalContext: Function = (): State => useContext<State>(GlobalContext)
export default GlobalContextProvider