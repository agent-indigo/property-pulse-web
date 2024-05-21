import {NextApiHandler} from 'next'
import NextAuth from 'next-auth/next'
import authOptions from '@/utilities/authOptions'
const logInHandler: NextApiHandler = NextAuth(authOptions)
export {logInHandler as GET, logInHandler as POST}