'use client'
import {Context, createContext, FunctionComponent, ReactElement, useContext, useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import getSessionUser from '@/utilities/getSessionUser'
import {getUnreadMessagesCount} from '@/utilities/actions'
import {ReactNodes, GlobalState, ActionResponse} from '@/utilities/interfaces'
const GlobalContext: Context<GlobalState> = createContext<GlobalState>({
  unreadMessagesCount: 0,
  setUnreadMessagesCount: null
})
const GlobalContextProvider: FunctionComponent<ReactNodes> = ({children}): ReactElement => {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0)
  useEffect(
    (): void => {
      const getCount: Function = async (): Promise<void> => {
        if (await getSessionUser()) {
          const {error, success, unreadMessagesCount}: ActionResponse = await getUnreadMessagesCount()
          success && unreadMessagesCount ? setUnreadMessagesCount(unreadMessagesCount) : toast.error(`Error retrieving unread messages count:\n${error.toString()}`)
        }
      }
      getCount()
    },
    []
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
export const useGlobalContext: Function = (): GlobalState => useContext<GlobalState>(GlobalContext)
export default GlobalContextProvider