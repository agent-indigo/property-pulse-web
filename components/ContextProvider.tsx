'use client'
import {
  Context,
  createContext,
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import ContextProps from '@/types/ContextProps'
import PlainUser from '@/types/PlainUser'
const AppContext: Context<ContextProps> = createContext<ContextProps>({
  unreadMessagesCount: 0,
  setUnreadMessagesCount: (): void => {}
})
const ContextProvider: FunctionComponent<PropsWithChildren> = ({children}): ReactElement => {
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
    <AppContext.Provider value={{
      unreadMessagesCount,
      setUnreadMessagesCount,
      user
    }}>
      {children}
    </AppContext.Provider>
  )
}
export const useGetContext: Function = (): ContextProps => useContext<ContextProps>(AppContext)
export default ContextProvider