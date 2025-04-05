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
import State from '@/interfaces/State'
import DestructuredReactNode from '@/interfaces/DestructuredReactNode'
import PlainUser from '@/interfaces/PlainUser'
const GlobalContext: Context<State> = createContext<State>({
  unreadMessagesCount: 0,
  setUnreadMessagesCount: (): void => {}
})
const GlobalContextProvider: FunctionComponent<DestructuredReactNode> = ({children}): ReactElement => {
  const [
    unreadMessagesCount,
    setUnreadMessagesCount
  ] = useState<number>(0)
  const [
    user,
    setUser
  ] = useState<PlainUser | undefined>(undefined)
  useEffect((): void => {(async (): Promise<void> => {
    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/user`)
    response.ok && setUser(await response.json())
  })()}, [])
  useEffect((): void => {
    const getCount: Function = async (): Promise<void> => {
      const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/unreadCount`)
      response.ok && setUnreadMessagesCount((await response.json()).unread)
    }
    user && getCount()
  })
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