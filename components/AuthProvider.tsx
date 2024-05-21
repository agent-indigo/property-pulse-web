'use client'
import {ReactNode} from 'react'
import {SessionProvider} from 'next-auth/react'
const AuthProvider: React.FC<{children: ReactNode}> = ({children}: {children: ReactNode}) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
export default AuthProvider