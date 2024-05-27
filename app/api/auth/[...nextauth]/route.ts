import {NextApiHandler} from 'next'
import NextAuth from 'next-auth/next'
import authOptions from '@/utilities/authOptions'
const NextAuthHandler: NextApiHandler = NextAuth(authOptions)
export {NextAuthHandler as GET, NextAuthHandler as POST}