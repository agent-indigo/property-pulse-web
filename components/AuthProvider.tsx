'use client'
import {
  FunctionComponent,
  PropsWithChildren,
  ReactElement
} from 'react'
import {SessionProvider} from 'next-auth/react'
const AuthProvider: FunctionComponent<PropsWithChildren> = ({children}): ReactElement => (
  <SessionProvider>
    {children}
  </SessionProvider>
)
export default AuthProvider