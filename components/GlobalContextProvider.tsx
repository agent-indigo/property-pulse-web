'use client'
import {
  Context,
  createContext,
  FunctionComponent,
  Provider,
  ReactElement,
  useContext,
  useState
} from 'react'
import {ReactNodes, GlobalState} from '@/utilities/interfaces'
const GlobalContext: Context<GlobalState> = createContext<GlobalState>({
  unreadCount: 0,
  setUnreadCount: null
})
const GlobalContextProvider: FunctionComponent<ReactNodes> = ({children}): ReactElement => {
  const ExportedProvider: Provider<GlobalState> = GlobalContext.Provider
  const [unreadCount, setUnreadCount] = useState<number>(0)
  return (
    <ExportedProvider value={{
      unreadCount,
      setUnreadCount
    }}>
      {children}
    </ExportedProvider>
  )
}
export const useGlobalContext: Function = (): GlobalState => useContext<GlobalState>(GlobalContext)
export default GlobalContextProvider