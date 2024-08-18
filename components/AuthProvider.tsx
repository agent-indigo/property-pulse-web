'use client'
import {FunctionComponent, ReactElement} from 'react'
import {SessionProvider} from 'next-auth/react'
import {ReactNodes} from '@/utilities/interfaces'
const AuthProvider: FunctionComponent<ReactNodes> = (
  {children}
): ReactElement => (
  <SessionProvider>
    {children}
  </SessionProvider>
)
export default AuthProvider