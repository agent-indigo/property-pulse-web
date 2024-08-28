'use client'
import {FunctionComponent, ReactElement} from 'react'
import {SessionProvider} from 'next-auth/react'
import DestructuredReactNode from '@/interfaces/DestructuredReactNode'
const AuthProvider: FunctionComponent<DestructuredReactNode> = (
  {children}
): ReactElement => (
  <SessionProvider>
    {children}
  </SessionProvider>
)
export default AuthProvider