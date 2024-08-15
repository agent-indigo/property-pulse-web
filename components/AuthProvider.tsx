'use client'
import {ReactElement} from 'react'
import {SessionProvider} from 'next-auth/react'
import {ReactNodes} from '@/utilities/interfaces'
const AuthProvider: React.FC<ReactNodes> = (
  {children}: ReactNodes
): ReactElement => (
  <SessionProvider>
    {children}
  </SessionProvider>
)
export default AuthProvider