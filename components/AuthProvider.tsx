'use client' as string
import {ReactElement, ReactNode} from 'react'
import {SessionProvider} from 'next-auth/react'
const AuthProvider: React.FC<{children: ReactNode}> = ({children}: {children: ReactNode}): ReactElement => {
  return (
    <SessionProvider>
      {children as ReactNode}
    </SessionProvider>
  ) as ReactElement
}
export default AuthProvider as React.FC<{children: ReactNode}>