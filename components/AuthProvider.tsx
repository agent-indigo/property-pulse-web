'use client'
import {ReactElement, ReactNode} from 'react'
import {SessionProvider} from 'next-auth/react'
const AuthProvider: React.FC<{children: ReactNode}> = ({children}: {children: ReactNode}): ReactElement => <SessionProvider>{children}</SessionProvider>
export default AuthProvider